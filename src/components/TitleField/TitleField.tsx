import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';

interface Props {
  setTitle: (title: string) => void;
  setErrors: Dispatch<SetStateAction<{ user: string; title: string }>>;
  title: string;
  errors: {
    user: string;
    title: string;
  };
}

export const TitleField: FC<Props> = ({
  setTitle,
  setErrors,
  title,
  errors,
}) => {
  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setErrors(prev => ({ ...prev, title: '' }));
  };

  return (
    <div className="field">
      <label htmlFor="title">Title</label>
      <input
        id="title"
        type="text"
        data-cy="titleInput"
        value={title}
        onChange={handleChangeInput}
        placeholder="Enter title"
      />
      {errors.title && (
        <span className="error" data-cy="titleError">
          {errors.title}
        </span>
      )}
    </div>
  );
};
