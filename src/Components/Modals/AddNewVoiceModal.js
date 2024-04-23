import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Form,
  Modal,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
} from "react-bootstrap";
import { SendUploadRequestWithToken_test } from "../../Utils/FetchUtil";
import VoiceLabels from "../Tables/VoiceLabels";
export const AddNewVoiceModal = ({ show, setShow, handleAdd }) => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [labels, setLabels] = useState([]);
  const [description, setDescription] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const handleClose = useCallback(() => {
    setShow(false);
  }, [setShow]);
  const handleSubmit = useCallback(
    (ev) => {
      ev.preventDefault();
      if (!name) {
        alert("Please Input Name");
        return;
      }
      const formData = new FormData();
      if (files.length === 0) {
        alert("Please Upload at least one recording file");
        return;
      }
      files.forEach((file) => {
        formData.append("voicefiles", file);
      });
      formData.append("name", name);
      formData.append("description", description);
      const labels_obj = {};
      labels.forEach((label) => (labels_obj[label.key] = label.value));
      console.log(labels_obj);
      formData.append("labels", JSON.stringify(labels_obj));
      setIsCloning(true);
      SendUploadRequestWithToken_test(
        "voice/add-new-voice",
        {
          body: formData,
        },
        (result) => {
          handleAdd({
            name: name,
            _id: result,
          });
          setIsCloning(false);
          setShow(false);
        },
        () => {
          setIsCloning(false);
          setShow(false);
        }
      );
    },
    [name, files, description, labels, handleAdd, setShow]
  );
  const isAddDisabled = useMemo(() => {
    if (isCloning) return true;
    if (!name || name.length === 0) return true;
    if (files.filter((audio) => audio).length === 0) return true;
    if (labels.filter((label) => label.key === "").length > 0) return true;
    if (!isConfirmed) return true;
    return false;
  }, [name, files, labels, isConfirmed, isCloning]);

  useEffect(() => {
    setLabels([]);
    setFiles([]);
    setName("");
    setIsConfirmed(false);
    setDescription("");
    setIsCloning(false);
  }, [show]);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="modal-xl"
      container={document.getElementById("App")}
      style={{ position: "absolute" }}
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Voice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <FormLabel>Name *</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter text"
              name="name"
              onChange={(ev) => setName(ev.target.value)}
            />
            <br></br>
            <label for="formFileMultiple" className="form-label">
              Please Choose your voice file
            </label>
            <input
              className="form-control"
              type="file"
              id="formFileMultiple"
              name="voicefile"
              multiple
              onChange={(ev) => setFiles(Array.from(ev.target.files))}
            />
          </FormGroup>
          <Form.Group className="mt-3 mb-3">
            <Form.Label>Labels {labels.length}/5</Form.Label>
            <VoiceLabels labels={labels} setLabels={setLabels} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              placeholder='How would you describe the voice? e.g. "An old American male voice with a slight hoarseness in his throat. Perfect for news"'
            />
          </Form.Group>
          <Form.Group>
            <Form.Check // prettier-ignore
              type="checkbox"
              label="I hereby confirm that I have all necessary rights or consents to upload and clone these voice samples and that I will not use the platform-generated content for any illegal, fraudulent, or harmful purpose."
              checked={isConfirmed}
              onChange={(ev) => setIsConfirmed(!isConfirmed)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" disabled={isAddDisabled}>
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
