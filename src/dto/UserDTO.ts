import ContactDTO from "./ContactDTO";

export default class UserDTO{
  id: number;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  contactList: Array<ContactDTO>;
}
