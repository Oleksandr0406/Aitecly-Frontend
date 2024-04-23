import React, { useEffect, useRef, useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { RecordButton } from "./Buttons/Record";
import {
  SendUploadRequestWithToken,
  SendRequestWithToken,
  getFullUrl,
  SendRequestWithToken_test,
} from "../Utils/FetchUtil";
import {
  detectBrowser,
  detectDevice,
  detectOS,
  getLocation,
} from "../Utils/DetectUtil";
import MicRecorder from "mic-recorder-to-mp3";
import "../Styles/chatbot.css";

import {
  Avatar,
  Badge,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Fab,
  FormControlLabel,
  Paper,
  Slide,
  Switch,
  TextField,
  Typography,
  Zoom,
} from "@mui/material";
import { MDBIcon } from "mdb-react-ui-kit";
import FeedbackButton from "./Buttons/Feedback";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { IconButton } from "@mui/material";
import { Typing } from "./Typing";
import { Link, useParams } from "react-router-dom";
import { useChatbot } from "../Hooks/useChatbot";
import { hexToRgb } from "../Utils/ColorUtil";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@emotion/react";
import ChatIcon from "@mui/icons-material/Chat";
import { TableInChatbox } from "./Tables/TableInChatbox";
import { linkify } from "../Utils/StringUtil";
import { styled } from "@mui/material/styles";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import SendIcon from "@mui/icons-material/Send";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Chatbox = ({
  name,
  messages = [],
  setMessages = () => {},
  readOnly = false,
  logId = "",
  botId = "",
  chatbot = {},
  defaultOptions = [],
  avatarName = "",
  avatarImageId = "",
}) => {
  const isInframe = window.self !== window.top;
  const positionParam = new URL(window.location.href).searchParams.get(
    "position"
  );
  const chatboxRef = useRef(null);
  const msgRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [text, setText] = useState("");

  // --- Begin Audio Relative State ---
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isAudioResponse, setIsAudioResponse] = useState(true);
  const [isHover, setIsHover] = useState(false);
  // --- End Audio Relative State ---

  const sendMessage = useCallback(
    async (msg) => {
      // Check if the key pressed is the Enter key
      let newMessage = "";
      const audio_prefix = "@audio@";
      const sourcelink_prefix = "<sourcelink>";
      const table_prefix = "<api-table>";
      const assistantMessage = {
        content: "...",
        role: "assistant",
      };
      newMessage = !audioFile
        ? {
            content: msg,
            role: "user",
            audio: null,
          }
        : {
            content: "🎤 Audio Message",
            role: "user",
            audio: null,
          };

      // Add the new message to the existing messages array
      setMessages([...messages, newMessage, assistantMessage]);
      let responseMsg = "";
      let isAudioReceived = false;
      let isSourceReceived = false;
      let isApiTableReceived = false;
      const controller = new AbortController();
      let chat_response;
      setIsGenerating(true);
      const appearedOn = "https://aa.bb.cc";
      const location = await getLocation();
      const country = location.country;
      const device = detectDevice(window.navigator);
      const browser = detectBrowser(window.navigator);
      const ip = location.query;
      const os = detectOS(window.navigator);
      if (!audioFile) {
        chat_response = SendRequestWithToken("chatbot/ask-question", {
          body: JSON.stringify({
            usermsg: msg,
            id: botId,
            chatlogId: logId,
            isAudioResponse: isAudioResponse,
            appearedOn: appearedOn,
            country: country,
            device: device,
            browser: browser,
            os: os,
            ip: ip,
          }),
          signal: controller.signal,
        });
      } else {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result;
          newMessage = {
            content: "🎤 Audio Message",
            role: "user",
            audio: new Audio(base64Audio),
          };
        };
        reader.readAsDataURL(audioFile);

        const formdata = new FormData();
        formdata.append("audiofile", audioFile);
        formdata.append("id", botId);
        formdata.append("chatlogId", logId);
        formdata.append("isAudioResponse", isAudioResponse);
        formdata.append("appearedOn", appearedOn);
        formdata.append("country", country);
        formdata.append("device", device);
        formdata.append("browser", browser);
        formdata.append("os", os);
        formdata.append("ip", ip);

        chat_response = SendUploadRequestWithToken(
          "chatbot/ask-question-by-record",
          {
            body: formdata,
            signal: controller.signal,
          }
        );
      }

      chat_response
        .then(async (response) => {
          if (!response.ok) {
            if (response.status === 401 || response.status === 402) {
              const result = await response.json();
              alert(result.detail);
              setMessages([
                ...messages,
                newMessage,
                {
                  content: result.detail,
                  role: "assistant",
                  source: null,
                  audio: null,
                },
              ]);
              setIsGenerating(false);
            }
            throw new Error();
          }
          const reader = response.body.getReader();
          return new ReadableStream({
            start(controller) {
              function push() {
                reader.read().then(({ done, value }) => {
                  if (done) {
                    setIsGenerating(false);
                    controller.close();
                    return;
                  }
                  try {
                    let valueAsString = new TextDecoder("utf-8").decode(value);
                    if (valueAsString.includes(audio_prefix)) {
                      isAudioReceived = true;
                      //responseAudio = valueAsString.split(audio_prefix)[1];
                      valueAsString = valueAsString.split(audio_prefix)[0];
                    }
                    if (valueAsString.includes(sourcelink_prefix)) {
                      isSourceReceived = true;
                    }
                    if (valueAsString.includes(table_prefix)) {
                      isApiTableReceived = true;
                    }
                    if (
                      !isAudioReceived &&
                      !isSourceReceived &&
                      !isApiTableReceived
                    ) {
                      responseMsg += valueAsString;
                      setMessages([
                        ...messages,
                        newMessage,
                        {
                          content: responseMsg.split(audio_prefix)[0],
                          role: "assistant",
                          audio: null,
                        },
                      ]);
                    }
                    controller.enqueue(value);
                  } catch {}
                  push();
                });
              }
              push();
            },
          });
        })
        .then((stream) => new Response(stream))
        .then((response) => response.text())
        .then((text) => {
          const responseAudio = text.split(audio_prefix)[1];
          let audioElement = responseAudio
            ? new Audio(`data:audio/mpeg;base64,${responseAudio}`)
            : null;
          // if (audioElement) audioElement.play();
          const content = text.split(audio_prefix)[0];
          let regex = /<sourcelink>(.*?)<\/sourcelink>/;
          let match = content.match(regex);
          let source = match ? match[1] : null;
          let content_without_source = content.replace(regex, "");
          let api_table_regex = /<api-table>(.*?)<\/api-table>/;
          let api_table_match = content_without_source.match(api_table_regex);
          let table_data = api_table_match
            ? JSON.parse(api_table_match[1])
            : null;
          let content_without_table = content_without_source.replace(
            api_table_regex,
            ""
          );
          setMessages([
            ...messages,
            newMessage,
            {
              content: content_without_table,
              role: "assistant",
              source: source,
              audio: audioElement,
              tableData: table_data,
            },
          ]);
        })
        .catch((error) => {});

      // Clear audiofile after sending audio message
      setAudioFile(null);
    },
    [audioFile, setMessages, messages, botId, logId, isAudioResponse]
  );

  const handleInput = useCallback(
    (ev) => {
      if (ev.key === "Enter" && !ev.shiftKey && ev.target.value) {
        sendMessage(ev.target.value);
        // Clear the input field after adding the message
        ev.target.value = "";
        setText("");
      }
    },
    [sendMessage]
  );

  const handleChangeText = (e) => {
    setText(e.target.value);
  };

  console.log({ defaultOptions, messages });

  const handleSendIconClick = useCallback(() => {
    sendMessage(text);
    msgRef.current.value = "";
    setText("");
    // alert("asdf");
  }, [msgRef, sendMessage, text]);

  // --- Begin Audio Relative Functions ---
  const startRecording = useCallback(async () => {
    const newRecorder = new MicRecorder({ bitRate: 128 });
    setIsRecording(true);
    try {
      await newRecorder.start();
      setRecorder(newRecorder);
    } catch (e) {
      // console.error(e);
      alert(e);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    if (!recorder) return;
    try {
      const [buffer, blob] = await recorder.stop().getMp3();
      const audioFile = new File(buffer, "voice-message.mp3", {
        type: blob.type,
        lastModified: Date.now(),
      });
      // setPlayer(new Audio(URL.createObjectURL(audioFile)));

      setAudioFile(audioFile); // Add this line
      console.log("stop");
    } catch (e) {
      console.error(e);
      alert(e);
    }
  }, [recorder]);

  const handleToggleChange = useCallback((event) => {
    // event.preventDefault();
    setIsAudioResponse(event.target.checked);
  }, []);

  const handleSourceClicked = useCallback(
    (source) => {
      if (readOnly) return;
      SendRequestWithToken_test("chatbot/add-source-view", {
        body: JSON.stringify({
          botId,
          source,
        }),
      });
      SendRequestWithToken_test("chatlog/add-clicked-sources", {
        body: JSON.stringify({
          logId,
          source,
        }),
      });
    },
    [botId, logId, readOnly]
  );
  // --- End Audio Relative Functions ---

  useEffect(() => {
    if (chatboxRef.current !== null)
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }, [messages]);
  const handleToggle = () => {
    setToggle(!toggle);
  };

  const style = {
    position: "fixed",
    cursor: "pointer",
    borderRadius: "10px",
    bottom: 16,
    "&:hover": {
      boxShadow: "rgba(100, 100, 111, 0.1) 0px 7px 29px 0px",
    },
  };

  if (positionParam === "left") style.left = 16;
  else style.right = 16;

  if (!isInframe)
    return (
      <ChatboxCard
        props={{
          name,
          isInframe,
          setToggle,
          avatarImageId: chatbot.avatarImageId,
          avatarName: chatbot.avatarName,
          chatboxRef,
          messages,
          handleSourceClicked,
          readOnly,
          isGenerating,
          botId,
          logId,
          defaultOptions,
          handleSendIconClick,
          msgRef,
          handleInput,
          text,
          handleChangeText,
        }}
      />
    );
  // return <>this is test demo</>;
  return (
    <>
      <Slide direction="up" in={toggle} mountOnEnter unmountOnExit>
        <div sx={{ borderRadius: "15px" }}>
          <Box p={2}>
            <ChatboxCard
              props={{
                name,
                isInframe,
                setToggle,
                avatarImageId: chatbot.avatarImageId,
                avatarName: chatbot.avatarName,
                chatboxRef,
                messages,
                handleSourceClicked,
                readOnly,
                isGenerating,
                botId,
                logId,
                defaultOptions,
                handleSendIconClick,
                msgRef,
                handleInput,
                text,
                handleChangeText,
              }}
            />
          </Box>
        </div>
      </Slide>
      {!toggle && (
        <Box>
          <Box
            sx={style}
            onClick={() => {
              setIsHover(false);
              handleToggle();
            }}
            className={`icon-transition`}
            boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
            p={2}
            display="flex"
            justifyContent="space-between"
            gap={2}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "black",
                }}
              >
                24/7 Human Support
              </Typography>
            </Box>
            <Box>
              {/* {toggle ? (
                <CloseIcon className={toggle ? "rotateLeft" : "rotateRight"} />
              ) : (
                <ChatIcon className={toggle ? "rotateLeft" : "rotateRight"} />
              )} */}

              {isHover ? (
                <ChatBubbleOutlinedIcon
                  sx={{
                    color: "rgb(82, 157, 252)",
                  }}
                />
              ) : (
                <ChatBubbleOutlineOutlinedIcon
                  sx={{
                    color: "rgb(82, 157, 252)",
                  }}
                />
              )}
            </Box>
          </Box>
          {/* </Zoom> */}
        </Box>
      )}
    </>
  );
};

