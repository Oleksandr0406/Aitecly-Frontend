import React, { useState, useEffect } from "react";
import AnalyticsCard from "./AnalyticsCard";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";

const TotalMessageThisWeekCountCard = ({ botId }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (botId === null) return;
    SendRequestWithToken_test(
      "analytics/total-messages-count",
      {
        body: JSON.stringify({
          botId: botId,
          type: 1,
        }),
      },
      (result) => setVal(result)
    );
  }, [botId]);
  return (
    <AnalyticsCard
      text="Total Messages This Week"
      val={val}
      icon="fa-paper-plane"
    />
  );
};

export default TotalMessageThisWeekCountCard;
