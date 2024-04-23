import React, { useCallback, useEffect, useState } from "react";
import BotSelect from "../Components/FormInputs/BotSelect";
import TotalSessionCountCard from "../Components/Cards/TotalSessionCountCard";
import GoodResponseCountCard from "../Components/Cards/GoodResponseCountCard";
import BadResponseCountCard from "../Components/Cards/BadResponseCountCard";
import TotalMessageThisMonthCountCard from "../Components/Cards/TotalMessageThisMonthCountCard";
import TotalMessageThisWeekCountCard from "../Components/Cards/TotalMessageThisWeekCountCard";
import AvgMessageCountCard from "../Components/Cards/AvgMessageCountCard";
import { useNavigate, useParams } from "react-router-dom";
import SourceClickedCountCard from "../Components/Cards/SourceClickedCountCard";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { SendRequestWithToken_test } from "../Utils/FetchUtil";
import DevicesIcon from "@mui/icons-material/Devices";
import TabIcon from "@mui/icons-material/Tab";
import SurroundSoundIcon from "@mui/icons-material/SurroundSound";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import DesktopMacOutlinedIcon from "@mui/icons-material/DesktopMacOutlined";
import { BsAndroid2, BsApple, BsWindows } from "react-icons/bs";
import { FaLinux, FaEdge, FaSafari } from "react-icons/fa";
import { SiMacos, SiFirefox } from "react-icons/si";
import { AiFillChrome } from "react-icons/ai";
import { GrInternetExplorer } from "react-icons/gr";

function formatDate(inputDate) {
  const date = new Date(inputDate);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();

  const formattedDate = `${month}/${day}/${year}`;

  return formattedDate;
}

const Analytics = () => {
  const { chatbotId } = useParams();
  const [data, setData] = useState(null);
  const [chatLogs, setChatLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    SendRequestWithToken_test(
      "chatbot/get-all-sources",
      {
        body: JSON.stringify({
          id: chatbotId,
        }),
      },
      (result) => {
        console.log({ result });
        setData(result);
      }
    );

    SendRequestWithToken_test(
      "chatlog/find-chatlogs",
      {
        body: JSON.stringify({
          id: chatbotId,
        }),
      },
      (result) => {
        console.log({ data: JSON.parse(result) });
        setChatLogs(JSON.parse(result));
      }
    );
  }, []);


  const redirectToChatLogs = (id) => {
    localStorage.setItem('chatlog_id', id);
    navigate(`/chatbot/${chatbotId}/chat-log`);
  }

  return (
    <>
      <div className="row">
        <TotalSessionCountCard botId={chatbotId} />
        {/* <GoodResponseCountCard botId={chatbotId} /> */}
        <BadResponseCountCard botId={chatbotId} />
        <TotalMessageThisMonthCountCard botId={chatbotId} />
        <TotalMessageThisWeekCountCard botId={chatbotId} />
        <AvgMessageCountCard botId={chatbotId} />
        <SourceClickedCountCard botId={chatbotId} />
      </div>
      <Box m={2} my={7}>
        <TableContainer component={Paper} mt={6}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>Ip Address</TableCell>
                <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>Session Date</TableCell>
                <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>Country</TableCell>
                <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                  <DevicesIcon />
                </TableCell>
                <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                  <TabIcon />
                </TableCell>
                <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                  <SurroundSoundIcon />
                </TableCell>

                <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>Bot</TableCell>
                <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>Appeared on</TableCell>
                <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                  Displayed Sources
                </TableCell>
                <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                  Clicked On Sources
                </TableCell>
                <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                  Number of Messages
                </TableCell>

                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chatLogs &&
                chatLogs.map((item, ind) => (
                  <TableRow key={item._id.$oid}>
                    <TableCell>{ind + 1}</TableCell>
                    <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>38.180.31.243</TableCell>

                    <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                      {formatDate(item.createdDate.$date)}
                    </TableCell>
                    <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                      France
                    </TableCell>
                    <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                      {item.device === "Desktop" ? (
                        <DesktopMacOutlinedIcon />
                      ) : (
                        <PhoneAndroidIcon />
                      )}
                    </TableCell>
                    <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                      {item.browser === "Edge" ? (
                        <FaEdge style={{ fontSize: "20px" }} />
                      ) : item.browser === "Firefox" ? (
                        <SiFirefox style={{ fontSize: "20px" }} />
                      ) : item.browser === "Safari" ? (
                        <FaSafari style={{ fontSize: "20px" }} />
                      ) : item.browser === "Chrome" ? (
                        <AiFillChrome style={{ fontSize: "20px" }} />
                      ) : item.browser === "IE" ? (
                        <GrInternetExplorer style={{ fontSize: "20px" }} />
                      ) : null}
                    </TableCell>
                    <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                      {item.os === "Windows" ? (
                        <BsWindows style={{ fontSize: "20px" }} />
                      ) : item.os === "Linux" ? (
                        <FaLinux style={{ fontSize: "20px" }} />
                      ) : item.os === "Android" ? (
                        <BsAndroid2 style={{ fontSize: "20px" }} />
                      ) : item.os === "iOS" ? (
                        <BsApple style={{ fontSize: "20px" }} />
                      ) : item.os === "Mac OS" ? (
                        <SiMacos style={{ fontSize: "20px" }} />
                      ) : null}
                    </TableCell>
                    <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                      {item.botName}
                    </TableCell>
                    <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                      http://127.0.0.1:5500/1.html
                    </TableCell>
                    <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                      {/* { item.displayedSources } */}
                      {item.displayedSources.map((link) => {
                        return (
                          <>
                            {link}
                            <br />
                          </>
                        );
                      })}
                    </TableCell>
                    <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                      {/* { item.clickedSources} */}
                      {item.clickedSources.map((link) => {
                        return (
                          <>
                            {link}
                            <br />
                          </>
                        );
                      })}
                    </TableCell>
                    <TableCell sx={{ padding: ["0px", "0px", "0px", "10px"] }}>
                      {item.messages.length}
                    </TableCell>
                    <TableCell >
                      <Button size="small" sx={{ width: "100px"}} variant="outlined"
                        onClick={() => redirectToChatLogs(item.logId)}
                      >
                        Chat log
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Analytics;
