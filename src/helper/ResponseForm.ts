export default class ResponseForm {
  message: string;
  status: number;
  data: any;

  constructor(message?: string, status?: number, data?: any){
    if (message && status && data){
      this.message = message;
      this.status = status;
      this.data = data;
    }
  }
}

