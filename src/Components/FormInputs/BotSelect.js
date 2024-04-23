import React, { useCallback, useState, useEffect } from "react";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";
import { convert_db_data } from "../../Utils/ChatbotUtil";
const BotSelect = ({ onChange = () => {} }) => {
  const [data, setData] = useState([]);
  const handleChange = useCallback(
    (ev) => {
      const index = ev.target.value;
      onChange(data[index], index);
    },
    [onChange, data]
  );
  useEffect(() => {
    SendRequestWithToken_test("chatbot/find-all-chatbots", {}, (result) => {
      const final_result = JSON.parse(result).map((d) => convert_db_data(d));
      setData(final_result);
      onChange(final_result[0], 0);
    });
  }, [onChange]);
  return (
    <select className="form-select form-select-lg mb-3" onChange={handleChange}>
      {data.map((d, index) => (
        <option value={index} key={index}>
          {d.name}
        </option>
      ))}
    </select>
  );
};
export default BotSelect;
