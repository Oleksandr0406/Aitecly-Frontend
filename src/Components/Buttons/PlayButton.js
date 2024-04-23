import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useCallback, useState } from "react";

export const PlayButton = ({ isPlaying, setIsPlaying, play = () => {}, pause = () => {} }) => {
  const startPlaying = useCallback(() => {
    if (play() === true) setIsPlaying(true);
  }, [play, setIsPlaying]);
  const stopPlaying = useCallback(() => {
    if (pause() === true) setIsPlaying(false);
  }, [pause, setIsPlaying]);
  return !isPlaying ? (
    <IconButton
      color="primary"
      aria-label="start recording"
      onClick={startPlaying}
    >
      <PlayArrowIcon />
    </IconButton>
  ) : (
    <IconButton
      color="secondary"
      aria-label="stop recording"
      onClick={stopPlaying}
    >
      <PauseIcon />
    </IconButton>
  );
};
