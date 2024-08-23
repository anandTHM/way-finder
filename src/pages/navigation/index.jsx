import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Grid, Button, Typography } from "@mui/material";
import { loadSmplrJs } from "@smplrspace/smplr-loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import Shops from "./shop";
import "./navigation.css";
import { ContextProvider } from "../../GlobalContext";

const Navigation = () => {
  const spaceRef = React.useRef();
  const location = useLocation();
  const param = location.state?.selectedItem;

  const isPortrait = useMediaQuery("(orientation: portrait)");

  const { setSelectedUnit, selectedUnit, selectedPath, setSelectedPath } =
    useContext(ContextProvider);

  const id = localStorage.getItem("ScreenId");
  const [viewerReady, setViewerReady] = useState(false);
  const [floors, setFloors] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState([]);
  const currentPathIdRef = useRef(selectedPath);
  const [selectedDirection, setSelectedDirection] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [toastId, setToastId] = useState(null);
  const [unit, setUnit] = useState("");

  const [paramId, setParamId] = useState(param?.pathId);

  useEffect(() => {
    loadSmplrJs("esm")
      .then((smplr) => {
        spaceRef.current = new smplr.Space({
          spaceId: "cf250454-c195-4a33-bd54-d1bdabcbb680",
          clientToken: "pub_c24233b8ab93411ba3623ca53306d66e",
          containerId: "test",
        });
        fetchData(smplr);
      })
      .catch((error) => console.error(error));
  }, []);


  useEffect(() => {
    fetch('https://ipinfo.io/json?token=9a4910bcc76590') 
      .then(response => response.json())
      .then(data => {
        const loc = data.loc.split(',');
        const lat = loc[0];
        const lng = loc[1];
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        
        return fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}`);
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (!viewerReady) return;

    currentPathIdRef.current = selectedPath;

    screenStartPoint();

    let dataLayer = [];

    if (selectedPath && selectedPath.steps?.length > 0) {
      selectedPath.steps.forEach((step) => {
        currentScreen[0].assets.forEach((item) => {
          if (item.id === step.pathId) {
            dataLayer.push(item);
          }
        });
      });
      spaceRef.current?.showUpToLevel(dataLayer[0].levelIndex);
      setFloors(dataLayer[0].levelIndex);
      setSelectedDirection(dataLayer);
      multiFloorHandler(dataLayer);
      // if (dataLayer.length > 1) {
      //   multiFloorHandler(dataLayer);
      // } else {
      //   singleFloorHandler(dataLayer);
      // }
    }

    if (paramId) {
      const data = currentScreen[0]?.assets?.filter(
        (item) => item.id === paramId
      );
      singleFloorHandler(data);
    }
  }, [viewerReady, selectedPath, paramId]);

  useEffect(() => {
    mapData();
  }, [dataLoaded]);

  const fetchData = async (smplr) => {
    const currentUrl = window.location.href;
    const regex = /\/([a-fA-F0-9\-]{36})(?:\/|$)/;
    const match = currentUrl.match(regex);
    const id = match ? match[1] : null;

    localStorage.setItem("ScreenId", id);

    const smplrClient = new smplr.QueryClient({
      organizationId: "07c31ef2-446e-444a-bb52-b1cbe5f3f675",
      clientToken: "pub_c24233b8ab93411ba3623ca53306d66e",
    });

    try {
      const space = await smplrClient.getSpace(
        "cf250454-c195-4a33-bd54-d1bdabcbb680"
      );

      const presentScreen = space?.assetmap.filter((item) => item.id === id);
      setCurrentScreen(presentScreen);
      setDataLoaded(true);
    } catch (error) {
      console.error("Could not get space", error);
    }
  };

  const initialCameraPlacement = {
    beta: -0.6801144947386014,
    target: {
      x: 146.769202649818302,
      y: 220.769202649818302,
      z: -90.769202649818302,
    },
  };

  const mapData = async () => {
    if (dataLoaded && spaceRef.current) {
      await spaceRef.current.startViewer({
        preview: false,
        onModeChange: (mode) => console.log("Mode changed to", mode),

        onReady: async () => {
          setViewerReady(true);
          if (spaceRef.current) {
            await spaceRef.current.showUpToLevel(floors || 0);
          }
        },
        cameraPlacement: initialCameraPlacement,
        onError: (errorMessage) =>
          console.error("Could not start viewer", errorMessage),
        onVisibleLevelsChanged: (visibleLevels) => {
          console.log(visibleLevels);
        },
        onResize: (containerRect) => {
          console.log("Viewer resized. New dimensions:", containerRect);
        },
        disableCameraControls: false,
        disableCameraRotation: false,
        hideNavigationButtons: false,
        hideLevelPicker: true,
      });
    }
  };

  const screenStartPoint = () => {
    if (spaceRef.current) {
      spaceRef.current.addDataLayer({
        id: "start-end",
        type: "point",
        shape: "sphere",
        data: [
          {
            id: "start",
            position: {
              levelIndex: 0,
              x: 122.90824494737281,
              z: -145.52299212169243,
              elevation: 12,
            },
          },
        ],
        diameter: 3,
        color: "#973bed",
        anchor: "button",
      });
    }
  };

  const singleFloorHandler = (data) => {
    const n = data[0].coordinates.length;
    const startPosition = data[0].coordinates[0];
    const endPosition = data[0].coordinates[n - 1];

    spaceRef?.current.addDataLayer({
      id: "way",
      type: "dotted-polyline",
      data: [data[0]].map((d) => ({
        ...d,
        coordinates: d.coordinates.map((pt) => ({
          ...pt,
          elevation: 3,
        })),
      })),
      diameter: 1.28,
      gap: 0.6,
      animation: "railway",
      speed: 3,
      anchor: "bottom",
      color: "#973bed",
    });

    // start and end point
    spaceRef.current.addDataLayer({
      id: "start-end",
      type: "point",
      shape: "sphere",
      data: [
        {
          id: startPosition.id,
          position: {
            levelIndex: startPosition.levelIndex,
            x: startPosition.x,
            z: startPosition.z,
            elevation: 8,
          },
        },
      ],
      diameter: 3,
      color: "#973bed",
      anchor: "button",
    });

    spaceRef.current.addDataLayer({
      id: "end",
      type: "icon",
      data: [
        {
          id: endPosition.id,
          position: {
            levelIndex: endPosition.levelIndex,
            x: endPosition.x,
            z: endPosition.z,
            elevation: 6,
          },
        },
      ],
      icon: {
        url: "https://uploads-ssl.webflow.com/5eca8aa0518a6eb17eda7575/65a572aed02ee07c9a7dde5e_Pin1.png",
        width: 500,
        height: 500,
      },
      diameter: 3,
      color: "#973bed",
      anchor: "button",
      width: 10,
    });

    const id = toast.success(
      `${unit || selectedUnit?.block || param?.title} is on floor ${
        data[0].levelIndex + 1
      }. The shortest path has been identified.`,
      {
        position: "bottom-left",
        autoClose: false,
        className: "custom-toast",
      }
    );

    setToastId(id);
  };

  const multiFloorHandler = (data) => {
    let id;
    if (data.length > 1) {
      id = toast.success(
        `The unit ${unit} is located on floor ${
          data[data.length - 1].levelIndex + 1
        }. Switching floors with multiple paths.`,
        {
          position: "bottom-left",
          autoClose: false,
          className: "custom-toast",
        }
      );
    } else {
      id = toast.success(
        `The unit ${unit} is located on floor ${
          data[data.length - 1].levelIndex + 1
        }.The sort shortest path has been identified. `,
        {
          position: "bottom-left",
          autoClose: false,
          className: "custom-toast",
        }
      );
    }

    setToastId(id);
    spaceRef?.current.removeAllDataLayers();

    // Create multiple timeouts
    data.forEach((path, index) => {
      setTimeout(
        () => {
          if (currentPathIdRef.current === selectedPath) {
            // setShowButton(true);
            setShowButton(index === data.length - 1);

            spaceRef?.current.showUpToLevel(
              path.coordinates[path.coordinates.length - 1].levelIndex
            );
            setFloors(path.coordinates[path.coordinates.length - 1].levelIndex);

            spaceRef.current.addDataLayer({
              id: `way-${index}-new`,
              type: "dotted-polyline",
              data: [
                {
                  ...path,
                  coordinates: path.coordinates.map((pt) => ({
                    ...pt,
                    elevation: 3,
                  })),
                },
              ],
              diameter: 1.28,
              gap: 0.6,
              animation: "railway",
              speed: 3,
              anchor: "bottom",
              color: "#973bed",
            });

            const n = path.coordinates.length;
            const startPosition = path.coordinates[0];
            const endPosition = path.coordinates[n - 1];

            spaceRef.current.addDataLayer({
              id: `start-${index}-new`,
              type: "point",
              shape: "sphere",
              data: [
                {
                  id: startPosition.id,
                  position: {
                    levelIndex: startPosition.levelIndex,
                    x: startPosition.x,
                    z: startPosition.z,
                    elevation: 8,
                  },
                },
              ],
              diameter: 3,
              color: "#973bed",
              anchor: "button",
            });

            spaceRef.current.addDataLayer({
              id: `end-${index}-new`,
              type: "icon",
              data: [
                {
                  id: endPosition.id,
                  position: {
                    levelIndex: endPosition.levelIndex,
                    x: endPosition.x,
                    z: endPosition.z,
                    elevation: 6,
                  },
                },
              ],
              icon: {
                url: "https://uploads-ssl.webflow.com/5eca8aa0518a6eb17eda7575/65a572aed02ee07c9a7dde5e_Pin1.png",
                width: 500,
                height: 500,
              },
              diameter: 3,
              color: "#973bed",
              anchor: "button",
              width: 10,
            });
          }
        },
        index === 0 ? 0 : 4000 * index
      );
    });
  };
  const dataHandler = (data, item) => {
    setUnit(item.block);

    spaceRef?.current.removeAllDataLayers();
    if (toastId) {
      toast.dismiss(toastId);
    }

    if (!data || Object.keys(data).length === 0) {
      const id = toast.success("No Path Found , Contact to help desk ", {
        position: "bottom-left",
        autoClose: false,
        className: "custom-toast",
      });
      setToastId(id);
      setSelectedPath(null);
      setShowButton(false);
      setFloors(1);
      spaceRef?.current?.showUpToLevel(0);
      return;
    }
    if (toastId) {
      toast.dismiss(toastId);
    }

    setSelectedPath(data);
  };

  const handleResetSpace = () => {
    if (selectedDirection.length > 0) {
      // spaceRef?.current.showUpToLevel(selectedDirection[0].levelIndex);
      spaceRef?.current.showUpToLevel(0);
      spaceRef?.current.removeAllDataLayers();
    } else {
      spaceRef?.current.showUpToLevel(0);
    }
    if (paramId) {
      spaceRef?.current.removeAllDataLayers();
      setParamId("");
    }
    setFloors(0);
    setSelectedPath(null);
    setSelectedUnit(null);
    setShowButton(false);
    setSelectedDirection([]);
    if (toastId) {
      toast.dismiss(toastId);
    }
  };

  const handleGoBack = () => {
    setShowButton(false);
    const paths = [...selectedDirection].reverse();

    paths.forEach((path, index) => {
      const delay =
        index === paths.length - 1 ? 0 : 4000 * (paths.length - 1 - index);

      setTimeout(() => {
        if (currentPathIdRef.current === selectedPath) {
          const targetFloor =
            path.coordinates[path.coordinates.length - 1].levelIndex;
          spaceRef?.current.showUpToLevel(targetFloor);
          setFloors(targetFloor);

          spaceRef.current.addDataLayer({
            id: `way-${index}-new`,
            type: "dotted-polyline",
            data: [
              {
                ...path,
                coordinates: path.coordinates.map((pt) => ({
                  ...pt,
                  elevation: 3,
                })),
              },
            ],
            diameter: 1.28,
            gap: 0.6,
            animation: "railway",
            speed: 3,
            anchor: "bottom",
            color: "#973bed",
          });

          const n = path.coordinates.length;
          const startPosition = path.coordinates[0];
          const endPosition = path.coordinates[n - 1];

          spaceRef.current.addDataLayer({
            id: `start-${index}-new`,
            type: "point",
            shape: "sphere",
            data: [
              {
                id: startPosition.id,
                position: {
                  levelIndex: startPosition.levelIndex,
                  x: startPosition.x,
                  z: startPosition.z,
                  elevation: 8,
                },
              },
            ],
            diameter: 3,
            color: "#973bed",
            anchor: "button",
          });

          spaceRef.current.addDataLayer({
            id: `end-${index}-new`,
            type: "icon",
            data: [
              {
                id: endPosition.id,
                position: {
                  levelIndex: endPosition.levelIndex,
                  x: endPosition.x,
                  z: endPosition.z,
                  elevation: 6,
                },
              },
            ],
            icon: {
              url: "https://uploads-ssl.webflow.com/5eca8aa0518a6eb17eda7575/65a572aed02ee07c9a7dde5e_Pin1.png",
              width: 500,
              height: 500,
            },
            diameter: 3,
            color: "#973bed",
            anchor: "button",
            width: 10,
          });
        }
      }, delay);
    });
  };

  return (
    <Box>
      <ToastContainer containerId="containerB" />
      {!isPortrait ? (
        <Box>
          <Grid container>
            <Grid item xs={8}>
              <Box>
                <div className="smplr-wrapper" style={{ position: "relative" }}>
                  <div id="test" className="smplr-embed"></div>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 20,
                      right: 10,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        backgroundColor: "#7E1946",
                        color: "white",
                        p: 1,
                        fontSize: "14px",
                        textAlign: "center",
                        borderRadius: "4px",
                        alignSelf: "flex-start",
                        // width: "120px",
                        // height: "70px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Floor {floors + 1}
                    </Typography>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#FFFFFF",
                          color: "#000000",
                          p: 1,
                          fontSize: "14px",
                          textTransform: "capitalize",
                          "&:hover": {
                            backgroundColor: "#FFFFFF",
                            color: "#000000",
                          },
                          "&:focus": {
                            backgroundColor: "#FFFFFF",
                            color: "#000000",
                          },
                        }}
                        onClick={handleResetSpace}
                      >
                        Reset Space
                      </Button>
                      {selectedDirection.length > 1 && showButton && (
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#7E1946",
                            color: "white",
                            p: 1,
                            fontSize: "14px",
                            textTransform: "capitalize",
                            "&:hover": {
                              backgroundColor: "#7E1946",
                              color: "white",
                            },
                            "&:focus": {
                              backgroundColor: "#7E1946",
                              color: "white",
                            },
                          }}
                          onClick={handleGoBack}
                        >
                          Go Back
                        </Button>
                      )}
                    </Box>
                  </Box>
                </div>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}>
                <Shops
                  dataHandler={dataHandler}
                  handleResetSpace={handleResetSpace}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "auto",
            }}
          >
            <div className="smplr-wrapper">
              <div id="test" className="smplr-embed"></div>
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 20,
                  right: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    backgroundColor: "#7E1946",
                    color: "white",
                    p: 1,
                    fontSize: "14px",
                    textAlign: "center",
                    borderRadius: "4px",
                    alignSelf: "flex-start",
                    // width: "120px",
                    // height: "70px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Floor {floors + 1}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#FFFFFF",
                      color: "#000000",
                      p: 1,
                      fontSize: "14px",
                      textTransform: "capitalize",
                      "&:hover": {
                        backgroundColor: "#FFFFFF",
                        color: "#000000",
                      },
                      "&:focus": {
                        backgroundColor: "#FFFFFF",
                        color: "#000000",
                      },
                    }}
                    onClick={handleResetSpace}
                  >
                    Reset Space
                  </Button>
                  {selectedDirection.length > 1 && showButton && (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#7E1946",
                        color: "white",
                        p: 1,
                        fontSize: "14px",
                        textTransform: "capitalize",
                        "&:hover": {
                          backgroundColor: "#7E1946",
                          color: "white",
                        },
                        "&:focus": {
                          backgroundColor: "#7E1946",
                          color: "white",
                        },
                      }}
                      onClick={handleGoBack}
                    >
                      Go Back
                    </Button>
                  )}
                </Box>
              </Box>
            </div>
          </Box>

          <Box
            sx={{
              marginTop: "15px",
              maxHeight: "calc(50vh - 64px)",
              overflowY: "auto",
              width: "100%",
              
            }}
          >
            <Shops
              dataHandler={dataHandler}
              handleResetSpace={handleResetSpace}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Navigation;
