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
import { Recording_Text } from "../../Constants/recording";
import { RecordButton } from "../Buttons/Record";
import MicRecorder from "mic-recorder-to-mp3";
import { PlayButton } from "../Buttons/PlayButton";
import VoiceLabels from "../Tables/VoiceLabels";

const formatTime = (seconds) => {
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

export const RecordNewVoiceModal = ({ show, setShow, handleAdd }) => {
  const [audioFiles, setAudioFiles] = useState(
    new Array(Recording_Text.length).fill(null)
  );
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [textIndex, setTextIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [timerId, setTimerId] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [name, setName] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [labels, setLabels] = useState([]);
  const [description, setDescription] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCloning, setIsCloning] = useState(false);

  const handleClose = useCallback(() => {
    setShow(false);
  }, [setShow]);

  const increaseRecordingSeconds = useCallback(() => {
    setRecordingSeconds((recordingSeconds) => recordingSeconds + 1);
  }, []);

  const startRecording = useCallback(async () => {
    const newRecorder = new MicRecorder({ bitRate: 128 });
    setIsRecording(true);
    clearInterval(timerId);
    setRecordingSeconds(0);
    if (currentPlayer) {
      currentPlayer.pause();
      setIsPlaying(false);
    }
    setTimerId(setInterval(increaseRecordingSeconds, 1000));
    try {
      await newRecorder.start();
      setRecorder(newRecorder);
    } catch (e) {
      alert(e);
    }
  }, [increaseRecordingSeconds, timerId, currentPlayer]);

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    clearInterval(timerId);
    setTimerId(null);
    if (!recorder) return;

    try {
      const [buffer, blob] = await recorder.stop().getMp3();
      const audioFile = new File(buffer, "voice-message.mp3", {
        type: blob.type,
        lastModified: Date.now(),
      });

      const audio = new Audio(URL.createObjectURL(audioFile));
      setCurrentPlayer(audio);
      const newAudioFiles = [...audioFiles];
      newAudioFiles[textIndex] = audioFile;
      setAudioFiles(newAudioFiles);
      console.log("stop");
    } catch (e) {
      console.error(e);
      alert(e);
    }
  }, [recorder, audioFiles, textIndex, timerId]);

  const handlePlay = useCallback(() => {
    if (currentPlayer) {
      currentPlayer.play();
      return true;
    }
    alert("Please record first");
    return false;
  }, [currentPlayer]);

  const handlePause = useCallback(() => {
    if (currentPlayer) {
      currentPlayer.pause();
      return true;
    }
    return false;
  }, [currentPlayer]);

  const handleNext = useCallback(() => {
    if (currentPlayer === null) {
      alert("Please record this");
      return;
    }
    setTextIndex(textIndex + 1);
    if (audioFiles[textIndex + 1] === null) setCurrentPlayer(null);
    else
      setCurrentPlayer(
        new Audio(URL.createObjectURL(audioFiles[textIndex + 1]))
      );
  }, [textIndex, currentPlayer, audioFiles]);

  const handlePrev = useCallback(() => {
    setTextIndex(textIndex - 1);
    setCurrentPlayer(new Audio(URL.createObjectURL(audioFiles[textIndex - 1])));
  }, [textIndex, audioFiles]);

  const handleSubmit = useCallback(
    (ev) => {
      ev.preventDefault();
      if (!name) {
        alert("Please Input Name");
        return;
      }
      const formData = new FormData();
      const filteredAudioFiles = audioFiles.filter((file) => file !== null);
      if (filteredAudioFiles.length === 0) {
        alert("Please record at least one text");
        return;
      }
      filteredAudioFiles.forEach((file) => {
        formData.append("voicefiles", file);
      });
      formData.append("name", name);
      formData.append("description", description);
      const labels_obj = {};
      labels.forEach((label) => (labels_obj[label.key] = label.value));
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
    [handleAdd, setShow, name, audioFiles, description, labels]
  );

  const isAddDisabled = useMemo(() => {
    if (isCloning) return true;
    if (!name || name.length === 0) return true;
    if (audioFiles.filter((audio) => audio).length === 0) return true;
    if (labels.filter((label) => label.key === "").length > 0) return true;
    if (!isConfirmed) return true;
    return false;
  }, [name, audioFiles, labels, isConfirmed, isCloning]);

  useEffect(() => {
    if (currentPlayer === null) return;
    const pause = () => {
      setTimeout(() => {
        if (currentPlayer) {
          currentPlayer.pause();
          setIsPlaying(false);
        }
      }, 300);
    };
    currentPlayer.removeEventListener("ended", pause);
    currentPlayer.addEventListener("ended", pause);
    currentPlayer.addEventListener("loadedmetadata", function () {
      var duration = currentPlayer.duration;
      setRecordingSeconds(duration);
    });
    return () => {
      currentPlayer.removeEventListener("ended", pause);
    };
  }, [currentPlayer]);

  useEffect(() => {
    setIsCloning(false);
    setLabels([]);
    setIsConfirmed(false);
    setName("");
    setAudioFiles(new Array(Recording_Text.length).fill(null));
    setDescription("");
  }, [show, Recording_Text]);

  return (
    <Modal show={show} onHide={handleClose} className="modal-xl" 
    container={document.getElementById("App")}
    style={{ position: "absolute" }}>
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
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <br></br>
          </FormGroup>
          <Form.Group className="mb-3">
            <Form.Label>{`Text ${textIndex + 1} / ${
              Recording_Text.length + 1
            }`}</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              readOnly
              value={Recording_Text[textIndex]}
            />
          </Form.Group>
          <RecordButton
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />
          {!isRecording && currentPlayer !== null && (
            <PlayButton
              play={handlePlay}
              pause={handlePause}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          )}{" "}
          {isRecording && <>{formatTime(recordingSeconds)} </>}
          {!isRecording && currentPlayer !== null && (
            <>{formatTime(recordingSeconds)} </>
          )}
          {textIndex > 0 && (
            <Button variant="primary" type="button" onClick={handlePrev}>
              Prev
            </Button>
          )}{" "}
          {textIndex < Recording_Text.length - 1 && (
            <Button variant="primary" type="button" onClick={handleNext}>
              Next
            </Button>
          )}
          <hr />
          <Form.Group className="mb-3">
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