const ChatboxCard = ({ props }) => {
  const {
    name,
    isInframe,
    setToggle,
    avatarImageId,
    avatarName,
    chatboxRef,
    messages,
    handleSourceClicked,
    readOnly,
    isGenerating,
    botId,
    logId,
    defaultOptions,
    handleSendIconClick,
    msgRef,
    handleInput,
    text,
    handleChangeText,
  } = props;
  return (
    <Card
      id="chat1"
      style={{
        borderRadius: "15px",
        overflowY: "auto",
        width: "100%",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
      }}
    >
      <CardHeader
        title={
          <Box position="relative">
            <Typography
              textAlign="center"
              fontSize="22px"
              fontWeight={600}
              color="rgba(0, 0, 0, 0.8)"
            >
              {name}
            </Typography>
            {isInframe && (
              <Box
                position="absolute"
                sx={{
                  top: 0,
                  right: 20,
                  cursor: "pointer",
                }}
                onClick={() => setToggle(false)}
              >
                <RemoveIcon />
              </Box>
            )}
          </Box>
        }
        style={{
          padding: "20px 0px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
        }}
      />
      <Box display="flex" gap={2} alignItems="center" py={2} px={3}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          variant="dot"
        >
          <Avatar
            alt="Profile image"
            src={getFullUrl("static/" + avatarImageId)}
            sx={{ width: 50, height: 50 }}
            variant="dot"
          />
        </StyledBadge>
        <Box display="flex" flexDirection="column">
          <Typography
            sx={{
              textAlign: "left",
              fontWeight: 600,
            }}
          >
            {avatarName}
          </Typography>
          <Typography
            sx={{
              textAlign: "left",
              fontWeight: 300,
              color: "gray",
            }}
          >
            Hosting Expert
          </Typography>
        </Box>
      </Box>

      <CardContent
        sx={{
          bgcolor: "rgb(237, 237, 237)",
        }}
      >
        <div className="chatbox" ref={chatboxRef}>
          {messages.map((message, index) =>
            message.role === "assistant" ? (
              <>
                <div className="d-flex flex-row justify-content-start mb-4">
                  <label htmlFor="avatar">
                    <Avatar
                      alt="Avatar"
                      src={getFullUrl("static/" + avatarImageId)}
                      sx={{ width: 30, height: 30, cursor: "pointer" }}
                    />
                  </label>
                  {message.content === "..." ? (
                    <Typing />
                  ) : (
                    <div
                      className="p-3 ms-3 chat-msg"
                      style={{
                        borderRadius: "15px",
                        backgroundColor: "#FFF",
                      }}
                    >
                      <p
                        className="small mb-0"
                        style={{
                          whiteSpace: "pre-wrap",
                          textAlign: "left",
                        }}
                      >
                        <p
                          style={{ wordWrap: "break-word" }}
                          dangerouslySetInnerHTML={{
                            __html: message.content,
                          }}
                        />
                        {message.source && (
                          <>
                            <br />
                            For more information, check this{" "}
                            <a
                              href={message.source}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() =>
                                handleSourceClicked(message.source)
                              }
                            >
                              {message.source}
                            </a>
                          </>
                        )}
                        {!readOnly &&
                          (index < messages.length - 1 ||
                            isGenerating === false) &&
                          index > 0 && (
                            <>
                              {message.audio && (
                                <IconButton
                                  size="small"
                                  onClick={() => message.audio.play()}
                                >
                                  <VolumeUpIcon fontSize="small" />
                                </IconButton>
                              )}

                              <FeedbackButton
                                input={
                                  messages[index - 1]
                                    ? messages[index - 1].content
                                    : ""
                                }
                                output={
                                  messages[index] ? messages[index].content : ""
                                }
                                botId={botId}
                                logId={logId}
                                index={index - 1}
                              />
                            </>
                          )}
                        {readOnly && message.feedback === 1 && (
                          <FontAwesomeIcon
                            icon={faThumbsUp}
                            className="mx-1 text-right text-red"
                          />
                        )}
                        {readOnly && message.feedback === -1 && (
                          <FontAwesomeIcon
                            icon={faThumbsDown}
                            className="mx-1 text-right text-red"
                          />
                        )}
                        {message.tableData && message.tableData.length > 0 && (
                          <TableInChatbox data={message.tableData} />
                        )}
                      </p>
                    </div>
                  )}
                </div>
                {messages.length === 1 && (
                  <Box display="flex" gap={2} ml={8}>
                    {defaultOptions.map((item, i) => {
                      return (
                        <Chip
                          label={item}
                          color="primary"
                          variant="outlined"
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            msgRef.current.value = item;
                            handleSendIconClick();
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              </>
            ) : (
              <div className="d-flex flex-row justify-content-end mb-4">
                <div
                  className="p-3 me-3 border"
                  style={{
                    borderRadius: "15px",
                    backgroundColor: "rgb(26, 148, 218)",
                  }}
                >
                  <p
                    className="small mb-0"
                    style={{
                      whiteSpace: "pre-wrap",
                      textAlign: "left",
                      color: "#FFF",
                    }}
                  >
                    {message.content}
                    {message.audio && (
                      <IconButton
                        size="small"
                        onClick={() => message.audio.play()}
                      >
                        <VolumeUpIcon fontSize="small" />
                      </IconButton>
                    )}
                  </p>
                </div>
                <Avatar
                  alt="Avatar"
                  sx={{ width: 30, height: 30, cursor: "pointer" }}
                />
              </div>
            )
          )}
        </div>
      </CardContent>
      <CardActions
        sx={{
          padding: "15px 30px",
        }}
      >
        <TextField
          placeholder="Write a message"
          type="text"
          ref={msgRef}
          onKeyUp={handleInput}
          disabled={isGenerating}
          fullWidth
          variant="standard"
          sx={{
            border: "none",
          }}
          InputProps={{
            disableUnderline: true,
          }}
          value={text}
          onChange={handleChangeText}
        />
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          bgcolor={text ? "rgb(26, 148, 218)" : "transparent"}
          p="5px 10px"
          borderRadius="13px"
        >
          <Link href="#!" onClick={handleSendIconClick}>
            <SendIcon
              fontSize="large"
              sx={{
                color: text ? "#FFF" : "rgba(0, 0, 0, 0.3)",
              }}
            />
          </Link>
        </Box>
      </CardActions>
    </Card>
  );
};

export default Chatbox;
