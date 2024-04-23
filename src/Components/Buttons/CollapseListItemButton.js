import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export const CollapseListItemButton = ({
  open,
  setOpen,
  Icon = () => <></>,
}) => {
  return <ListItemButton onClick={open}></ListItemButton>;
};
