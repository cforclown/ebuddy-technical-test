import { Button } from '@mui/material';
import { updateUser } from '@/store/reducers/users.api/actions';
import { useAppDispatch } from '@/lib/states.hooks';

type UpdateBtnProps = {
  userId: string;
  email: string;
  name: string;
  age?: number;
  disabled?: boolean;
};

const UpdateButton = ({
  userId,
  email,
  name,
  age,
  disabled,
}: UpdateBtnProps) => {
  const dispatch = useAppDispatch();

  const handleUpdate = async () => {
    dispatch(updateUser({
      payload: {
        id: userId,
        name,
        email,
        age,
      }
    }));
  };

  return (
    <Button
      variant="contained"  
      onClick={handleUpdate}
      disabled={disabled}
    >
      Update User
    </Button>
  );
};

export default UpdateButton;
