import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import Todo from './type/Todo';
import { TodoList } from './components/TodoList';

const initialTodos: Todo[] = todosFromServer
  .map(todo => {
    const user = usersFromServer.find(u => todo.userId === u.id);

    if (!user) {
      return null;
    }

    return {
      ...todo,
      user,
    };
  })
  .filter((todo): todo is Todo => todo !== null);

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [titleError, setTitleError] = useState<boolean>(false);
  const [userError, setUserError] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;

    if (title.trim() === '') {
      setTitleError(true);
      hasError = true;
    }

    if (selectedUserId === 0) {
      setUserError(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const user = usersFromServer.find(u => u.id === selectedUserId);

    if (!user) {
      setUserError(true);

      return;
    }

    const newTodo: Todo = {
      id: Math.max(...todos.map(todo => todo.id)) + 1,
      title: title.trim(),
      userId: selectedUserId,
      completed: false,
      user,
    };

    setTodos([...todos, newTodo]);
    setTitle('');
    setSelectedUserId(0);
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(e.target.value);
              if (titleError && e.target.value.trim() !== '') {
                setTitleError(false);
              }
            }}
            placeholder="Enter title"
          />
          {titleError && (
            <span className="error" data-cy="titleError">
              Please enter a title
            </span>
          )}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={selectedUserId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const newId = Number(e.target.value);

              setSelectedUserId(newId);
              if (userError && newId !== 0) {
                setUserError(false);
              }
            }}
          >
            <option value="0" disabled>
              Choose a user
            </option>
            {usersFromServer.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          {userError && (
            <span className="error" data-cy="userError">
              Please choose a user
            </span>
          )}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
