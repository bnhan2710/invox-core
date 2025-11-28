import { SendMailOptions } from '@common/interfaces/common';

export interface IMailService {
  sendMail(options: SendMailOptions): Promise<void>;
}
