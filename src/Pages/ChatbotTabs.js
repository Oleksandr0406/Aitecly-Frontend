import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import Analytics from "./Analytics";
import ChatIcon from "@mui/icons-material/Chat";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SettingsIcon from "@mui/icons-material/Settings";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import SettingsVoiceIcon from "@mui/icons-material/SettingsVoice";
import Chatbot from "./Chatbot";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import ChatLogList from "../Components/Lists/ChatLogList";
import { Settings } from "./Settings";
import { Badge, Grid, Typography } from "@mui/material";
import { Corrections } from "./Corrections";
import { SendRequestWithToken_test } from "../Utils/FetchUtil";
import { VoiceSetting } from "./VoiceSetting";

const obj = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "120px"
}

const ChatbotTabs = () => {
  const isInframe = window.self !== window.top;
  const [chatlogId, setChatLogId] = useState(uuidv4().toString());
  const { chatbotId, tab } = useParams();
  const navigate = useNavigate();
  const [chatCount, setChatCount] = useState(0);

  const handleChange = (event, newValue) => {
    setChatLogId(uuidv4().toString());
    navigate(`/chatbot/${chatbotId}/${newValue}`);
  };

  useEffect(() => {
    if (!isInframe) {
      SendRequestWithToken_test(
        "chatlog/find-chatlog-counts",
        {
          body: JSON.stringify({
            id: chatbotId,
          }),
        },
        (result) => {
          setChatCount(result);
        }
      );
    }
  }, [chatbotId, isInframe]);

  return (
    <Grid >
      <Box >
        {!isInframe && (
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tab} onChange={handleChange}
              sx={{
                '& .MuiTabs-flexContainer': {
                  flexWrap: 'wrap',
                },
              }}
            >
              <Tab
                icon={<ChatIcon />}
                iconPosition="start"
                label="Simulation"
                value="simulation"
              />
              <Tab
                icon={<SettingsIcon />}
                iconPosition="start"
                label="Bot Settings"
                value="setting"
              />
              <Tab
                icon={<AnalyticsIcon />}
                iconPosition="start"
                label="Analytics"
                value="analysis"
              />
              <Tab
                icon={<ManageSearchIcon />}
                iconPosition="start"
                label={
                  <Badge color="error" badgeContent={chatCount} max={9}>
                    <Typography fontSize="0.875rem">Chat Logs</Typography>
                  </Badge>
                }
                value="chat-log"
              />
              <Tab
                icon={<ThumbUpAltIcon />}
                iconPosition="start"
                label="Corrections"
                value="correction"
              />
              <Tab
                icon={<SettingsVoiceIcon />}
                iconPosition="start"
                label="Voice Setting"
                value="voice-setting"
              />
            </Tabs>
          </Box>
        )}
      </Box>
      <Box item padding={4}>
        {tab === "simulation" && <Chatbot chatlogId={chatlogId} />}
        {tab === "setting" && <Settings />}
        {tab === "analysis" && <Analytics />}
        {tab === "chat-log" && <ChatLogList />}
        {tab === "voice-setting" && <VoiceSetting />}
        {tab === "correction" && <Corrections chatbotId={chatbotId} />}
      </Box>
    </Grid>
  );
};

export default ChatbotTabs;
