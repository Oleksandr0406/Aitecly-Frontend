import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useChatbot = ({ chatbotId }) => {
  const data = useSelector((auth) => auth.chatbot.chatbots);
  const index = useMemo(
    () => data.findIndex((row) => row._id === chatbotId),
    [chatbotId, data]
  );
  if (index !== -1) return data[index];
  return {};
};
