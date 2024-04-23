import React, { useCallback, useEffect, useState } from "react";
import { AddNewVoiceModal } from "../Modals/AddNewVoiceModal";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { RecordNewVoiceModal } from "../Modals/RecordNewVoiceModal";
const VoicesTable = () => {
  const [data, setData] = useState([]);
  const [addNewVoiceModalShow, setAddNewVoiceModalShow] = useState(false);
  const [recordNewVoiceModalShow, setRecordNewVoiceModalShow] = useState(false);

  const handleAddFromRecordingFiles = useCallback(() => {
    setAddNewVoiceModalShow(true);
  }, []);

  const handleAddWithRecorder = useCallback(() => {
    setRecordNewVoiceModalShow(true);
  }, []);

  const AddNewVoice = useCallback(
    (newVoice) => {
      // console.log(data);
      setData([...data, newVoice]);
    },
    [data]
  );

  const handleRemoveVoice = useCallback(
    (insertedId, index) => {
      if (window.confirm("Are you sure want to delete?")) {
        SendRequestWithToken_test(
          "voice/remove-voice",
          {
            body: JSON.stringify({
              id: insertedId,
            }),
          },
          () => setData(data.slice(0, index).concat(data.slice(index + 1)))
        );
      }
    },
    [data]
  );

  useEffect(() => {
    SendRequestWithToken_test("voice/find-all-voices", {}, (result) =>
      setData(result)
    );
  }, []);
  return (
    <>
      <div className="row mt-4">
        <div className="row">
          <div className="col-8" style={{ textAlign: "left" }}>
            <button
              className="btn btn-primary"
              onClick={handleAddFromRecordingFiles}
            >
              Add New From Recording Files
            </button>
            &nbsp;
            <button className="btn btn-primary" onClick={handleAddWithRecorder}>
              Add New With Recorder
            </button>
          </div>
        </div>
        <div className="row">
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th scope="col">Voice Name</th>
                {/* <th scope="col">Source File Name</th> */}
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan="3">
                    <h3>You don't have any voice created</h3>
                  </td>
                </tr>
              )}
              {data.map((voice, index) => (
                <tr>
                  <td>
                    <h3>{voice.name}</h3>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => handleRemoveVoice(voice._id, index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <RecordNewVoiceModal
        show={recordNewVoiceModalShow}
        setShow={setRecordNewVoiceModalShow}
        handleAdd={AddNewVoice}
      />
      <AddNewVoiceModal
        show={addNewVoiceModalShow}
        setShow={setAddNewVoiceModalShow}
        handleAdd={AddNewVoice}
      />
    </>
  );
};
export default VoicesTable;
