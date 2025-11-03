export interface IPdfService {
  renderEjsTemplate(templatePath: string, data: any);
  generatePdfFromEjs(templatePath: string, data: any);
  generatePdfFromHtml(html: string): Promise<Uint8Array<ArrayBufferLike>>;
}
