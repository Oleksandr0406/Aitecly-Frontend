import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
const DeleteButton = ({ onClick = () => {}, title = "Delete" }) => {
  return (
    <>
      <IconButton color="primary" onClick={onClick} title={title}>
        <DeleteIcon />
      </IconButton>
    </>
  );
};

export default DeleteButton;
