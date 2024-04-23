import React, { useEffect, useState } from "react";
import AnalyticsCard from "./AnalyticsCard";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";

const SourceClickedCountCard = ({ botId }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (botId === null) return;
    SendRequestWithToken_test(
      "analytics/get-total-source-clicked",
      {
        body: JSON.stringify({
          id: botId,
        }),
      },
      (result) => setVal(result)
    );
  }, [botId]);
  return (
    <AnalyticsCard text="Number of Source Clicked" val={val} icon="fa-hand-pointer" />
  );
};

export default SourceClickedCountCard;


