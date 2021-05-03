import ContactDTO from "./ContactDTO";

export default class UserDTO {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  contact_list: Array<ContactDTO>;
  access_token: string;
  avatar: string;
}
