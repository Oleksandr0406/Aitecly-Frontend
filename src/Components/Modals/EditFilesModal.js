import React, { useCallback, useState, useEffect } from "react";
import { Form, Modal, Button, FormControl } from "react-bootstrap";
import {
  SendRequestWithToken_test,
  SendUploadRequestWithToken_test,
} from "../../Utils/FetchUtil";
export const EditFilesModal = ({ show, setShow, id, AddFile = () => {} }) => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const handleClose = useCallback(() => {
    setShow(false);
  }, [setShow]);

  const handleSubmit = useCallback(() => {
    setShow(false);
  }, [setShow]);

  const handleAdd = useCallback(() => {
    setIsDisabled(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("botId", id);
    SendUploadRequestWithToken_test(
      "chatbot/add-training-file",
      {
        body: formData,
      },
      (result) => {
        setFiles([...files, file.name]);
        AddFile(file.name);
        //setFile(null);
        setIsDisabled(false);
      },
      () => {
        setIsDisabled(false);
        alert("Failed for reason");
      }
    );
  }, [id, file, files, AddFile]);

  useEffect(() => {
    if (id !== "") {
      SendRequestWithToken_test(
        "chatbot/find-files-by-id",
        {
          body: JSON.stringify({
            id,
          }),
        },
        (result) => setFiles(result)
      );
    }
  }, [id]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      container={document.getElementById("App")}
      style={{ position: "absolute" }}
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-9">
              <FormControl
                type="file"
                placeholder="Input links here..."
                onChange={(ev) => setFile(ev.target.files[0])}
              />
            </div>
            {file && (
              <div className="col-2 mx-2">
                <button
                  className="btn btn-primary"
                  onClick={handleAdd}
                  type="button"
                  disabled={isDisabled}
                >
                  Add
                </button>
              </div>
            )}
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <table className="table table-hover">
                <tbody>
                  {files.map((f) => (
                    <tr>
                      <td>{f}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
