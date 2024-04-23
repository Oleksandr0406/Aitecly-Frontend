import React, { useState, useEffect } from "react";
import AnalyticsCard from "./AnalyticsCard";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";

const AvgMessageCountCard = ({ botId = null }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (botId === null) return;
    SendRequestWithToken_test(
      "analytics/avg-messages-count",
      {
        body: JSON.stringify({
          id: botId,
        }),
      },
      (result) => setVal((result + 0.0).toFixed(2))
    );
  }, [botId]);
  return (
    <AnalyticsCard
      text="Average Messages Per Chat Session"
      val={val}
      icon="fa-paper-plane"
    />
  );
};

export default AvgMessageCountCard;
