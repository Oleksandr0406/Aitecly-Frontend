import { useCallback, useEffect, useState } from "react";
import { SendRequestWithToken_test } from "../Utils/FetchUtil";
import { useParams } from "react-router-dom";
import { useChatbot } from "../Hooks/useChatbot";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { updateChatbot } from "../Slice/chatbotSlice";

export const VoiceSetting = () => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const { chatbotId } = useParams();
  const chatbot = useChatbot({ chatbotId });
  const dispatch = useDispatch();
  const handleVoiceChange = (ev) => {
    setSelectedVoice(ev.target.value);
  };

  const handleSubmit = useCallback(() => {
    SendRequestWithToken_test(
      "chatbot/set-voice",
      {
        body: JSON.stringify({
          id: chatbotId,
          voiceId: voices[selectedVoice].voiceId,
        }),
      },
      (result) => {
        dispatch(
          updateChatbot({
            id: chatbotId,
            data: {
              voiceId: voices[selectedVoice].voiceId,
            },
          })
        );
        alert("Successful!");
      }
    );
  }, [voices, chatbotId, dispatch, selectedVoice]);

  useEffect(() => {
    if (chatbotId !== "") {
      setIsDisabled(true);
      SendRequestWithToken_test(
        "chatbot/find-voices-by-id",
        {
          body: JSON.stringify({
            id: chatbotId,
          }),
        },
        (result) => {
          setVoices(result);
          result.forEach((bot, index) => {
            if (bot.voiceId === chatbot.voiceId) {
              console.log(bot);
              setSelectedVoice(index);
            }
          });
          setIsDisabled(false);
        }
      );
    }
  }, [chatbot, chatbotId]);
  return (
    <Box margin={6} display="flex" flexDirection="column" gap={4}>
      <Box
        display="flex"
        gap={4}
        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
        padding={4}
        borderRadius="10px"
        flexDirection="column"
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography align="left">Voice Settings</Typography>
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={selectedVoice}
              onChange={handleVoiceChange}
              name="modelName"
              sx={{ textAlign: "left" }}
            >
              {voices.map((voice, index) => (
                <MenuItem value={index}>
                  <b>{voice.name}</b>
                  {voice.isDefault ? " - premade" : " - custom"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box display="flex" mb={4} justifyContent="end" gap={4}>
        <Box>
          <Button
            size="large"
            sx={{ color: "black", borderRadius: "7px", fontWeight: 600 }}
          >
            Close
          </Button>
        </Box>
        <Box>
          <Button
            variant="contained"
            sx={{ borderRadius: "7px", fontWeight: 600 }}
            size="large"
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
