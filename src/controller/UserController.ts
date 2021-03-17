import UserDTO from "../dto/UserDTO";
import { generateToken, verifyToken } from "../helper/JwtHelper";
import User from "../entities/User";
import ResponseForm from "../helper/ResponseForm";
import * as CODE from "../helper/Code";

const bcrypt = require("bcryptjs");
const { QueryTypes } = require("sequelize");

const getToken = async (userDTO: UserDTO): Promise<UserDTO> => {
  const accessToken = await generateToken(userDTO);
  userDTO.access_token = accessToken;
  return userDTO;
};

const getHashedPasswordByEmail = async (email: string): Promise<string> => {
  const password = await User.findOne({
    where: { email },
    attributes: ["hash_password"],
  });
  console.log("password = ", password["dataValues"]["hash_password"]);
  return password["dataValues"]["hash_password"];
};

const getUserByEmail = async (email: string): Promise<any> => {
  const user = await User.findOne({ where: { email: email } });
  if (user === null) {
    return -1;
  }
  return user["dataValues"];
};

const getUserByPhone = async (phone: string): Promise<any> => {
  const user = await User.findOne({ where: { phone: phone } });
  if (user === null) {
    return -1;
  }
  return user["dataValues"];
};

const getUserDTOByEmail = async (email: string): Promise<UserDTO> => {
  const user = await getUserByEmail(email);
  const userDTO: UserDTO = {
    id: user.id,
    full_name: user.fullName,
    email: user.email,
    phone: user.phone,
    contact_list: [],
    access_token: "",
  };
  return userDTO;
};

const onRegister = async (req, res): Promise<any> => {
  const { full_name, email, phone, password } = req.body;
  const resBody = new ResponseForm();
  if (!email) {
    resBody.status = CODE.ERROR.AUTH.MISSING_EMAIL;
    resBody.message = "Email is required!";
  } else if (email && !isEmail(email)) {
    resBody.status = CODE.ERROR.AUTH.INVALID_EMAIL;
    resBody.message = "Email is incorrect form";
  } else if (!password) {
    resBody.status = CODE.ERROR.AUTH.MISSING_PASSWORD;
    resBody.message = "Password is required!";
  } else if (password && isWeakPassword(password)) {
    resBody.status = CODE.ERROR.AUTH.WEAK_PASSWORD;
    resBody.message = "Weak password";
  } else if (!full_name) {
    resBody.status = CODE.ERROR.AUTH.MISSING_NAME;
    resBody.message = "Your name is required!";
  } else if (!phone) {
    resBody.status = CODE.ERROR.AUTH.MISSING_PHONE;
    resBody.message = "Your phone number is required!";
  } else {
    const isEmailExist = await isUserExist(email);
    const isPhoneExist = await isPhoneNumberExist(phone);
    if (isEmailExist) {
      resBody.message = "Email is already exist!";
      resBody.status = CODE.ERROR.AUTH.EMAIL_ALREADY_EXIST;
      resBody.data = [];
    } else if (isPhoneExist) {
      resBody.message = "Phone number is already exist!";
      resBody.status = CODE.ERROR.AUTH.PHONE_ALREADY_EXIST;
      resBody.data = [];
    } else {
      await storeUser(email, password, full_name, phone);
      resBody.status = CODE.SUCCESS_CODE;
      resBody.message = "Register successfully!";
      resBody.data = await getUserByEmail(email);
    }
  }
  res.send(resBody);
};

const onLogin = async (req, res): Promise<any> => {
  const { email, password } = req.body;
  const resBody = new ResponseForm();
  console.log("req body = ", req.body);
  if (!email) {
    resBody.status = CODE.ERROR.AUTH.MISSING_EMAIL;
    resBody.message = "Email is required!";
  } else if (email && !isEmail(email)) {
    resBody.status = CODE.ERROR.AUTH.INVALID_EMAIL;
    resBody.message = "Email is incorrect form";
  } else if (!password) {
    resBody.status = CODE.ERROR.AUTH.MISSING_PASSWORD;
    resBody.message = "Password is required!";
  } else if (password && isWeakPassword(password)) {
    resBody.status = CODE.ERROR.AUTH.WEAK_PASSWORD;
    resBody.message = "Weak password";
  } else {
    const isCorrect = await isCorrectUser(email, password);
    if (!isCorrect) {
      resBody.status = CODE.ERROR.AUTH.INCORRECT_PASSWORD;
      resBody.message = "Email or password is incorrect";
      resBody.data = [];
    } else {
      // const employee = await getEmployeeByEmail(email);
      const result = await getUserDTOByEmail(email);
      await getToken(result);
      if (!result) {
        resBody.status = CODE.ERROR.AUTH.NOT_REGISTER_YET;
        resBody.message = "You are not register yet";
      } else {
        resBody.status = CODE.SUCCESS_CODE;
        resBody.message = "Login successfully!";
        resBody.data = result;
        console.log("employee = ", result);
      }
    }
  }
  res.send(resBody);
};

const isEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const isWeakPassword = (password: string): boolean => {
  return password.length < 8;
};

const storeUser = async (
  email: string,
  password: string,
  full_name: string,
  phone: string
) => {
  try {
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const user = User.build({
      email,
      hashPassword: hashedPassword,
      fullName: full_name,
      phone,
    });
    await user.save();
    const userStored = await getUserByEmail(email);
    console.log("userStored: ", userStored);
  } catch (exception) {
    console.log("userStored exception: ", exception.toString());
  }
};

const isUserExist = async (email: string): Promise<boolean> => {
  const user = await getUserByEmail(email);
  return user !== -1;
};

const isPhoneNumberExist = async (phone: string): Promise<boolean> => {
  const user = await getUserByPhone(phone);
  return user !== -1;
};

const isCorrectUser = async (
  email: string,
  password: string
): Promise<boolean> => {
  const hashedPassword = await getHashedPasswordByEmail(email);
  return await bcrypt.compare(password, hashedPassword);
};

export default { onLogin, onRegister };
