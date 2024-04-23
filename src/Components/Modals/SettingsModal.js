import { useCallback, useEffect, useState } from "react";
import { Modal, Button, Form, FloatingLabel } from "react-bootstrap";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";

export const SettingsModal = ({
  show,
  setShow,
  id,
  selectedVoiceId,
  SetVoice,
}) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState();
  const [isDisabled, setIsDisabled] = useState(true);
  const handleClose = useCallback(() => {
    SendRequestWithToken_test(
      "chatbot/set-voice",
      {
        body: JSON.stringify({
          id: id,
          voiceId: voices[selectedVoice].voiceId,
        }),
      },
      (result) => {
        SetVoice(voices[selectedVoice].voiceId);
        setShow(false);
      }
    );
  }, [id, voices, selectedVoice, SetVoice, setShow]);

  const handleVoiceChange = useCallback((ev) => {
    setSelectedVoice(ev.target.value);
  }, []);

  useEffect(() => {
    if (id !== "") {
      setIsDisabled(true);
      SendRequestWithToken_test(
        "chatbot/find-voices-by-id",
        {
          body: JSON.stringify({
            id: id,
          }),
        },
        (result) => {
          setVoices(result);
          console.log(selectedVoiceId);
          result.forEach((bot, index) => {
            if (bot.voiceId === selectedVoiceId) setSelectedVoice(index);
          });
          setIsDisabled(false);
        }
      );
    }
  }, [id, selectedVoiceId]);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        animation={true}
        container={document.getElementById("App")}
        style={{ position: "absolute" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Control Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Voice Settings</Form.Label>
          <FloatingLabel
            controlId="floatingInput"
            label="Voice Name"
            className="mb-3"
          >
            <Form.Select
              aria-label="Default select example"
              style={{ maxHeight: "200px", overflowY: "auto" }}
              disabled={isDisabled}
              onChange={handleVoiceChange}
              value={selectedVoice}
            >
              {voices.map((voice, index) => (
                <option value={index}>
                  <b>{voice.name}</b>
                  {voice.isDefault ? "  - premade" : "  - custom"}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
