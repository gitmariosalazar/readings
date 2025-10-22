export interface PhotoReadingSQLResponse {
  photoReadingId?: number;
  readingId: number;
  photoUrl: string;
  cadastralKey: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}