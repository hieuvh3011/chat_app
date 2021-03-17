import jwtHelper from "../helper/JwtHelper";

const debug = console.log.bind(console);

/**
 * Middleware: Authorization user by Token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const isAuth = async (req, res, next): Promise<void> => {
  const tokenFromClient = req.header("Authorization").replace("Bearer ", "");

  if (tokenFromClient) {
    try {
      req.jwtDecoded = await jwtHelper.verifyToken(tokenFromClient);
      console.log("req.jwtDecoded = ", req.jwtDecoded);
      next();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: "Token expired",
        });
      }
      debug("Error while verify token:", error);
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }
  } else {
    return res.status(403).send({
      message: "No token provided.",
    });
  }
};

export default {isAuth};
