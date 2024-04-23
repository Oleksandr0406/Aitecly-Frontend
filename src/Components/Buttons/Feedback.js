import React, { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { SampleAnswerModal } from "../Modals/SampleAnswerModal";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";
import CloseIcon from "@mui/icons-material/Close";

const FeedbackButton = ({ input, output, botId, logId, index }) => {
  const [isUpHovered, setIsUpHovered] = useState(false);
  const [isDownHovered, setIsDownHovered] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [sampleAnswerModalShow, setSampleAnswerModalShow] = useState(false);

  const handleUpClick = useCallback(() => {
    setSelected(0);
    if (selected !== 0) {
      SendRequestWithToken_test("chatlog/set-feedback", {
        body: JSON.stringify({
          logId: logId,
          msgIndex: index,
          feedback: 1,
        }),
      });
      SendRequestWithToken_test("chatbot/add-sample-answer", {
        body: JSON.stringify({
          output,
          input,
          botId: botId,
        }),
      });
    }
  }, [input, output, botId, selected, logId, index]);

  const handleDownClick = useCallback(() => {
    if (selected !== 1) {
      SendRequestWithToken_test("chatlog/set-feedback", {
        body: JSON.stringify({
          logId: logId,
          msgIndex: index,
          feedback: -1,
        }),
      });
      setSampleAnswerModalShow(true);
    }
    setSelected(1);
  }, [selected, logId, index]);

  return (
    <>
      {/* <CloseIcon
        onMouseEnter={() => setIsDownHovered(true)}
        onMouseLeave={() => setIsDownHovered(false)}
        onClick={handleDownClick}
      /> */}

      {selected !== 1 && (
        <FontAwesomeIcon
          icon={faThumbsUp}
          className={`mx-1 text-right ${
            isUpHovered || selected === 0 ? "text-red" : ""
          }`}
          onMouseEnter={() => setIsUpHovered(true)}
          onMouseLeave={() => setIsUpHovered(false)}
          onClick={handleUpClick}
        />
      )}
      {selected !== 0 && (
        <FontAwesomeIcon
          icon={faThumbsDown}
          className={`mx-1 text-right ${
            isDownHovered || selected === 1 ? "text-red" : ""
          }`}
          onMouseEnter={() => setIsDownHovered(true)}
          onMouseLeave={() => setIsDownHovered(false)}
          onClick={handleDownClick}
        />
      )}
      <SampleAnswerModal
        input={input}
        botId={botId}
        show={sampleAnswerModalShow}
        setShow={setSampleAnswerModalShow}
      />
    </>
  );
};

export default FeedbackButton;
