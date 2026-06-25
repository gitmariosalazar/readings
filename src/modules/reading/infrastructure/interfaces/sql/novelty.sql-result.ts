export interface NoveltySQLResult {
  id: number;
  title: string;
  description: string;
  min_percentage: number | null;
  max_percentage: number | null;
  action_recommended: string;
}
