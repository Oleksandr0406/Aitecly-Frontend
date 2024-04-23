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
import { Box, Typography } from "@mui/material";
export const SampleAnswerModal = ({ show, setShow, input = "", botId }) => {
  const handleClose = useCallback(() => {
    setShow(false);
  }, [setShow]);
  const handleSubmit = useCallback(
    (ev) => {
      ev.preventDefault();
      const formData = new FormData(ev.target);
      SendRequestWithToken_test(
        "chatbot/add-sample-answer",
        {
          body: JSON.stringify({
            output: formData.get("output"),
            input,
            botId: botId,
          }),
        },
        (result) => {
          alert("Successfully added");
          setShow(false);
        }
      );
    },
    [input, botId, setShow]
    );
  return (
    <Modal
      show={show}
      onHide={handleClose}
      container={document.getElementById("App")}
      style={{ position: "absolute"}}
    >
      <Box zIndex={2}>
        <Form onSubmit={handleSubmit} >
          <Modal.Header closeButton>
            <Modal.Title>Correct this response</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Box display="flex" flexDirection="column" gap={2}>
            <FormGroup>
              <FormLabel>Your Question</FormLabel>
              <Typography>{ input }</Typography>
            </FormGroup>
            <FormGroup>
              <FormLabel>Your Answer</FormLabel>
              <FormControl as="textarea" placeholder="Enter text" name="output" />
            </FormGroup>
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Box>
    </Modal>
  );
};
