import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './type/todo';
import { TitleField } from './components/TitleField/TitleField';
import { UserField } from './components/UserField/UserField';

const initialTodos: Todo[] = todosFromServer
  .map(todo => {
    const user = usersFromServer.find(u => todo.userId === u.id);

    return user ? { ...todo, user } : null;
  })
  .filter((todo): todo is Todo => todo !== null);

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [title, setTitle] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [errors, setErrors] = useState({
    user: '',
    title: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors = { title: '', user: '' };
    let hasError = false;

    if (title.trim() === '') {
      newErrors.title = 'Please enter a title';
      hasError = true;
    }

    if (selectedUserId === 0) {
      newErrors.user = 'Please choose a user';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    const user = usersFromServer.find(u => u.id === selectedUserId);

    if (!user) {
      setErrors(prev => ({ ...prev, user: 'Please choose a user' }));

      return;
    }

    const nextId =
      todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;

    const newTodo: Todo = {
      id: nextId,
      title: title.trim(),
      userId: selectedUserId,
      completed: false,
      user,
    };

    setTodos([...todos, newTodo]);
    setTitle('');
    setSelectedUserId(0);
    setErrors({ title: '', user: '' });
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
        <TitleField
          setTitle={setTitle}
          setErrors={setErrors}
          title={title}
          errors={errors}
        />
        <UserField
          setSelectedUserId={setSelectedUserId}
          setErrors={setErrors}
          selectedUserId={selectedUserId}
          errors={errors}
          users={usersFromServer}
        />
        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
