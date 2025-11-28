export type MailAttachment = {
  filename: string;
  content?: Buffer | string;
  contentType?: string;
  path?: string; //if file is stored locally or remotely
};

export interface SendMailOptions {
  to: string; // recipient address
  subject: string; // email subject
  html?: string; // HTML content
  text?: string; // Plain text fallback (optional)
  senderName?: string; // Display name of the sender
  senderEmail?: string; // Email of the sender
  attachments?: MailAttachment[]; // Attachments (PDF, image, etc.)
}
