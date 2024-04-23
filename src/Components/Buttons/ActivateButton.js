import { IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
const ActivateButton = ({ onClick = () => {}, title = "Activate Key" }) => {
  return (
    <>
      <IconButton color="primary" onClick={onClick} title={title}>
        <CheckIcon />
      </IconButton>
    </>
  );
};

export default ActivateButton;
