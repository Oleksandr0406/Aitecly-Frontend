import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import Chatbot from "./Chatbot";
import { useState } from "react";
const ChatbotInIframe = () => {
  const [chatlogId, setChatLogId] = useState(uuidv4().toString());
  return <Chatbot chatlogId={chatlogId} />;
};
export default ChatbotInIframe;
