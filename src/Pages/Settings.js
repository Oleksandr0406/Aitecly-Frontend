import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  LinearProgress,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  TextField,
  Tooltip,
  Typography,
  linkClasses,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import InfoIcon from "@mui/icons-material/Info";
import {
  SendRequestWithToken,
  SendRequestWithToken_test,
  SendUploadRequestWithToken_test,
  getProviders,
} from "../Utils/FetchUtil";
import { styled } from "styled-components";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addNewFile, addNewUrl, updateChatbot } from "../Slice/chatbotSlice";
import { MatchingUrls } from "../Components/MatchingUrls";

const ColorPicker = (props) => {
  return (
    <Container>
      <input type="color" {...props} />
      <Typography>{props.value}</Typography>
    </Container>
  );
};

function ValueLabelComponent(props) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.number.isRequired,
};

export const Settings = () => {
  const [sourceType, setSourceType] = useState("URL");
  const [links, setLinks] = useState("");
  const [allLinks, setAllLinks] = useState([]);
  const [files, setFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [content, setContent] = useState("");
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [avatarName, setAvatarName] = useState("");
  const { chatbotId } = useParams();
  const dispatch = useDispatch();
  const [isTraning, setIsTraining] = useState(false);
  const [status, setStatus] = useState(0);
  const [providers, setProviders] = useState([]);

  const [data, setData] = useState({
    id: chatbotId,
    name: "",
    chatType: "",
    customPrompt: "",
    defaultGreetingMessage: "",
    defaultOptions: [],
    modelName: "",
    avatarName: "",
    showSource: true,
    language: "",
    responseLength: "",
    color: "#54b4d3",
    avatarImageId: "",
    creativity: 0.7,
  });

  const [defaultText, setDefaultText] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(1);

  const [urls, setUrls] = useState({
    containing: "",
    notContaining: "",
    exact: "",
  });

  const [urlsData, setUrlsData] = useState({
    containing: [],
    notContaining: [],
    exact: [],
  });

  useEffect(() => {
    getData();
    fetchProviders();
  }, []);

  const addUrls = (e) => {
    const name = e.target.name;
    const value = urls[name];

    if (!value) return;
    setUrlsData({
      ...urlsData,
      [name]: [...urlsData[name], value],
    });
    setUrls({
      ...urls,
      [name]: "",
    });
  };

  const handleUrlChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUrls({
      ...urls,
      [name]: value,
    });
  };

  const handleAddDefaultOptions = () => {
    setData({
      ...data,
      defaultOptions: [...data.defaultOptions, defaultText],
    });
    setDefaultText("");
  };

  const handleRemoveDefaultOptions = (index) => {
    setData({
      ...data,
      defaultOptions: data.defaultOptions.filter((item, i) => index !== i),
    });
  };

  const removeUrl = (prop, index) => {
    setUrlsData({
      ...urlsData,
      [prop]: urlsData[prop].filter((_, i) => i !== index),
    });
  };

  const getData = async () => {
    if (chatbotId) {
      SendRequestWithToken_test(
        "chatbot/find-chatbot-by-id",
        {
          body: JSON.stringify({
            id: chatbotId,
          }),
        },
        (result) => {
          setData({
            ...data,
            ...result,
          });
          // console.log({ result });
          setUrlsData({
            containing: result.matchUrl.contains,
            notContaining: result.matchUrl.not_contains,
            exact: result.matchUrl.exact,
          });
          setAllLinks(result.pages);
          setAllFiles(result.files);
        }
      );
    }
  };

  const fetchProviders = async () => {
    const res = await getProviders();
    setProviders(res);
  };

  const handleDataChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "creativity") {
      setData({
        ...data,
        [name]: value / 100,
      });
    } else if (name === "creativityInput") {
      value = value < 0 ? 0 : value;
      value = value > 1 ? 1 : value;
      setData({
        ...data,
        creativity: value,
      });
    } else if (name === "showSource") {
      setData({
        ...data,
        showSource: !data.showSource,
      });
    } else if (name === "chatType") {
      if (value !== "Custom Prompt") {
        setData({
          ...data,
          customPrompt: "",
          [name]: value,
        });
      } else {
        setData({
          ...data,
          [name]: value,
        });
      }
    } else if (name === "summaryType") {
      setData({
        ...data,
        [name]: parseInt(value),
      });
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const handleChangeSourceType = (e) => {
    setSourceType(e.target.value);
  };

  const handleChangeLinks = (e) => {
    setLinks(e.target.value);
  };

  const addLinks = () => {
    if (links.length === 0) {
      return;
    }
    const urls = links.match(/(https?:\/\/[^\s,]+)/g);
    setIsTraining(true);
    SendRequestWithToken("chatbot/add-page", {
      body: JSON.stringify({
        id: chatbotId,
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
        setAllLinks([...allLinks, ...urls]);
        dispatch(
          addNewUrl({
            id: chatbotId,
            links: urls,
          })
        );
        setStatus(100);
        setTimeout(() => {
          setIsTraining(false);
        }, 3000);
      });
  };

  const handleChangeFile = (e) => {
    setFiles([...e.target.files]);
  };

  const addFiles = () => {
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("botId", chatbotId);
    setIsTraining(true);
    SendUploadRequestWithToken_test(
      "chatbot/add-training-file",
      {
        body: formData,
      },
      (result) => {
        setAllFiles([...allFiles, ...files.map((file) => file.name)]);
        dispatch(
          addNewFile({
            id: chatbotId,
            files,
          })
        );
        setIsTraining(false);
      },
      () => {
        alert("Failed for reason");
        setIsTraining(false);
      }
    );
  };

  const fetchContent = useCallback((url, ind) => {
    setSelectedUrl(url + ind);
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

  const handleChangeColor = (e) => {
    setData({
      ...data,
      color: e.target.value,
    });
  };

  const submit = async () => {
    uploadSettings(data);
  };

  const uploadAvatar = (avatarFile) => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    SendUploadRequestWithToken_test(
      "chatbot/upload-avatar",
      {
        body: formData,
      },
      (result) => {
        setData({
          ...data,
          avatarImageId: result,
        });
        // uploadSettings(data);
      }
    );
  };

  const uploadSettings = (settingsData) => {
    SendRequestWithToken_test(
      "chatbot/update-setting",
      {
        body: JSON.stringify({
          ...settingsData,
          matchUrl: {
            contains: urlsData.containing,
            not_contains: urlsData.notContaining,
            exact: urlsData.exact,
          },
        }),
      },
      (result) => {
        if (result) {
          alert("Settings updated successfully");
          dispatch(
            updateChatbot({
              id: chatbotId,
              data: {
                ...settingsData,
              },
            })
          );
        } else {
          alert("Something went wrong!");
        }
      }
    );
  };

  return (
    <Box margin={6} display="flex" flexDirection="column" gap={4}>
      <Box
        display="flex"
        gap={6}
        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
        px={4}
        py={3}
        borderRadius="10px"
      >
        <Box display="flex" flexDirection="column" sx={{ cursor: "pointer" }}>
          <label htmlFor="avatar">
            <Avatar
              alt="Avatar"
              src={`${process.env.REACT_APP_API_HOST}static/${data.avatarImageId}`}
              sx={{ width: 80, height: 80, cursor: "pointer" }}
            />
          </label>
          <label htmlFor="avatar" style={{ cursor: "pointer" }}>
            <Typography mt={1} color="rgba(0, 0, 0, 0.6)">
              Edit Avatar
            </Typography>
          </label>
          <TextField
            type="file"
            id="avatar"
            sx={{ display: "none" }}
            onChange={(e) => {
              setAvatar(e.target.files[0]);
              uploadAvatar(e.target.files[0]);
            }}
          />

          {avatar && (
            <Typography color="rgba(0, 0, 0, 0.4)">
              {avatar.name.slice(0, 10)}
            </Typography>
          )}
        </Box>
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          gap={1}
          justifyContent="center"
        >
          <Box display="flex" gap={1}>
            <Typography>Name of Chatbot</Typography>
            <Typography color="red">*</Typography>
          </Box>
          <Box>
            <TextField
              placeholder="Test1"
              variant="outlined"
              size="small"
              sx={{ width: "100%" }}
              value={data.name}
              name="name"
              onChange={handleDataChange}
            />
          </Box>
          <Box display="flex" gap={1}>
            <Typography>Avatar Name</Typography>
            <Typography color="red">*</Typography>
          </Box>
          <Box>
            <TextField
              placeholder="Avatar Name"
              variant="outlined"
              size="small"
              sx={{ width: "100%" }}
              value={data.avatarName}
              name="avatarName"
              onChange={handleDataChange}
            />
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box>
              <Typography align="left">Chatbot colour: </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <ColorPicker onChange={handleChangeColor} value={data.color} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        display="flex"
        gap={2}
        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
        padding={5}
        borderRadius="10px"
        flexDirection="column"
      >
        <Typography align="left">Data source type</Typography>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={handleChangeSourceType}
          >
            <FormControlLabel
              value="URL"
              checked={sourceType === "URL"}
              control={<Radio />}
              label="URL"
            />
            <FormControlLabel
              value="File"
              checked={sourceType === "File"}
              control={<Radio />}
              label="File"
            />
            <FormControlLabel
              value="CustomAPI"
              checked={sourceType === "CustomAPI"}
              control={<Radio />}
              label="Custom API - URLs & Providers"
            />
          </RadioGroup>
        </FormControl>

        {sourceType === "URL" && (
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography align="left">Links</Typography>

            <Box display="flex" width="100%" gap={3}>
              <textarea
                style={{ width: "85%" }}
                rows={2}
                value={links}
                minLength={2}
                onChange={handleChangeLinks}
              />
              <Box>
                <Button
                  variant="contained"
                  onClick={addLinks}
                  size="small"
                  disabled={isTraning}
                >
                  Add
                </Button>
              </Box>
            </Box>

            {isTraning && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress variant="determinate" value={status} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >{`${status}%`}</Typography>
                </Box>
              </Box>
            )}

            {/* <Box display="flex" width="100%" gap={3}>
              <Box sx={{ display: "flex", alignItems: "center" }} width="100%">
                <Box sx={{ width: "80%", mr: 1 }}>
                  <LinearProgress variant="determinate" />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >{`20%`}</Typography>
                </Box>
              </Box>
            </Box> */}

            <Box display="grid" gap={3} gridTemplateColumns="1fr 1fr" mt={6}>
              <Box
                display="flex"
                gap={1}
                flexDirection="column"
                border="1px solid rgbA(0, 0, 0, 0.3)"
                borderRadius="10px"
                p={2}
              >
                {allLinks.map((link, i) => {
                  return (
                    <Box key={link + i}>
                      <Typography
                        align="left"
                        sx={{
                          cursor: "pointer",
                          ...(selectedUrl === link + i && { color: "blue" }),
                        }}
                        onClick={() => fetchContent(link, i)}
                      >
                        {link}
                      </Typography>
                      <Divider />
                    </Box>
                  );
                })}
              </Box>
              <Box width="100%">
                <textarea
                  style={{
                    width: "90%",
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                  rows={10}
                  value={content}
                />
              </Box>
            </Box>
          </Box>
        )}

        {sourceType === "File" && (
          <Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography align="left">Files</Typography>
              <Box display="flex" alignItems="center" gap={4}>
                <Box display="flex">
                  <TextField
                    type="file"
                    onChange={handleChangeFile}
                    inputProps={{ multiple: true }}
                  />
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    onClick={addFiles}
                    size="small"
                    disabled={isTraning}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </Box>
            {allFiles[0] && (
              <Box
                mt={2}
                display="flex"
                flexDirection="column"
                gap={2}
                p={3}
                border="1px solid rgbA(0, 0, 0, 0.3)"
                borderRadius="10px"
              >
                {allFiles?.map((file, i) => {
                  return (
                    <Box key={file + i}>
                      <Typography align="left" sx={{ cursor: "pointer" }}>
                        {file}
                      </Typography>
                      <Divider />
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {sourceType === "CustomAPI" && (
          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="grid" gap={3} gridTemplateColumns="1fr 1fr" mt={6}>
              <Box
                display="flex"
                gap={1}
                flexDirection="column"
                border="1px solid rgbA(0, 0, 0, 0.3)"
                borderRadius="10px"
                p={2}
                maxHeight="300px"
                sx={{
                  overflowY: "scroll",
                }}
              >
                {providers.map((item, i) => {
                  return (
                    i !== 0 &&
                    item.slug && (
                      <Box
                        key={item.id}
                        sx={{
                          cursor: "pointer",
                        }}
                      >
                        <Typography
                          align="left"
                          sx={{
                            cursor: "pointer",
                            ...(selectedProvider === i && { color: "blue" }),
                          }}
                          onClick={() => setSelectedProvider(i)}
                        >
                          https://hostingadvice.com/{item.slug}
                        </Typography>
                        <Divider />
                      </Box>
                    )
                  );
                })}
              </Box>

              <Box
                display="flex"
                gap={1}
                flexDirection="column"
                border="1px solid rgbA(0, 0, 0, 0.3)"
                borderRadius="10px"
                p={2}
                height="300px"
                sx={{
                  overflowY: "scroll",
                }}
              >
                {providers[selectedProvider]?.rating.map((item, i) => {
                  return (
                    <Box
                      key={item.id}
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      <Typography align="left" onClick={() => {}}>
                        {`${i + 1}. ${item.title}`}
                      </Typography>
                      <Divider />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <Box
        display="flex"
        gap={2}
        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
        padding={4}
        borderRadius="10px"
        flexDirection="column"
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography align="left">Provider Summary Type</Typography>

          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="summaryType"
              onChange={handleDataChange}
            >
              <FormControlLabel
                value="1"
                checked={data.summaryType === 1}
                control={<Radio />}
                label="Bullet Points"
              />
              <FormControlLabel
                value="2"
                checked={data.summaryType === 2}
                control={<Radio />}
                label="In sentence"
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography align="left">Greeting Message</Typography>
          <TextField
            placeholder="Enter a default greeting message for your bot"
            variant="outlined"
            size="small"
            sx={{ width: "100%" }}
            name="defaultGreetingMessage"
            value={data.defaultGreetingMessage}
            onChange={handleDataChange}
          />
        </Box>
        <Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography align="left">Add Options</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                placeholder="Add option"
                variant="outlined"
                size="small"
                sx={{ width: "100%" }}
                name="defaultText"
                value={defaultText}
                onChange={(e) => {
                  setDefaultText(e.target.value);
                }}
              />
              <Button
                variant="contained"
                sx={{
                  minWidth: "100px",
                }}
                onClick={handleAddDefaultOptions}
              >
                Add
              </Button>
            </Box>
          </Box>
          <Box display="flex" p={2} gap={2}>
            {data.defaultOptions.map((item, i) => {
              return (
                <Chip
                  label={item}
                  onDelete={() => {
                    handleRemoveDefaultOptions(i);
                  }}
                />
              );
            })}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography>Spontaneously greet users?</Typography>
          <InfoIcon sx={{ color: "gray" }} />
          <Checkbox defaultChecked />
        </Box>
      </Box>

      <Box
        display="flex"
        gap={4}
        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
        padding={4}
        borderRadius="10px"
        flexDirection="column"
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography align="left">OpenAI Model</Typography>

          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={data.modelName ? data.modelName : "none"}
              onChange={handleDataChange}
              name="modelName"
              sx={{ textAlign: "left" }}
            >
              <MenuItem value="none">
                <em>Choose..</em>
              </MenuItem>
              <MenuItem value="gpt-3.5-turbo">gpt-3.5-turbo</MenuItem>
              <MenuItem value="gpt-4">gpt-4</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex">
            <Typography>Role of chatbot</Typography>
          </Box>

          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={data.chatType ? data.chatType : "none"}
              onChange={handleDataChange}
              sx={{ textAlign: "left" }}
              name="chatType"
            >
              <MenuItem value="none">
                <em>Choose..</em>
              </MenuItem>
              <MenuItem value="Custom Prompt">Custom Prompt</MenuItem>
              <MenuItem value="Sales Person">Sales Person</MenuItem>
            </Select>
          </FormControl>

          {data.chatType === "Custom Prompt" && (
            <Box mt={2}>
              <textarea
                style={{ width: "100%", borderRadius: "10px", padding: "10px" }}
                rows={3}
                onChange={handleDataChange}
                name="customPrompt"
                placeholder="Enter your custom prompt here..."
                value={data.customPrompt}
              />
            </Box>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography>Cite sources when answering?</Typography>
          <InfoIcon sx={{ color: "gray" }} />
          <Checkbox
            name="showSource"
            checked={data.showSource}
            onChange={handleDataChange}
          />
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          <Typography align="left">Language</Typography>

          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={data.language ? data.language : "none"}
              onChange={handleDataChange}
              sx={{ textAlign: "left" }}
              name="language"
            >
              <MenuItem value="none">
                <em>Choose..</em>
              </MenuItem>
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="French">French</MenuItem>
              <MenuItem value="Spanish">Spanish</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          <Typography align="left">Chatbot response length</Typography>

          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="responseLength"
              onChange={handleDataChange}
            >
              <FormControlLabel
                value="Concise"
                checked={data.responseLength === "Concise"}
                control={<Radio />}
                label="Concise"
              />
              <FormControlLabel
                value="Normal"
                checked={data.responseLength === "Normal"}
                control={<Radio />}
                label="Normal"
              />
              <FormControlLabel
                value="Detailed"
                checked={data.responseLength === "Detailed"}
                control={<Radio />}
                label="Detailed"
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          <Typography align="left">Chatbot creativity</Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Box width="200px">
              <Slider
                slots={{
                  valueLabel: ValueLabelComponent,
                }}
                defaultValue={50}
                sx={{ width: "100%" }}
                onChange={handleDataChange}
                value={data.creativity * 100}
                name="creativity"
              />
            </Box>
            <Box width="150px">
              <TextField
                type="number"
                name="creativityInput"
                value={data.creativity}
                size="small"
                onChange={handleDataChange}
              />
            </Box>
          </Box>

          <Box my={3}>
            <Typography align="left">Matching URL</Typography>

            <MatchingUrls
              value={urls.containing}
              handleUrlChange={handleUrlChange}
              addUrls={addUrls}
              data={urlsData.containing}
              removeUrl={removeUrl}
              name="containing"
            />

            <MatchingUrls
              value={urls.notContaining}
              handleUrlChange={handleUrlChange}
              addUrls={addUrls}
              data={urlsData.notContaining}
              removeUrl={removeUrl}
              name="notContaining"
            />

            <MatchingUrls
              value={urls.exact}
              handleUrlChange={handleUrlChange}
              addUrls={addUrls}
              data={urlsData.exact}
              removeUrl={removeUrl}
              name="exact"
            />
          </Box>
        </Box>
      </Box>

      <Box display="flex" mb={4} justifyContent="end" gap={4}>
        <Box>
          <Button
            size="large"
            sx={{ color: "black", borderRadius: "7px", fontWeight: 600 }}
          >
            Close
          </Button>
        </Box>
        <Box>
          <Button
            variant="contained"
            sx={{ borderRadius: "7px", fontWeight: 600 }}
            size="large"
            onClick={submit}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const Container = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 150px;
  max-width: 150px;
  border: 1px solid #bfc9d9;
  border-radius: 4px;

  input[type="color"] {
    margin-right: 8px;
    -webkit-appearance: none;
    border: none;
    width: auto;
    height: auto;
    cursor: pointer;
    background: none;
    &::-webkit-color-swatch-wrapper {
      padding: 0;
      width: 25px;
      height: 25px;
    }
    &::-webkit-color-swatch {
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 0;
    }
  }
`;
