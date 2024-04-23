import React, { useState, useEffect } from "react";
import AnalyticsCard from "./AnalyticsCard";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";

const GoodResponseCountCard = ({ botId }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (botId === null) return;
    SendRequestWithToken_test(
      "analytics/good-answers-count",
      {
        body: JSON.stringify({
          id: botId,
        }),
      },
      (result) => setVal(result)
    );
  }, [botId]);
  return (
    <AnalyticsCard
      text="API Calling"
      val={val}
      icon="fa-thumbs-up"
    />
  );
};

export default GoodResponseCountCard;
