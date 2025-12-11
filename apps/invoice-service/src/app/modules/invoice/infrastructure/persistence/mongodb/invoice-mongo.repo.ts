import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IInvoiceRepository } from '../../../application/ports/invoice.port';
import { InvoiceModelName, InvoiceModel, Invoice } from '@common/schemas/invoice.schema';

@Injectable()
export class InvoiceMongoRepository implements IInvoiceRepository {
  constructor(@InjectModel(InvoiceModelName) private readonly invoiceModel: InvoiceModel) {}
  async create(data: Partial<Invoice>) {
    const createdInvoice = new this.invoiceModel(data);
    return createdInvoice.save();
  }

  async getById(id: string): Promise<Invoice | null> {
    return this.invoiceModel.findById(id).exec();
  }

  async updateById(id: string, data: Partial<Invoice>): Promise<Invoice | null> {
    return this.invoiceModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteById(id: string): Promise<Invoice | null> {
    return this.invoiceModel.findByIdAndDelete(id).exec();
  }
}
