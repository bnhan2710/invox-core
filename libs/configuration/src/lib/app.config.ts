import { IsNumber } from 'class-validator';

export class AppConfiguration {
  @IsNumber()
  PORT: number;

  constructor() {
    this.PORT = process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 3000;
  }
}
