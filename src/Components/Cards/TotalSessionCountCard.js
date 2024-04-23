import React, { useEffect, useState } from "react";
import AnalyticsCard from "./AnalyticsCard";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";

const TotalSessionCountCard = ({ botId }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (botId === null) return;
    SendRequestWithToken_test(
      "analytics/total-chat-sessions-count",
      {
        body: JSON.stringify({
          id: botId,
        }),
      },
      (result) => setVal(result)
    );
  }, [botId]);
  return (
    <AnalyticsCard text="Total Chat Session" val={val} icon="fa-message" />
  );
};

export default TotalSessionCountCard;


