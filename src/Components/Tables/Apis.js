import { useCallback, useEffect, useState } from "react";
import { hide_api_key } from "../../Utils/StringUtil";
import CopyButton from "../Buttons/CopyButton";
import copy from "clipboard-copy";
import DeleteButton from "../Buttons/DeleteButton";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";
import Chip from "@mui/material/Chip";
import ActivateButton from "../Buttons/ActivateButton";
import { AddNewApiModal } from "../Modals/AddNewApiModal";
import DetailButton from "../Buttons/DetailButton";

const ApiTable = () => {
  const [data, setData] = useState([]);
  const [addNewModalShow, setAddNewModalShow] = useState(false);

  const handleCopy = useCallback((content) => {
    // Use navigator.clipboard.writeText() if available
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(content)
        .then(() => {
          alert("Text copied to clipboard");
        })
        .catch((error) => {
          alert("Failed to copy text: ", error);
        });
    } else {
      // Fallback to document.execCommand("copy") for older browsers
      copy(content);
      alert("Text copied to clipboard");
    }
  }, []);

  const handleDelete = useCallback(
    (index) => {
      SendRequestWithToken_test(
        "api/delete-api",
        {
          body: JSON.stringify({
            name: data[index].name,
            key: data[index].key,
          }),
        },
        () => {
          const newData = [...data.slice(0, index), ...data.slice(index + 1)];
          // if deleted key was active key, change first api with same name as active key
          if (data[index].active) {
            const first_same_name_index = newData.findIndex(
              (obj) => obj.name === data[index].name
            );
            if (first_same_name_index !== -1)
              newData[first_same_name_index].active = true;
          }

          setData(newData);
        }
      );
    },
    [data]
  );

  const handleActivate = useCallback(
    (index) => {
      SendRequestWithToken_test(
        "api/activate-api",
        {
          body: JSON.stringify({
            name: data[index].name,
            key: data[index].key,
          }),
        },
        () => {
          const newData = [...data];
          const current_active_index = newData.findIndex(
            (obj) => obj.name === newData[index].name && obj.active === true
          );
          if (current_active_index !== -1) {
            newData[current_active_index].active = false;
          }
          newData[index].active = true;

          setData(newData);
        }
      );
    },
    [data]
  );

  const handleAdd = useCallback(
    (obj) => {
      const current_active_index = data.findIndex(
        (obj1) => obj1.name === obj.name && obj1.active === true
      );
      if (current_active_index === -1) obj.active = true;
      setData([...data, obj]);
    },
    [data]
  );

  const handleDetail = useCallback(() => {}, []);

  useEffect(() => {
    SendRequestWithToken_test("api/get-all-apis", {}, (results) => {
      const fetched_data = [];
      JSON.parse(results).forEach((result) => {
        result.keys.forEach((key) => {
          fetched_data.push({
            name: result.name,
            key,
            active: key === result.active_key,
          });
        });
      });
      setData(fetched_data);
    });
  }, []);

  return (
    <>
      <div className="row mt-4">
        <div className="col-1">
          <button
            className="btn btn-primary"
            onClick={() => setAddNewModalShow(true)}
          >
            Add New
          </button>
        </div>
      </div>
      <div className="row mt-2">
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th scope="col">API Name</th>
              <th scope="col">API Key</th>
              <th scope="col" style={{ width: "200px" }}></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan="3">
                  <h3>You don't have any api created</h3>
                </td>
              </tr>
            )}
            {data.map((row, index) => (
              <tr class={row.active === true ? "table-success" : ""}>
                <td>
                  <h5>{row.name}</h5>
                </td>
                <td>
                  <h5>{hide_api_key(row.key)} </h5>
                </td>
                <td style={{ textAlign: "left" }}>
                  <CopyButton onClick={() => handleCopy(row.key)} />{" "}
                  <DeleteButton onClick={() => handleDelete(index)} />{" "}
                  {row.active === false && (
                    <ActivateButton onClick={() => handleActivate(index)} />
                  )}
                  {/* {row.name === "ELEVEN_API_KEY" && (
                    <>
                      {" "}
                      <DetailButton onClick={() => handleDetail(index)} />
                    </>
                  )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddNewApiModal
        show={addNewModalShow}
        setShow={setAddNewModalShow}
        handleAdd={handleAdd}
      />
    </>
  );
};

export default ApiTable;
