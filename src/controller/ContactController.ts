const User = require("../entities/User");

export const checkContact = async (
  userId: string,
  contactId: string
): Promise<boolean> => {
  const user = await User.findById(userId).exec();
  const contact_id = user?.contact_id || [];
  return contact_id.includes(contactId);
};

export const addContact = async (
  userId: string,
  contactId: string
): Promise<any> => {
  const user = await User.findById(userId).exec();
  const contact = await User.findById(contactId).exec();
  const isContactExists = await checkContact(userId, contactId);
  if (isContactExists === false) {
    await User.updateOne(
      { email: user.email },
      {
        contact_id: [...user.contact_id, contact.id],
      }
    );
  } else {
    return -1;
  }
};
