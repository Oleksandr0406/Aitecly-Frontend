import { useCallback, useEffect, useState } from "react";
import { Form, Modal, Button, FormControl } from "react-bootstrap";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
const ElevenApiDetailModal = ({ show, setShow, apiKey }) => {
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const handleClose = useCallback(() => {
    setShow(false);
  }, [setShow]);
  useEffect(() => {
    fetch("https://api.elevenlabs.io/v1/user/subscription", {
      method: "GET",
      headers: {
        accept: "application/json",
        "xi-api-key": apiKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSubscriptionInfo(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [apiKey]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      container={document.getElementById("App")}
      style={{ position: "absolute" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Files</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {subscriptionInfo && (
          <>
            <List component="nav">
              <ListItem>
                <ListItemText
                  primary={`Subscribed to: ${subscriptionInfo.tier}`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={`Characters used: ${subscriptionInfo.character_count.toLocaleString()} / ${subscriptionInfo.character_limit.toLocaleString()}`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={`Next character reset in: ${subscriptionInfo.character_count.toLocaleString()} / ${subscriptionInfo.character_limit.toLocaleString()}`}
                />
              </ListItem>
              <Divider />
            </List>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ElevenApiDetailModal;
