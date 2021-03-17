import UserDTO from "../dto/UserDTO";

const jwtHelper = require("jsonwebtoken");
export const generateToken = (
  user: UserDTO,
): Promise<string> => {
  const secretSignature = process.env.ACCESS_TOKEN_SECRET || 'hieudeptrai';
  const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '24h';
  console.log('secretSignature: ',secretSignature);
  console.log('accessTokenLife: ',accessTokenLife);
  return new Promise((resolve, reject) => {
    const userData = {
      id: user.id,
      email: user.email,
    };
    jwtHelper.sign(
      { data: userData },
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: accessTokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
      }
    );
  });
};

export const verifyToken = (token: string) => {
  const secretSignature = process.env.ACCESS_TOKEN_SECRET || 'hieudeptrai';
  return new Promise((resolve, reject) => {
    jwtHelper.verify(token, secretSignature , (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
};

export default {
  generateToken,
  verifyToken,
};
