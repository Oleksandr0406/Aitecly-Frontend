import React, { useCallback } from "react";
import {
  Form,
  Modal,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
} from "react-bootstrap";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";
export const AddNewBotModal = ({ show, setShow, handleAdd }) => {
  const handleClose = useCallback(() => {
    setShow(false);
  }, [setShow]);
  const handleSubmit = useCallback(
    (ev) => {
      ev.preventDefault();
      const formData = new FormData(ev.target);
      SendRequestWithToken_test(
        "chatbot/add-new-chatbot",
        {
          body: JSON.stringify({
            name: formData.get("name"),
          }),
        },
        (result) => {
          handleAdd({
            name: formData.get("name"),
            _id: result.id,
            pages: [],
            files: [],
            voiceId: result.voiceId,
            active: true,
            createdAt: new Date(Date.now()),
            chatType: "Sales Person",
            customPrompt: "",
            defaultGreetingMessage: "Hello, How can I assist you today?",
            modelName: "gpt-4",
            showSource: true,
            language: "English",
            responseLength: "Normal",
            creativity: 0.7,
            color: "#54b4d3",
            avatarImageId: "",
          });
        }
      );
      setShow(false);
    },
    [handleAdd, setShow]
  );
  return (
    <Modal
      show={show}
      onHide={handleClose}
      container={document.getElementById("App")}
      style={{ position: "absolute" }}
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Bot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <FormLabel>Name</FormLabel>
            <FormControl type="text" placeholder="Enter text" name="name" />
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
