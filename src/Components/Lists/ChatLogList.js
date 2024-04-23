import React, { useCallback, useEffect, useState } from "react";
import Chatbox from "../Chatbox";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";
import moment from "moment";
import { useParams } from "react-router-dom";

const ChatLogList = () => {
  const { chatbotId } = useParams();
  const [messages, setMessages] = useState([]);
  const [chatLogs, setChatLogs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [chatbot, setChatbot] = useState({});
  const [chatlogId, setChatlogId] = useState(null);

  useEffect(() => {
    SendRequestWithToken_test(
      "chatlog/find-chatlogs",
      {
        body: JSON.stringify({
          id: chatbotId,
        }),
      },
      (result) => {
        console.log("chatlog", JSON.parse(result));
        setChatLogs(JSON.parse(result));
        getChatlogId();
      }
    );
  }, [chatbotId]);

  useEffect(() => {
    SendRequestWithToken_test(
      "chatbot/find-chatbot-by-id",
      {
        body: JSON.stringify({
          id: chatbotId,
        }),
      },
      (result) => {
        setChatbot(result);
      }
    );
  }, [chatbotId]);

  const fetchMessages = useCallback((logId) => {
    SendRequestWithToken_test(
      "chatlog/find_messages_by_id",
      {
        body: JSON.stringify({
          logId: logId,
        }),
      },
      (result) =>
        setMessages([
          { content: "Hello, How may I help you today?", role: "assistant" },
          ...result,
        ])
    );
  }, []);
  const handleSelect = useCallback(
    (index) => {
      setChatlogId(null);
      setSelectedIndex(index);
      fetchMessages(chatLogs[index].logId);
    },
    [chatLogs, fetchMessages]
  );

  const getChatlogId = () => {
    const logId = localStorage.getItem('chatlog_id');
    if(logId){
      fetchMessages(logId);
      setChatlogId(logId);
      localStorage.removeItem('chatlog_id');
    }
  }

  return (
    <div className="row py-3">
      <div className="col-3">
        <h1>Chat Logs</h1>
        <hr />
        <div
          className="list-group list-group-light"
          id="list-tab"
          role="tablist"
        >
          {chatLogs.length === 0 && <h2>No Chat Logs</h2>}
          {chatLogs[0] && chatLogs.map((chatLog, index) => (
            <span
              class={`list-group-item list-group-item-action px-3 border-0 ${
                (chatlogId && chatlogId === chatLog.logId && "active") || (selectedIndex === index && "active")
              }`}
              id="list-home-list"
              data-mdb-toggle="list"
              role="tab"
              aria-controls="list-home"
              onClick={() => handleSelect(index)}
            >
              {moment(new Date(chatLog.createdDate.$date)).format(
                "MM/DD/YYYY HH:mm"
              )}
            </span>
          ))}
        </div>
      </div>
      <div className="col-9">
        <Chatbox
          readOnly={true}
          name={selectedIndex !== -1 ? chatLogs[selectedIndex].botName : ""}
          messages={messages}
          bodId={selectedIndex !== -1 ? chatLogs[selectedIndex].botId : ""}
          chatbot={chatbot}
        />
      </div>
    </div>
  );
};

export default ChatLogList;
