import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCallback } from "react";
import DeleteButton from "../Buttons/DeleteButton";
const VoiceLabels = ({ labels, setLabels }) => {
  const addLabel = useCallback(() => {
    setLabels([...labels, { key: "", value: "" }]);
  }, [labels, setLabels]);
  const handleChangeLabel = useCallback(
    (ev, index, field) => {
      setLabels([
        ...labels.slice(0, index),
        { ...labels[index], [field]: ev.target.value },
        ...labels.slice(index + 1),
      ]);
    },
    [labels, setLabels]
  );
  const deleteLabel = useCallback(
    (index) => {
      setLabels([...labels.slice(0, index), ...labels.slice(index + 1)]);
    },
    [labels, setLabels]
  );
  return (
    <>
      <table className="table table-hover table-striped">
        <thead>
          <tr>
            <th scope="col">Key</th>
            <th scope="col">Value</th>
            <th scope="col" style={{ width: "50px" }}></th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label, index) => (
            <tr>
              <td>
                <input
                  className="form-control"
                  placeholder="key e.g. Accent"
                  value={label.key}
                  onChange={(ev) => handleChangeLabel(ev, index, "key")}
                />
              </td>
              <td>
                <input
                  className="form-control"
                  placeholder="key e.g. American"
                  value={label.value}
                  onChange={(ev) => handleChangeLabel(ev, index, "value")}
                />
              </td>
              <td>
                <DeleteButton onClick={() => deleteLabel(index)} />
              </td>
            </tr>
          ))}
          {labels.length < 5 && (
            <tr>
              <td colspan="3" className="text-center">
                <IconButton color="primary" onClick={addLabel}>
                  <AddIcon />
                </IconButton>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default VoiceLabels;
