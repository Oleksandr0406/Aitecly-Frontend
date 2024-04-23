import React, { useEffect, useState } from "react";
import AnalyticsCard from "./AnalyticsCard";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";

const BadResponseCountCard = ({ botId }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (botId === null) return;
    SendRequestWithToken_test(
      "analytics/bad-answers-count",
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
      text="Number of Bad Responses"
      val={val}
      icon="fa-thumbs-down"
    />
  );
};

export default BadResponseCountCard;
