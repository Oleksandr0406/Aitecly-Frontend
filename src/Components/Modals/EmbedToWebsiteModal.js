import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { useMemo, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

// const scriptValue =

export const EmbedToWebsiteModal = ({ id, open, handleClose }) => {
  const [position, setPosition] = useState("right");
  //   const navigator = useNavigate();
  const scriptValue = useMemo(
    () => `
    <script
        src="${window.location.origin}/scripts/chatbot_wrapper.js"
        data-name="aitechly"
        data-address="${window.location.origin}"
        data-id="${id}"
        data-position="${position}"
        data-server-address="${process.env.REACT_APP_API_HOST}"
        data-widget-size="normal"
        data-widget-button-size="normal"
        defer
    ></script>
    `,
    [id, position]
  );
  const copyToClipboard = async (text) => {
    try {
      window.navigator.clipboard.writeText(scriptValue);
      alert("Text copied to clipboard");
    } catch (err) {
      console.log("Failed to copy text: ", err);
    }
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <Box p={1}>
        <DialogContent>
          <Typography gutterBottom>
            Copy and paste this code <b>at the end of the &lt;body&gt; tag</b>{" "}
            of a page on your website
          </Typography>

          <Box bgcolor="#f0f2f0" pb={2} borderRadius="5px">
            <Typography variant="body1" m={0} style={{ whiteSpace: "pre" }}>
              {scriptValue}
            </Typography>
          </Box>

          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Position
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(ev) => setPosition(ev.target.value)}
            >
              <FormControlLabel
                value="left"
                control={<Radio />}
                label="Left"
                checked={position === "left"}
              />
              <FormControlLabel
                value="right"
                control={<Radio />}
                label="Right"
                checked={position === "right"}
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <Box p={2} display="flex" justifyContent="end" gap={2}>
          <Button sx={{ padding: "10px 20px" }} onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="contained"
            autoFocus
            onClick={copyToClipboard}
            startIcon={<ContentPasteIcon />}
            sx={{ padding: "10px 20px" }}
          >
            Copy to clipboard
          </Button>
        </Box>
      </Box>
    </BootstrapDialog>
  );
};
