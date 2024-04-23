import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import Navbar from "./Components/Navbar";
import { PrivateRoute } from "./Components/PrivateRoute";
import Dashboard from "./Pages/Dashboard";
import Chatbot from "./Pages/Chatbot";
import ChatLogList from "./Components/Lists/ChatLogList";
import Analytics from "./Pages/Analytics";
import Voices from "./Pages/VoiceManagement";
import Apis from "./Pages/Apis";
import ChatbotTabs from "./Pages/ChatbotTabs";
import { Grid } from "@mui/material";
import ChatbotInIframe from "./Pages/ChatbotInIframe";
import { TokenUsage } from "./Components/Tables/TokenUsage";
import { useCallback, useEffect, useState } from "react";
import { getLocation } from "./Utils/DetectUtil";

const defaultTheme = createTheme();

function App() {
  const isInframe = window.self !== window.top;
  const [open, setOpen] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState(250);
  const location = useLocation();
  const pathName = location.pathname;
  console.log({ pathName });

  const toggleDrawer = useCallback(() => {
    if (open) {
      setDrawerWidth(80);
    } else {
      setDrawerWidth(250);
    }
    setOpen(!open);
  }, [open]);
  // useEffect(() => {
  //   const fetch = async () => {
  //     const result = await getLocation();
  //     alert(result.country);
  //   };
  //   fetch();
  // });
  if (isInframe) {
    return (
      <>
        <Routes>
          <Route
            exact
            path="/chatbot/:chatbotId"
            element={<ChatbotInIframe />}
          />
        </Routes>
      </>
    );
  }
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          {!isInframe && <Navbar toggleDrawer={toggleDrawer} open={open} />}
          <Grid
            container
            spacing={2}
            sx={{
              ml: `${
                ["/sign-in", "/sign-up"].includes(pathName) ? 0 : drawerWidth
              }px`,
            }}
          >
            <Grid item xs={12}>
              <Container
                sx={{ mt: 4, mb: 4 }}
                style={{ maxWidth: "100%", padding: "0px" }}
              >
                <div className="App" id="App">
                  <div className="App-Content">
                    <Routes>
                      <Route
                        exact
                        path="/"
                        element={
                          <PrivateRoute>
                            <Dashboard />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        exact
                        path="/chatbot/:chatbotId/:tab"
                        element={
                          <PrivateRoute>
                            <ChatbotTabs />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        exact
                        path="/analytics"
                        element={
                          <PrivateRoute>
                            <Analytics />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        exact
                        path="/apis"
                        element={
                          <PrivateRoute>
                            <Apis />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        exact
                        path="/api-usage"
                        element={
                          <PrivateRoute>
                            <TokenUsage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        exact
                        path="/voices"
                        element={
                          <PrivateRoute>
                            <Voices />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        exact
                        path="/chat-log"
                        element={
                          <PrivateRoute>
                            <ChatLogList />
                          </PrivateRoute>
                        }
                      />
                      <Route path="/sign-in" element={<SignIn />} />
                      <Route path="/sign-up" element={<SignUp />} />
                    </Routes>
                  </div>
                </div>
              </Container>
              {/* </Box> */}
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
      {/* <div className="App">
        <Navbar />
        
      </div> */}
    </>
  );
}
export default App;
