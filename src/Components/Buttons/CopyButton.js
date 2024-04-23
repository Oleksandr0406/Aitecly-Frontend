import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
const CopyButton = ({ onClick = () => {}, title = "Copy" }) => {
  return (
    <>
      <IconButton color="primary" onClick={onClick} title={title}>
        <ContentCopyIcon />
      </IconButton>
    </>
  );
};

export default CopyButton;
