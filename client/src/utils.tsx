import { Todo } from "./models/todo";

export const parseTodo = (rawTodo: any): Todo => ({
  ...rawTodo,
  completed: rawTodo.done ?? false,
  due_at: rawTodo.due_at ? new Date(rawTodo.due_at.replace(/Z\d+$/, 'Z')) : null,
});