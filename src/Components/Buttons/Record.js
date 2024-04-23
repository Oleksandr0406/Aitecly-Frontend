import { IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

export const RecordButton = ({
  isRecording,
  startRecording,
  stopRecording,
}) => {
  return !isRecording ? (
    <IconButton
      color="primary"
      aria-label="start recording"
      onClick={startRecording}
    >
      <MicIcon fontSize="large"/>
      {isRecording}
    </IconButton>
  ) : (
    <IconButton
      color="error"
      aria-label="stop recording"
      onClick={stopRecording}
    >
      <StopIcon fontSize="large"/>
    </IconButton>
  );
};
