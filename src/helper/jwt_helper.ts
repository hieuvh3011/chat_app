import UserDTO from "../dto/UserDTO";

const jwt_helper = require("jsonwebtoken");
const generateToken = (
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
    jwt_helper.sign(
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

const verifyToken = (token: string) => {
  const secretSignature = process.env.ACCESS_TOKEN_SECRET || 'hieudeptrai';
  return new Promise((resolve, reject) => {
    jwt_helper.verify(token, secretSignature , (error, decoded) => {
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
