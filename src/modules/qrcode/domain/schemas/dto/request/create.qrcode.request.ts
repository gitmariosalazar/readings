import { Buffer } from 'buffer';

export class CreateQRCodeRequest {
  acometidaId: string;
  imagenBytea: Buffer;

  constructor(
    acometidaId: string,
    imagenBytea: Buffer
  ) {
    this.acometidaId = acometidaId
    this.imagenBytea = imagenBytea
  }
}