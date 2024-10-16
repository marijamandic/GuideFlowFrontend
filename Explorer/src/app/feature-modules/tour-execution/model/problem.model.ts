export interface Problem {
  id?: number;
  userId: number;
  tourId: number;
  category: string;
  priority: string;
  description?: string;
  reportedAt: Date;
}
