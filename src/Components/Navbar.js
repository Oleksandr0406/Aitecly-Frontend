import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { clearToken } from "../Utils/AuthUtil";
import { unAuthorized } from "../Slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppBar } from "./Appbar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { ListItem, Collapse } from "@mui/material";

import List from "@mui/material/List";
import { Drawer } from "./Drawer";
import { useChatbot } from "../Hooks/useChatbot";
const Navbar = ({ toggleDrawer, open }) => {
  const navigator = useNavigate();
  const location = useLocation();
  const chatbots = useSelector((state) => state.chatbot.chatbots);
  // const [open, setOpen] = useState(true);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const showSidebar = useMemo(
    () =>
      !(
        location.pathname.endsWith("sign-in") ||
        location.pathname.endsWith("sign-up")
      ),
    [location]
  );
  const chatbotId = useMemo(() => location.pathname.split("/")[2], [location]);
  const chatbot = useChatbot({ chatbotId });
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  // const toggleDrawer = useCallback(() => {
  //   setOpen(!open);
  // }, [open]);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleSignOut = useCallback(() => {
    setAnchorElUser(null);
    clearToken();
    dispatch(unAuthorized());
  }, [dispatch]);

  // const [openToggle, SetToggle] = useState(true);
  const [openNestedToggle, SetNestedToggle] = useState(false);
  const [openNestedInactiveToggle, setNestedInactiveToggle] = useState(false);

  const handleToggle = () => {
    // SetToggle(!openToggle);
    navigator("/");
  };

  const handleNestedToggle = () => {
    SetNestedToggle(!openNestedToggle);
  };
  const handleNestedInactiveToggle = () => {
    setNestedInactiveToggle(!openNestedInactiveToggle);
  };

  return (
    <>
      <AppBar
        position="absolute"
        open={open && auth.isAuthorized && showSidebar}
        sx={{ zIndex: 1}}
      >
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          {auth.isAuthorized && showSidebar && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && showSidebar && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {chatbot.name ? chatbot.name : "Dashboard"}
          </Typography>
          {!auth.isAuthorized && (
            <Button color="inherit" onClick={() => navigator("/sign-in")}>
              Login
            </Button>
          )}
          {!auth.isAuthorized && (
            <Button color="inherit" onClick={() => navigator("/sign-up")}>
              SignUp
            </Button>
          )}
          {auth.isAuthorized && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={auth.user.username}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircleIcon fontSize="large" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Link to="/apis">
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">API Management</Typography>
                  </MenuItem>
                </Link>
                <Link to="/voices">
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Voice Management</Typography>
                  </MenuItem>
                </Link>
                <Link to="/api-usage">
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">OpenAI Token Usage</Typography>
                  </MenuItem>
                </Link>
                <MenuItem onClick={handleSignOut}>
                  <Typography textAlign="center">Sign Out</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {auth.isAuthorized && showSidebar && (
        <Drawer
          variant="permanent"
          open={open && auth.isAuthorized && showSidebar}
          sx={{
            // borderRight: "1px solid rgba(0, 0, 0, 0.1)",
            // height: "200vh"
            position: "fixed"
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
            style={{ borderRight: "none" }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />

          <List component="nav">
            <ListItemButton onClick={handleToggle}>
              <ListItemIcon>
                <DashboardIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Chat Dashboard" />
            </ListItemButton>

            <Collapse in={true} timeout="auto">
              <List component="div" disablePadding>
                <ListItemButton onClick={handleNestedToggle}>
                  <ListItemIcon>
                    <ToggleOnIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Active Chats" />
                </ListItemButton>
                <Divider />
                <Collapse in={openNestedToggle} timeout="auto">
                  {chatbots
                    .filter((d) => d.active === true)
                    .map((d) => (
                      <List component="div" disablePadding>
                        <Link to={`/chatbot/${d._id}/simulation`}>
                          <ListItemButton>
                            <ListItemText
                              primary={d.name}
                              style={{ textAlign: "center" }}
                            />
                          </ListItemButton>
                        </Link>
                      </List>
                    ))}
                </Collapse>

                <ListItemButton onClick={handleNestedInactiveToggle}>
                  <ListItemIcon>
                    <ToggleOffIcon />
                  </ListItemIcon>
                  <ListItemText primary="Inactive Chats" />
                </ListItemButton>

                <Collapse in={openNestedInactiveToggle} timeout="auto">
                  {chatbots
                    .filter((d) => d.active !== true)
                    .map((d) => (
                      <List component="div" disablePadding>
                        <Link to={`/chatbot/${d._id}`}>
                          <ListItemButton>
                            <ListItemText
                              primary={d.name}
                              style={{ textAlign: "center" }}
                            />
                          </ListItemButton>
                        </Link>
                      </List>
                    ))}
                </Collapse>
              </List>
            </Collapse>

            {/* <ListItemButton onClick={() => navigator("/chat-log")}>
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary="Chat Logs" />
            </ListItemButton>
            <ListItemButton onClick={() => navigator("/analytics")}>
              <ListItemIcon>
                <AnalyticsIcon />
              </ListItemIcon>
              <ListItemText primary="Analytics" />
            </ListItemButton>
            <ListItemButton onClick={() => navigator("/voices")}>
              <ListItemIcon>
                <SettingsVoiceIcon />
              </ListItemIcon>
              <ListItemText primary="Voice Management" />
            </ListItemButton>
            <ListItemButton onClick={() => navigator("/apis")}>
              <ListItemIcon>
                <ApiIcon />
              </ListItemIcon>
              <ListItemText primary="API Management" />
            </ListItemButton> */}
          </List>
        </Drawer>
      )}
    </>
  );
};

export default Navbar;
