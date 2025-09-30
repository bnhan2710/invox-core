import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IInvoiceRepository } from '../interfaces/invoice.port';
import { InvoiceModelName, InvoiceModel, Invoice } from '@common/schemas/invoice.schema';

@Injectable()
export class InvoiceMongoRepository implements IInvoiceRepository {
  constructor(@InjectModel(InvoiceModelName) private readonly invoiceModel: InvoiceModel) {}
  async create(data: Partial<Invoice>) {
    console.log('data:>>>>>>>>>>>>>>>>>>>>>>>>>', data);
    return this.invoiceModel.create(data);
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
