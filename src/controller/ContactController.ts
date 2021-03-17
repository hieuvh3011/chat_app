import ContactDTO from "../dto/ContactDTO";

const onRequestGetAllContact = (req, res) => {
  res.send(res.body);
};

const onRequestAddContact = (req, res) => {
  res.send(res.body);
};

const getContactListByUserId = async (
  userId: number
): Promise<Array<ContactDTO>> => {
  const result = [];

  return result;
};

export default { onRequestGetAllContact, onRequestAddContact };
