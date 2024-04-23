import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Styles/chatbot.css";

import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { SendRequestWithToken_test } from "../Utils/FetchUtil";
import Chatbox from "../Components/Chatbox";
import { useChatbot } from "../Hooks/useChatbot";
import {
  Box,
  Fab,
  Grid,
  Paper,
  Slide,
  Typography,
  Zoom,
  useTheme,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import StraightenIcon from "@mui/icons-material/Straighten";
import ThreePIcon from "@mui/icons-material/ThreeP";
import LanguageIcon from "@mui/icons-material/Language";

const Chatbot = ({ chatlogId }) => {
  const isInframe = window.self !== window.top;
  const { chatbotId } = useParams();
  const [bot, setBot] = useState({
    name: "",
  });
  const [messages, setMessages] = useState([
    {
      content: bot.defaultGreetingMessage,
      role: "assistant",
    },
  ]);

  useEffect(() => {
    SendRequestWithToken_test(
      "chatbot/find-chatbot-by-id",
      {
        body: JSON.stringify({
          id: chatbotId,
        }),
      },
      (result) => {
        setBot(result);
        console.log({ result })
        setMessages([
          {
            content: result.defaultGreetingMessage,
            role: "assistant",
          },
        ]);
      }
    );
  }, [chatbotId]);

  if (isInframe) {
    return (
      <Chatbox
        name={bot.name}
        botId={chatbotId}
        messages={messages}
        defaultOptions={bot.defaultOptions}
        setMessages={setMessages}
        logId={chatlogId}
        chatbot={bot}
      />
    );
  }
  return (
    <Box
      width="100%"
      display="grid"
      gridTemplateColumns={["1fr", "1fr", "1fr 2.5fr"]}
      gap={2}
    >
      {!isInframe && (
        <Grid item>
          <Box textAlign="left" display="flex" flexDirection="column" gap={2}>
            <Box
              display="grid"
              alignItems="center"
              gap={1}
              gridTemplateColumns="1.1fr 1fr"
            >
              <Box display="flex" gap={1} color="blue">
                <LinkIcon />
                <Typography variant="h7">Data source urls</Typography>
              </Box>
              <Typography variant="body1">
                <b>:</b> {bot.pages?.length}
              </Typography>
            </Box>

            <Box
              display="grid"
              alignItems="center"
              gap={1}
              gridTemplateColumns="1.1fr 1fr"
            >
              <Box display="flex" gap={1} color="blue">
                <ModelTrainingIcon />
                <Typography variant="h7">Model</Typography>
              </Box>
              <Typography variant="body1">
                <b>:</b> {bot.modelName}
              </Typography>
            </Box>

            <Box
              display="grid"
              alignItems="center"
              gap={1}
              gridTemplateColumns="1.1fr 1fr"
            >
              <Box display="flex" gap={1} color="blue">
                <StraightenIcon />
                <Typography variant="h7">Response length</Typography>
              </Box>
              <Typography variant="body1">
                <b>:</b> {bot.responseLength}
              </Typography>
            </Box>

            <Box
              display="grid"
              alignItems="center"
              gap={1}
              gridTemplateColumns="1.1fr 1fr"
            >
              <Box display="flex" gap={1} color="blue">
                <ThreePIcon />
                <Typography variant="h7">Chat type</Typography>
              </Box>
              <Typography variant="body1">
                <b>:</b> {bot.chatType}
              </Typography>
            </Box>

            <Box
              display="grid"
              alignItems="center"
              gap={1}
              gridTemplateColumns="1.1fr 1fr"
            >
              <Box display="flex" gap={1} color="blue">
                <LanguageIcon />
                <Typography variant="h7">Language</Typography>
              </Box>
              <Typography variant="body1">
                <b>:</b> {bot.language}
              </Typography>
            </Box>
          </Box>
        </Grid>
      )}
      {/* <Grid
        item
        // xs={!isInframe ? 9 : 12}
        // md={!isInframe ? 9 : 12}
        // sm={12}
        padding={3}
      > */}
      <Chatbox
        name={bot.name}
        botId={chatbotId}
        messages={messages}
        defaultOptions={bot.defaultOptions}
        setMessages={setMessages}
        logId={chatlogId}
        chatbot={bot}
        avatarName={bot.avatarName}
        avatarImageId={bot.avatarImageId}
      />
      {/* </Grid> */}
    </Box>
  );
};

export default Chatbot;
