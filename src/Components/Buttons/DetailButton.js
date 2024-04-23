import { IconButton } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
const DetailButton = ({ onClick = () => {}, title = "Information" }) => {
  return (
    <>
      <IconButton color="primary" onClick={onClick} title={title}>
        <ListAltIcon />
      </IconButton>
    </>
  );
};

export default DetailButton;
