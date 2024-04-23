import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AddNewBotModal } from "../Modals/AddNewBotModal";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";
import { convert_db_data } from "../../Utils/ChatbotUtil";
import { EditPagesModal } from "../Modals/EditPagesModal";
import { Link } from "react-router-dom";
import { EditFilesModal } from "../Modals/EditFilesModal";
import { SettingsModal } from "../Modals/SettingsModal";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import {
  Switch,
  IconButton,
  TextField,
  InputAdornment,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import { useDispatch, useSelector } from "react-redux";
import {
  addChatBot,
  addNewFile,
  addNewUrl,
  deleteChatbot,
  setVocieId,
  toggleActive,
} from "../../Slice/chatbotSlice";
import { formatDateRelativeToNow } from "../../Utils/DateTimeUtil";
import { Button, Stack } from "react-bootstrap";
import { EmbedToWebsiteModal } from "../Modals/EmbedToWebsiteModal";

const ChatbotsTable = () => {
  const data = useSelector((auth) => auth.chatbot.chatbots);
  const dispatch = useDispatch();
  const [addNewBotModalShow, setAddNewBotModalShow] = useState(false);
  const [editPagesModalShow, setEditPagesModalShow] = useState(false);
  const [editFilesModalShow, setEditFilesModalShow] = useState(false);
  const [settingsModalShow, setSettingsModalShow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [embedModalopen, setEmbedModalOpen] = useState(false);

  const handleClickOpenEmbedModal = () => {
    setEmbedModalOpen(true);
  };
  const handleCloseEmbedModal = () => {
    setEmbedModalOpen(false);
  };

  const filteredData = useMemo(
    () => data.filter((d) => d.name.includes(searchValue)),
    [data, searchValue]
  );

  const handleAdd = useCallback(() => {
    setAddNewBotModalShow(true);
  }, []);

  const AddNewData = useCallback(
    (newBot) => {
      dispatch(addChatBot(newBot));
    },
    [dispatch]
  );

  const addPage = useCallback(
    (links) => {
      dispatch(
        addNewUrl({
          id: filteredData[currentIndex]._id,
          links: links,
        })
      );
    },
    [currentIndex, dispatch, filteredData]
  );

  const addFile = useCallback(
    (file) => {
      dispatch(
        addNewFile({
          id: filteredData[currentIndex]._id,
          file: file,
        })
      );
    },
    [currentIndex, dispatch, filteredData]
  );

  const setVoice = useCallback(
    (voiceId) => {
      dispatch(
        setVocieId({
          id: filteredData[currentIndex]._id,
          voiceId: voiceId,
        })
      );
    },
    [currentIndex, dispatch, filteredData]
  );

  const handleRemoveChatbot = useCallback(() => {
    if (window.confirm("Are you sure want to delete?")) {
      SendRequestWithToken_test(
        "chatbot/remove-chatbot",
        {
          body: JSON.stringify({
            id: filteredData[currentIndex]._id,
          }),
        },
        () => {
          dispatch(deleteChatbot(filteredData[currentIndex]._id));
          setCurrentIndex(-1);
        }
      );
    }
  }, [currentIndex, filteredData, dispatch]);

  const toggleActivate = useCallback(
    (index) => {
      SendRequestWithToken_test(
        "chatbot/toggle-active",
        {
          body: JSON.stringify({
            id: filteredData[index]._id,
            active: !filteredData[index].active,
          }),
        },
        () => {
          dispatch(toggleActive(filteredData[index]._id));
        }
      );
    },
    [dispatch, filteredData]
  );

  const handleEditPages = useCallback(() => {
    setEditPagesModalShow(true);
  }, []);

  const handleEditFiles = useCallback(() => {
    setEditFilesModalShow(true);
  }, []);

  const handleSettings = useCallback(() => {
    setSettingsModalShow(true);
  }, []);
  return (
    <>
      <EmbedToWebsiteModal
        id={
          filteredData[currentIndex] === undefined
            ? ""
            : filteredData[currentIndex]._id
        }
        open={embedModalopen}
        handleClose={handleCloseEmbedModal}
      />
      <div className="mt-4">
        <div className="" style={{ width: "98%"}}>
          <div className="col-12 d-flex justify-content-between">
            <h2 className="title mx-4">All Chats</h2>
            <button className="btn btn-primary" onClick={handleAdd}>
              <AddIcon />
              Add New
            </button>
          </div>
        </div>
        <div className="">
          <div
            className="search-bot col-3 mt-2 mx-3"
            style={{ textAlign: "left" }}
          >
            <TextField
              style={{ textAlign: "center" }}
              id="input-with-icon-textfield"
              variant="outlined"
              size="small"
              placeholder="Filter by chatbot name"
              value={searchValue}
              onChange={(ev) => setSearchValue(ev.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
        <div className="mt-2" style={{ width: "98%"}}>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>URLs Indexed</TableCell>
                  <TableCell>Documents Indexed</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell>Chat Type</TableCell>
                  <TableCell width={250}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((bot, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Switch
                        checked={bot.active}
                        onChange={(ev) => toggleActivate(index)}
                      />
                    </TableCell>
                    <TableCell>
                      <Link to={`/chatbot/${bot._id}/simulation`}>
                        <h3 className="fs-6">{bot.name}</h3>
                      </Link>
                    </TableCell>
                    <TableCell>{bot.pages.length}</TableCell>
                    <TableCell>{bot.files.length}</TableCell>
                    <TableCell>{moment(bot.createdAt).fromNow()}</TableCell>
                    <TableCell>{bot.chatType ? bot.chatType : ""}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="sm"
                        style={{ width: "150px" }}
                      >
                        View Chatlog
                      </Button>
                      <IconButton
                        aria-label="delete"
                        onClick={(ev) => {
                          setAnchorEl(ev.currentTarget);
                          setCurrentIndex(index);
                        }}
                      >
                        <ListIcon />
                      </IconButton>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <Link to={`/chatbot/${bot._id}/setting`}>
                          <MenuItem onClick={() => setAnchorEl(null)}>
                            Settings
                          </MenuItem>
                        </Link>
                        <MenuItem
                          onClick={() => {
                            handleClickOpenEmbedModal(bot._id);
                          }}
                        >
                          Embed to Website
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleRemoveChatbot();
                            setAnchorEl(null);
                          }}
                        >
                          Remove
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <AddNewBotModal
        show={addNewBotModalShow}
        setShow={setAddNewBotModalShow}
        handleAdd={AddNewData}
      />
      <EditPagesModal
        show={editPagesModalShow}
        setShow={setEditPagesModalShow}
        id={
          filteredData[currentIndex] === undefined
            ? ""
            : filteredData[currentIndex]._id
        }
        AddPage={addPage}
      />
      <EditFilesModal
        show={editFilesModalShow}
        setShow={setEditFilesModalShow}
        id={
          filteredData[currentIndex] === undefined
            ? ""
            : filteredData[currentIndex]._id
        }
        AddFile={addFile}
      />
      <SettingsModal
        show={settingsModalShow}
        setShow={setSettingsModalShow}
        id={
          filteredData[currentIndex] === undefined
            ? ""
            : filteredData[currentIndex]._id
        }
        selectedVoiceId={
          filteredData[currentIndex] === undefined
            ? ""
            : filteredData[currentIndex].voiceId
        }
        SetVoice={setVoice}
      />
    </>
  );
};
export default ChatbotsTable;
