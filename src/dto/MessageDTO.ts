export default class MessageDTO {
  room_id: string;
  sender_id: string;
  receiver_id: string;
  message_body: string;
  message_status: number;
  created_at: Date;
  updated_at: Date;
}
