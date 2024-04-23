import React, { useCallback, useState, useEffect } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import {
  SendRequestWithToken,
  SendRequestWithToken_test,
} from "../../Utils/FetchUtil";
export const EditPagesModal = ({ show, setShow, id, AddPage = () => {} }) => {
  const [pages, setPages] = useState([]);
  const [linkVal, setLinkVal] = useState("");
  const [content, setContent] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [status, setStatus] = useState(0);
  const handleClose = useCallback(() => {
    setShow(false);
  }, [setShow]);
  const handleSubmit = useCallback(() => {
    setShow(false);
  }, [setShow]);
  const handleAdd = useCallback(() => {
    setIsDisabled(true);
    setStatus(0);
    const urls = linkVal.match(/(https?:\/\/[^\s,]+)/g);
    SendRequestWithToken("chatbot/add-page", {
      body: JSON.stringify({
        id,
        url: urls,
      }),
    })
      .then((response) => {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                try {
                  let index = parseInt(new TextDecoder("utf-8").decode(value));
                  setStatus(Math.floor((90.0 * (index + 1)) / urls.length));
                  console.log(index);
                  controller.enqueue(value);
                } catch {}
                push();
              });
            }
            push();
          },
        });
      })
      .then((stream) => new Response(stream))
      .then((response) => response.text())
      .then((text) => {
        setPages([...pages, ...urls]);
        AddPage(urls);
        setLinkVal("");
        setIsDisabled(false);
        setStatus(100);
      });
  }, [id, linkVal, pages, AddPage]);

  const fetchContent = useCallback((url) => {
    setContent("Loading...");
    SendRequestWithToken_test(
      "link/extract-content",
      {
        body: JSON.stringify({
          link: url,
        }),
      },
      (result) => setContent(result)
    );
  }, []);

  useEffect(() => {
    if (id !== "") {
      SendRequestWithToken_test(
        "chatbot/find-pages-by-id",
        {
          body: JSON.stringify({
            id,
          }),
        },
        (result) => {
          setPages(result);
          setLinkVal("");
          setContent("");
          setStatus(0);
        }
      );
    }
  }, [id]);

  useEffect(() => {
    if (!show) {
      setLinkVal("");
      setContent("");
      setStatus(0);
    }
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
          <Modal.Title>Links</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-10">
              <textarea
                rows={3}
                style={{ width: "100%" }}
                placeholder="Input links here..."
                value={linkVal}
                onChange={(ev) => setLinkVal(ev.target.value)}
              />
            </div>
            <div className="col-2 px-2">
              <button
                className="btn btn-primary"
                onClick={handleAdd}
                type="button"
                disabled={isDisabled}
              >
                Add
              </button>
            </div>
          </div>
          <div className="row mt-2">
            <div class="progress" style={{ height: "20px" }}>
              <div
                class="progress-bar"
                role="progressbar"
                style={{ width: `${status}%` }}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {status}%
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div
              className="col-6"
              style={{
                minHeight: "500px",
                maxHeight: "500px",
                overflow: "auto",
              }}
            >
              <table className="table table-hover">
                <tbody>
                  {pages.map((page) => (
                    <tr>
                      <td onClick={() => fetchContent(page)}>{page}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-6">
              <textarea
                readOnly
                value={content}
                style={{ height: "500px", width: "100%" }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
