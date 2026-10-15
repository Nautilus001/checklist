export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  due_at?: Date | null;
}