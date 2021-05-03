import ResponseForm from "../helper/ResponseForm";
import * as CODE from "../helper/Code";
import MessageDTO from "../dto/MessageDTO";
const Message = require("../entities/Message");

export const storeMessage = async (
  content: string,
  image: string,
  receiver_id: string,
  sender_id: string
): Promise<any> => {
  let result = -1;
  try {
    const message = new Message({
      content: content,
      image: image,
      receiver_id: receiver_id,
      sender_id: sender_id,
      created_at: new Date(),
      updated_at: new Date(),
    })
    result = await message.save();
  } catch (error) {
    console.log("storeMessage error = ", error);
    result = -1;
  }
  return result;
};

export const onStoreMessage = async (req, res): Promise<any> => {
  const { content, image, receiver_id, sender_id } = req.body;
  const response = new ResponseForm();
  if (!content && !image) {
    response.status = CODE.ERROR.MESSAGE.CANNOT_SEND_EMPTY_BODY;
    response.message = "Cannot send empty body";
  } else if (!receiver_id) {
    response.status = CODE.ERROR.MESSAGE.MUST_HAVE_RECEIVER;
    response.message = "'receiver_id' is required";
  } else if (!sender_id) {
    response.status = CODE.ERROR.MESSAGE.MUST_HAVE_SENDER;
    response.message = "'sender_id' is required";
  } else {
    const result = await storeMessage(content, image, receiver_id, sender_id);
    if (result === -1) {
      response.status = CODE.ERROR.MESSAGE.SOME_ERROR_HAPPENED;
      response.message = "Some error happened, please check your console";
    } else {
      response.status = CODE.SUCCESS_CODE;
      response.message = "Success";
    }
  }
  res.send(response);
};

export const getAllMessage = async (
  user_id_1: string,
  user_id_2: string
): Promise<any> => {
  let result = [];
  const messageFromUser1 =
    (await Message.find({
      sender_id: user_id_1,
      receiver_id: user_id_2,
    }).exec()) || [];
  const messageFromUser2 =
    (await Message.find({
      sender_id: user_id_2,
      receiver_id: user_id_1,
    }).exec()) || [];
  console.log("messageFromUser1 = ", messageFromUser1);
  console.log("messageFromUser2 = ", messageFromUser2);
  const messageList = messageFromUser1.concat(messageFromUser2);
  console.log("getAllMessage messageList = ", messageList);
  if (JSON.stringify(messageList) !== JSON.stringify([])) {
    result = sortMessage(messageList);
  } else {
    result = messageList;
  }
  console.log("getAllMessage result = ", result);
  return result;
};

export const onGetAllMessage = async (req, res): Promise<any> => {
  const { user_id_1, user_id_2 } = req.query;
  console.log("req = ", req.params);

  const response = new ResponseForm();
  if (!user_id_1 || !user_id_2) {
    response.message = "Need user id of both users";
    response.status = CODE.ERROR.MESSAGE.SOME_ERROR_HAPPENED;
  } else {
    const messages = await getAllMessage(user_id_1, user_id_2);
    response.status = CODE.SUCCESS_CODE;
    response.data = messages;
  }
  res.send(response);
};

export const sortMessage = (listMessage: Array<any>): Array<any> => {
  return listMessage.sort(function (item1, item2) {
    const time1 = new Date(item1?.created_at).getTime();
    const time2 = new Date(item2?.created_at).getTime();
    return time1 - time2;
  });
};
