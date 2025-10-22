import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';
import { User } from '../../type/user';

interface Props {
  setSelectedUserId: Dispatch<SetStateAction<number>>;
  setErrors: Dispatch<SetStateAction<{ user: string; title: string }>>;
  selectedUserId: number;
  errors: {
    user: string;
    title: string;
  };
  users: User[];
}

export const UserField: FC<Props> = ({
  setSelectedUserId,
  setErrors,
  selectedUserId,
  errors,
  users,
}) => {
  const handleSelectedChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(Number(event.target.value));
    setErrors(prev => ({ ...prev, user: '' }));
  };

  return (
    <div className="field">
      <label htmlFor="user">User</label>
      <select
        id="user"
        data-cy="userSelect"
        value={selectedUserId}
        onChange={handleSelectedChange}
      >
        <option value="0" disabled>
          Choose a user
        </option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      {errors.user && (
        <span className="error" data-cy="userError">
          {errors.user}
        </span>
      )}
    </div>
  );
};
