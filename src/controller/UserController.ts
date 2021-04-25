import UserDTO from "../dto/UserDTO";
import { generateToken } from "../helper/JwtHelper";
import ResponseForm from "../helper/ResponseForm";
import * as CODE from "../helper/Code";
import jwtHelper from "../helper/JwtHelper";
import ContactDTO from "../dto/ContactDTO";

const User = require("../entities/User");
const bcrypt = require("bcryptjs");

export const getToken = async (userDTO: UserDTO): Promise<UserDTO> => {
  userDTO.access_token = await generateToken(userDTO);
  return userDTO;
};

export const getHashedPasswordByEmail = async (
  email: string
): Promise<string> => {
  const user = await User.findOne({ email }).exec();
  console.log("password = ", user.password);
  return user.password || "";
};

export const getUserByEmail = async (email: string): Promise<any> => {
  const user = await User.findOne({ email: email }).exec();
  if (JSON.stringify(user) === JSON.stringify([])) {
    return -1;
  }
  return user;
};

export const getUserById = async (id: number): Promise<any> => {
  const user = await User.findOne({ where: { id }, raw: true });
  if (JSON.stringify(user) === JSON.stringify([])) {
    return -1;
  }
  return user;
};

export const getUserIdByEmail = async (email: string): Promise<any> => {
  const user = await User.findOne({
    where: { email },
    attributes: ["id"],
    raw: true,
  });
  if (user === null) {
    return -1;
  }
  return user;
};

export const getUserIdByPhone = async (phone: string): Promise<any> => {
  const user = await User.findOne({
    where: { phone },
    attributes: ["id"],
    raw: true,
  });
  if (user === null) {
    return -1;
  }
  return user;
};

export const getUserByPhone = async (phone: string): Promise<any> => {
  const user = await User.findOne({ phone }).exec();
  if (JSON.stringify(user) === JSON.stringify([])) {
    return -1;
  }
  return user;
};

export const getUserDTOByEmail = async (email: string): Promise<UserDTO> => {
  const user = await getUserByEmail(email);
  // const contactList = await getContactList(user?.id);
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    contact_list: [],
    access_token: "",
  };
};

// export const getContactList = async (userId = ""): Promise<any> => {
//   const list = await Contact.find({ user_id: userId }).exec();
//   console.log("getContactList = ", list);
//   return list;
// };

export const onRegister = async (req, res): Promise<any> => {
  const { full_name, email, phone, password, avatarUrl } = req.body;
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
      await storeUser(email, password, full_name, phone, avatarUrl);
      resBody.status = CODE.SUCCESS_CODE;
      resBody.message = "Register successfully!";
      resBody.data = await getUserByEmail(email);
    }
    // resBody.data = user;
  }
  res.send(resBody);
};

export const onLogin = async (req, res): Promise<any> => {
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
    const isEmailExist = await isUserExist(email);
    if (!isEmailExist) {
      resBody.message = "Email is not registered!";
      resBody.status = CODE.ERROR.AUTH.EMAIL_ALREADY_EXIST;
      resBody.data = [];
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
        }
      }
    }
  }
  res.send(resBody);
};

export const isEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const isWeakPassword = (password: string): boolean => {
  return password.length < 8;
};

export const storeUser = async (
  email: string,
  password: string,
  full_name: string,
  phone: string,
  avatar_url = ""
): Promise<any> => {
  try {
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      full_name,
      phone,
      avatar_url,
    });

    await user.save();
    const userStored = await getUserByEmail(email);
    console.log("userStored: ", userStored);
  } catch (exception) {
    console.log("userStored exception: ", exception.toString());
  }
};

export const isUserExist = async (email: string): Promise<boolean> => {
  return await User.exists({ email });
};

export const isPhoneNumberExist = async (phone: string): Promise<boolean> => {
  return await User.exists({ phone });
};

export const isCorrectUser = async (
  email: string,
  password: string
): Promise<boolean> => {
  const hashedPassword = await getHashedPasswordByEmail(email);
  return await bcrypt.compare(password, hashedPassword);
};

export const getUserIdFromToken = async (token: string): Promise<any> => {
  if (token.startsWith("Bearer ")) {
    token = token.replace("Bearer ", "");
  }
  const decodeToken = await jwtHelper.verifyToken(token);
  console.log("decodeToken = ", decodeToken);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return decodeToken?.data?.id;
};

export const findUserByEmail = async (email: string): Promise<UserDTO> => {
  const result = await User.find({
    email: {
      $regex: ".*" + email + ".*",
    },
  })
    .select("full_name _id avatar email")
    .exec();
  console.log("findUserByEmail result = ", result);
  return result;
};

export const findUserById = async (id: string): Promise<UserDTO> => {
  return await User.findById(id);
};

export const findListContact = async (listId = []): Promise<Array<UserDTO>> => {
  const result = [];
  await listId.map(async (item) => {
    const user = await User.findById(item);
    result.push(user);
  });
  return result;
};

export const onRequestFindUser = async (req, res): Promise<any> => {
  const { email } = req.query;
  console.log("req params = ", req.query);
  console.log("email to search = ", email);
  const response = new ResponseForm();
  const listUser = await findUserByEmail(email);
  response.status = CODE.SUCCESS_CODE;
  response.data = listUser;
  res.send(response);
};
