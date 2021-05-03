export default class MessageDTO {
  room_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  image: string;
  message_status: number;
  created_at: Date;
  updated_at: Date;
}
