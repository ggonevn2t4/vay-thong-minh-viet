
export interface Document {
  id: string;
  name: string;
  description?: string;
  filePath: string;
  fileSize?: number;
  contentType?: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  userId: string;
}
