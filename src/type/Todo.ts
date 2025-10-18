import User from './User';

export default interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
  user: User;
}
