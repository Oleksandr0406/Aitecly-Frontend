import React, { useCallback, useEffect, useState } from "react";
import {
  Form,
  Modal,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
} from "react-bootstrap";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";
export const AddNewApiModal = ({ show, setShow, handleAdd }) => {
  const [apiName, setApiName] = useState("OPENAI_API_KEY");
  const [apiKey, setApiKey] = useState("");
  const handleClose = useCallback(() => {
    setShow(false);
  }, [setShow]);
  const handleSubmit = useCallback(
    (ev) => {
      ev.preventDefault();
      if (apiKey.length === 0) {
        alert("Please Input Key");
        return;
      }
      SendRequestWithToken_test(
        "api/add-new-api",
        {
          body: JSON.stringify({
            name: apiName,
            key: apiKey,
          }),
        },
        (result) => {
          handleAdd({
            name: apiName,
            key: apiKey,
            active: false,
          });
        }
      );
      setShow(false);
    },
    [handleAdd, setShow, apiName, apiKey]
  );
  const handleNameChange = useCallback((ev) => {
    setApiName(ev.target.value);
  }, []);
  const handleKeyChange = useCallback((ev) => {
    setApiKey(ev.target.value);
  }, []);
  useEffect(() => {
    setApiName();
    setApiName("OPENAI_API_KEY");
    setApiKey("");
  }, [show]);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      container={document.getElementById("App")}
      style={{ position: "absolute" }}
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add New</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <FormLabel>API Name</FormLabel>
            <Form.Select value={apiName} onChange={handleNameChange}>
              <option value="OPENAI_API_KEY">OpenAI</option>
              <option value="ELEVEN_API_KEY">ElevenLabs</option>
            </Form.Select>
          </FormGroup>
          <FormGroup>
            <FormLabel>API Key</FormLabel>
            <FormControl
              value={apiKey}
              type="password"
              placeholder="Enter text"
              name="name"
              onChange={handleKeyChange}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
