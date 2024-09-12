// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useContext,
//   useCallback,
//   useMemo,
// } from "react";
// import { Box, Grid, Button, Typography } from "@mui/material";
// import { loadSmplrJs } from "@smplrspace/smplr-loader";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useLocation } from "react-router-dom";
// import { useMediaQuery } from "@mui/material";
// import Shops from "./shop";
// import "./navigation.css";
// import { ContextProvider } from "../../GlobalContext";
// import icon from "../../assets/yourAreHere.svg";
// import { fetchData as fetchDataService } from "../../apiService";
// import { Icons } from "../../assets/svgIcons";
// import CustomLoader from "../../components/Loader";

// const categories = [
//   {
//     name: "Games",
//     color: "#f59f00",
//     icon: Icons.game,
//   },
//   {
//     name: "Food & Beverage ",
//     color: "#f03e3e",
//     icon: Icons.food,
//   },
//   {
//     name: "Food",
//     color: "#d6336c",
//     icon: Icons.food,
//   },
//   {
//     name: "Cafe",
//     color: "#ae3ec9",
//     icon: Icons.cafe,
//   },
//   {
//     name: "Technology",
//     color: "#7048e8",
//     icon: Icons.laptop,
//   },
//   {
//     name: "Clothes",
//     color: "#4263eb",
//     icon: Icons.mens,
//   },
//   {
//     name: "Kid's Wear",
//     color: "#37b24d",
//     icon: Icons.kid,
//   },
// ];

// const cardColors = [
//   "#f59f00",
//   "#f03e3e",
//   "#d6336c",
//   "#ae3ec9",
//   "#7048e8",
//   "#4263eb",
//   "#1098ad",
//   "#37b24d",
//   "#f76707",
//   "#20c997",
//   "#3bc9db",
//   "#4dabf7",
//   "#748ffc",
//   "#ff8787",
// ];

// const Navigation = () => {
//   const spaceRef = useRef();
//   const location = useLocation();
//   const param = location.state?.selectedItem;

//   const isPortrait = useMediaQuery("(orientation: portrait)");

//   const organizationId = localStorage.getItem("Organization");

//   const {
//     setSelectedUnit,
//     selectedUnit,
//     selectedPath,
//     setSelectedPath,
//     setUnits,
//   } = useContext(ContextProvider);

//   const id = localStorage.getItem("ScreenId");
//   const [viewerReady, setViewerReady] = useState(false);
//   const [floors, setFloors] = useState(0);
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const [currentScreen, setCurrentScreen] = useState([]);
//   const currentPathIdRef = useRef(selectedPath);
//   const [selectedDirection, setSelectedDirection] = useState([]);
//   const [showButton, setShowButton] = useState(false);
//   const [toastId, setToastId] = useState(null);
//   const [unit, setUnit] = useState("");
//   const [rooms, setRooms] = useState([]);
//   const [startPoint, setStartPoint] = useState([]);

//   const [paramId, setParamId] = useState(param?.pathId);

//   const displayNameField = selectedUnit?.customFields?.filter((field) =>
//     field.fieldLabel?.toLowerCase().includes("display name")
//   )[0];

//   useEffect(() => {
//     loadSmplrJs("esm")
//       .then((smplr) => {
//         spaceRef.current = new smplr.Space({
//           spaceId: "cf250454-c195-4a33-bd54-d1bdabcbb680",
//           clientToken: "pub_c24233b8ab93411ba3623ca53306d66e",
//           containerId: "test",
//           whiteLabel: false,
//         });
//         fetchData(smplr);
//       })
//       .catch((error) => console.error(error));
//   }, []);

//   useEffect(() => {
//     if (!viewerReady) return;

//     currentPathIdRef.current = selectedPath;

//     screenStartPoint();

//     let dataLayer = [];

//     if (spaceRef) {
//       spaceRef.current.addDataLayer({
//         id: "rooms",
//         type: "polygon",
//         data: rooms,
//         tooltip: (d) => `
//       <div style="
//           display: flex; 
//           align-items: center; 
//           justify-content: center; 
//           width: 20px; 
//           height: 20px; 
//           padding: 0; 
//           margin: 0; 
//           border-radius: 50%;
//           overflow: hidden;
//       ">
//           <img src="${
//             d.photos
//               ? d.photos
//               : "https://uploads-ssl.webflow.com/5eca8aa0518a6eb17eda7575/65a572aed02ee07c9a7dde5e_Pin1.png"
//           }"
//                alt="Icon" 
//                style="width: 100%; height: 100%;" />
//       </div>
//     `,
//         persistentTooltip: true,
//         tooltipContainerStyle: `
//           font-size: 10px;
//           line-height: 1;
//           padding: 2px;
//           max-width: 100px;
//           background-color: rgba(255, 255, 255, 0);
//           border-radius: 50%;
//           box-shadow: none;
//       `,
//         onClick: (d) => console.log("Room clicked:", d),
//         color: (d) => d.categoryDetails[0]?.color || "#748ffc",
//         alpha: 0.6,
//       });
//     }

//     if (selectedPath && selectedPath.steps?.length > 0) {
//       selectedPath.steps.forEach((step) => {
//         currentScreen[0].assets.forEach((item) => {
//           if (item.id === step.pathId) {
//             dataLayer.push(item);
//           }
//         });
//       });
//       spaceRef.current?.showUpToLevel(dataLayer[0].levelIndex);
//       setFloors(dataLayer[0].levelIndex);
//       setSelectedDirection(dataLayer);
//       multiFloorHandler(dataLayer);
//     }

//     if (paramId) {
//       const data = currentScreen[0]?.assets?.filter(
//         (item) => item.id === paramId
//       );
//       singleFloorHandler(data);
//     }

//     return () => {
//       if (spaceRef.current) {
//         // spaceRef.current.removeDataLayer('rooms');
//       }
//     };
//   }, [viewerReady, selectedPath, paramId,dataLoaded]);

//   const fetchData = useCallback(async (smplr) => {
//     const currentUrl = window.location.href;
//     const regex = /\/([a-fA-F0-9\-]{36})(?:\/|$)/;
//     const match = currentUrl.match(regex);
//     const id = match ? match[1] : null;

//     localStorage.setItem("ScreenId", id);

//     const smplrClient = new smplr.QueryClient({
//       organizationId: "07c31ef2-446e-444a-bb52-b1cbe5f3f675",
//       clientToken: "pub_c24233b8ab93411ba3623ca53306d66e",
//     });

//     spaceRef.current.startViewer({
//       preview: false,
//       onModeChange: (mode) => console.log("Mode changed to", mode),
//       onReady: async () => {
//         setViewerReady(true);
//         if (spaceRef.current) {
//           await spaceRef.current.showUpToLevel(floors || 0);
//         }
//       },
//       cameraPlacement: initialCameraPlacement,
//       // experimentalFacadeBasedPerformance:true,
//       onError: (errorMessage) =>
//         console.error("Could not start viewer", errorMessage),
//       onVisibleLevelsChanged: (visibleLevels) => {
//         console.log(visibleLevels);
//       },
//       onResize: (containerRect) => {
//         console.log("Viewer resized. New dimensions:", containerRect);
//       },
//       disableCameraControls: false,
//       disableCameraRotation: false,
//       hideNavigationButtons: false,
//       hideLevelPicker: true,
//     });

//     try {
//       const space = await smplrClient.getSpace(
//         "cf250454-c195-4a33-bd54-d1bdabcbb680"
//       );

//       const polygons = space?.assetmap.filter(
//         (item) => item.type === "polygon"
//       );

//       const allScreenPoints = space?.assetmap.filter(
//         (item) => item.type === "point"
//       );

//       // const dataLayer=polygons[0].assets.filter((item)=>item.levelIndex===floors);

//       const response = await fetchDataService(
//         "/getAllListingbyOrganizationId",
//         {
//           organizationId,
//           smplrSpaceId: id,
//         }
//       );

//       setUnits(response);
//       const mergedData = polygons[0]?.assets.map((item) => {
//         const listingId = item.extras?.listingId;
//         const matchedUnit = response.filter((unit) => unit._id === listingId);

//         const primaryTag = matchedUnit[0]?.tags?.[0] || null;

//         const matchedCategory = primaryTag
//           ? categories.find(
//               (category) =>
//                 category.name.toLowerCase() === primaryTag.toLowerCase()
//             )
//           : null;

//         return {
//           ...item,
//           tags: matchedUnit[0]?.tags || [],
//           photos: matchedUnit[0]?.photos?.aws_original_url,
//           categoryDetails: matchedCategory ? [matchedCategory] : [],
//         };
//       });

//       setRooms(mergedData);

//       const presentScreen = space?.assetmap.filter((item) => item.id === id);
//       const currentFloor = presentScreen[0]?.assets?.filter(
//         (item) => item.name === "Elevator"
//       );
//       const screenStartPoint = allScreenPoints[0].assets.filter(
//         (item) => item?.name === presentScreen[0]?.name
//       );

//       setStartPoint(screenStartPoint[0]);

//       setFloors(currentFloor[0]?.levelIndex);
//       setCurrentScreen(presentScreen);
//       setDataLoaded(true);
//     } catch (error) {
//       console.error("Could not get space", error);
//     }
//   }, []);

//   const initialCameraPlacement = {
//     beta: -0.6801144947386014,
//     target: {
//       x: 146.769202649818302,
//       y: 302.769202649818302,
//       z: -147.769202649818302,
//     },
//   };

//   const screenStartPoint = () => {
//     console.log("here",selectedPath);
//     if(selectedPath){
//       console.log("here11");
//       spaceRef?.current.removeAllDataLayers();
//     }
//     if (spaceRef.current) {
//       spaceRef.current.addDataLayer({
//         id: "screenn-start-point",
//         type: "point",
//         shape: "sphere",
//         data: [
//           {
//             id: "start",
//             position: {
//               levelIndex: 0,
//               x: 122.90824494737281,
//               z: -145.52299212169243,
//               elevation: 12,
//             },
//           },
//         ],
//         diameter: 3,
//         color: "#973bed",
//         anchor: "button",
//       });
//     }
//   };

//   const singleFloorHandler = (data) => {
//     const n = data[0].coordinates.length;
//     const startPosition = data[0].coordinates[0];
//     const endPosition = data[0].coordinates[n - 1];

//     spaceRef?.current.removeDataLayer("screenn-start-point");

//     spaceRef?.current.addDataLayer({
//       id: "way",
//       type: "dotted-polyline",
//       data: [data[0]]?.map((d) => ({
//         ...d,
//         coordinates: d.coordinates.map((pt) => ({
//           ...pt,
//           elevation: 3,
//         })),
//       })),
//       diameter: 1.28,
//       gap: 0.6,
//       animation: "railway",
//       speed: 3,
//       anchor: "bottom",
//       color: "#973bed",
//     });

//     // start and end point
//     spaceRef.current.addDataLayer({
//       id: "start-end",
//       type: "point",
//       shape: "sphere",
//       data: [
//         {
//           id: startPosition.id,
//           position: {
//             levelIndex: startPosition.levelIndex,
//             x: startPosition.x,
//             z: startPosition.z,
//             elevation: 8,
//           },
//         },
//       ],
//       diameter: 3,
//       color: "#973bed",
//       anchor: "button",
//     });

//     spaceRef.current.addDataLayer({
//       id: "end",
//       type: "icon",
//       data: [
//         {
//           id: endPosition.id,
//           position: {
//             levelIndex: endPosition.levelIndex,
//             x: endPosition.x,
//             z: endPosition.z,
//             elevation: 6,
//           },
//         },
//       ],
//       icon: {
//         url: "https://uploads-ssl.webflow.com/5eca8aa0518a6eb17eda7575/65a572aed02ee07c9a7dde5e_Pin1.png",
//         width: 500,
//         height: 500,
//       },
//       diameter: 3,
//       color: "#973bed",
//       anchor: "button",
//       width: 10,
//     });

//     const id = toast.success(
//       `${
//         unit ||
//         selectedUnit?.block ||
//         displayNameField?.feildValue ||
//         param?.title
//       } is on floor ${
//         data[0].levelIndex + 1
//       }. The shortest path has been identified.`,
//       {
//         position: "bottom-left",
//         autoClose: false,
//         className: "custom-toast",
//       }
//     );

//     setToastId(id);
//   };

//   const multiFloorHandler = (data) => {
//     spaceRef?.current.removeDataLayer("screenn-start-point");
//     // spaceRef?.current.removeDataLayer('rooms');

//     let id;
//     if (data.length > 1) {
//       id = toast.success(
//         `The unit ${
//           unit || selectedUnit?.block || displayNameField?.feildValue
//         } is located on floor ${
//           data[data.length - 1].levelIndex + 1
//         }. Switching floors with multiple paths.`,
//         {
//           position: "bottom-left",
//           autoClose: false,
//           className: "custom-toast",
//         }
//       );
//     } else {
//       id = toast.success(
//         `The unit ${
//           unit || selectedUnit?.block || displayNameField?.feildValue
//         } is located on floor ${
//           data[data.length - 1].levelIndex + 1
//         }.The sort shortest path has been identified. `,
//         {
//           position: "bottom-left",
//           autoClose: false,
//           className: "custom-toast",
//         }
//       );
//     }

//     setToastId(id);
//     // Create multiple timeouts
//     data?.forEach((path, index) => {
//       setTimeout(
//         () => {
//           if (currentPathIdRef.current === selectedPath) {
//             // setShowButton(true);
//             setShowButton(index === data.length - 1);

//             spaceRef?.current.showUpToLevel(
//               path.coordinates[path.coordinates.length - 1].levelIndex
//             );
//             setFloors(path.coordinates[path.coordinates.length - 1].levelIndex);

//             spaceRef.current.addDataLayer({
//               id: `way-${index}-new`,
//               type: "dotted-polyline",
//               data: [
//                 {
//                   ...path,
//                   coordinates: path.coordinates.map((pt) => ({
//                     ...pt,
//                     elevation: 3,
//                   })),
//                 },
//               ],
//               diameter: 1.28,
//               gap: 0.6,
//               animation: "railway",
//               speed: 3,
//               anchor: "bottom",
//               color: "#973bed",
//             });

//             const n = path.coordinates.length;
//             const startPosition = path.coordinates[0];
//             const endPosition = path.coordinates[n - 1];

//             spaceRef.current.addDataLayer({
//               id: `start-${index}-new`,
//               type: "point",
//               shape: "sphere",
//               data: [
//                 {
//                   id: startPosition.id,
//                   position: {
//                     levelIndex: startPosition.levelIndex,
//                     x: startPosition.x,
//                     z: startPosition.z,
//                     elevation: 8,
//                   },
//                 },
//               ],
//               diameter: 3,
//               color: "#973bed",
//               anchor: "button",
//             });

//             //     id: 'rooms',
//             //     type: 'polygon',
//             //     data: rooms,
//             //     tooltip: (d) => `
//             //         <div style="
//             //             display: flex;
//             //             align-items: center;
//             //             justify-content: center;
//             //             width: 20px;
//             //             height: 20px;
//             //             padding: 0;
//             //             margin: 0;
//             //             border-radius: 50%;
//             //             overflow: hidden;
//             //         ">
//             //             <img src="https://uploads-ssl.webflow.com/5eca8aa0518a6eb17eda7575/65a572aed02ee07c9a7dde5e_Pin1.png"
//             //                  alt="Icon"
//             //                  style="width: 100%; height: 100%;" />
//             //         </div>
//             //     `,
//             //     persistentTooltip: true,
//             //     tooltipContainerStyle: `
//             //         font-size: 10px;
//             //         line-height: 1;
//             //         padding: 2px;
//             //         max-width: 100px;
//             //         background-color: rgba(255, 255, 255, 0);
//             //         border-radius: 50%;
//             //         box-shadow: none;
//             //     `,
//             //     onClick: (d) => console.log('Room clicked:', d),
//             //     color: (d) => {
//             //         if (d.extras?.listingId) {
//             //             const index = hashCode(d.extras.listingId);
//             //             return cardColors[index];
//             //         }
//             //     },
//             //     alpha: 0.6
//             // });

//             spaceRef.current.addDataLayer({
//               id: `end-${index}-new`,
//               type: "icon",
//               data: [
//                 {
//                   id: endPosition.id,
//                   position: {
//                     levelIndex: endPosition.levelIndex,
//                     x: endPosition.x,
//                     z: endPosition.z,
//                     elevation: 6,
//                   },
//                 },
//               ],
//               icon: {
//                 url: "https://uploads-ssl.webflow.com/5eca8aa0518a6eb17eda7575/65a572aed02ee07c9a7dde5e_Pin1.png",
//                 width: 500,
//                 height: 500,
//               },
//               diameter: 3,
//               color: "#973bed",
//               anchor: "button",
//               width: 10,
//             });
//           }
//         },
//         index === 0 ? 0 : 4000 * index
//       );
//     });
//   };
//   const dataHandler = (data, item) => {
//     console.log("data", data, item);
//     setUnit(item.block);

//     spaceRef?.current.removeDataLayer("screenn-start-point");
//     // spaceRef?.current.removeDataLayer('rooms');
//     if (toastId) {
//       toast.dismiss(toastId);
//     }

//     if (!data || Object.keys(data).length === 0) {
//       const id = toast.success("No Path Found , Contact to help desk ", {
//         position: "bottom-left",
//         autoClose: false,
//         className: "custom-toast",
//       });
//       setToastId(id);
//       setSelectedPath(null);
//       setShowButton(false);
//       // setFloors(1);
//       spaceRef?.current?.showUpToLevel(0);
//       return;
//     }
//     if (toastId) {
//       toast.dismiss(toastId);
//     }

//     setSelectedPath(data);
//   };

//   const handleResetSpace = () => {
//     if (selectedPath) {
//       spaceRef?.current.showUpToLevel(0);
//       spaceRef?.current.removeAllDataLayers();
//     } else {
//       spaceRef?.current.showUpToLevel(0);
//     }
//     if (paramId) {
//       spaceRef?.current.removeAllDataLayers();
//       setParamId("");
//     }
//     setFloors(0);
//     setSelectedPath(null);
//     setSelectedUnit(null);
//     setShowButton(false);
//     setSelectedDirection([]);
//     if (toastId) {
//       toast.dismiss(toastId);
//     }
//   };

//   const handleGoBack = () => {
//     setShowButton(false);
//     const paths = [...selectedDirection].reverse();

//     paths.forEach((path, index) => {
//       const delay =
//         index === paths.length - 1 ? 0 : 4000 * (paths.length - 1 - index);

//       setTimeout(() => {
//         if (currentPathIdRef.current === selectedPath) {
//           const targetFloor =
//             path.coordinates[path.coordinates.length - 1].levelIndex;
//           spaceRef?.current.showUpToLevel(targetFloor);
//           setFloors(targetFloor);

//           spaceRef.current.addDataLayer({
//             id: `way-${index}-new`,
//             type: "dotted-polyline",
//             data: [
//               {
//                 ...path,
//                 coordinates: path.coordinates.map((pt) => ({
//                   ...pt,
//                   elevation: 3,
//                 })),
//               },
//             ],
//             diameter: 1.28,
//             gap: 0.6,
//             animation: "railway",
//             speed: 3,
//             anchor: "bottom",
//             color: "#973bed",
//           });

//           const n = path.coordinates.length;
//           const startPosition = path.coordinates[0];
//           const endPosition = path.coordinates[n - 1];

//           spaceRef.current.addDataLayer({
//             id: `start-${index}-new`,
//             type: "point",
//             shape: "sphere",
//             data: [
//               {
//                 id: startPosition.id,
//                 position: {
//                   levelIndex: startPosition.levelIndex,
//                   x: startPosition.x,
//                   z: startPosition.z,
//                   elevation: 8,
//                 },
//               },
//             ],
//             diameter: 3,
//             color: "#973bed",
//             anchor: "button",
//           });

//           spaceRef.current.addDataLayer({
//             id: `end-${index}-new`,
//             type: "icon",
//             data: [
//               {
//                 id: endPosition.id,
//                 position: {
//                   levelIndex: endPosition.levelIndex,
//                   x: endPosition.x,
//                   z: endPosition.z,
//                   elevation: 6,
//                 },
//               },
//             ],
//             icon: {
//               url: "https://uploads-ssl.webflow.com/5eca8aa0518a6eb17eda7575/65a572aed02ee07c9a7dde5e_Pin1.png",
//               width: 500,
//               height: 500,
//             },
//             diameter: 3,
//             color: "#973bed",
//             anchor: "button",
//             width: 10,
//           });
//         }
//       }, delay);
//     });
//   };

//   return (
//     <Box>
//       <ToastContainer containerId="containerB" />
//       {!isPortrait ? (
//         <Box>
//           <Grid container>
//             <Grid item xs={8}>
//               <Box>
//                 <div className="smplr-wrapper" style={{ position: "relative" }}>
//                   <div id="test" className="smplr-embed"></div>
//                   {/* {!viewerReady && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: "50%",
//                         left: "50%",
//                         transform: "translate(-50%, -50%)",
//                         zIndex: 1000,
//                       }}
//                     >
//                       <CustomLoader size={30} />
//                     </div>
//                   )} */}
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: 10,
//                       left: 20,
//                       right: 10,
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         backgroundColor: "#7E1946",
//                         color: "white",
//                         p: 1,
//                         fontSize: "14px",
//                         textAlign: "center",
//                         borderRadius: "4px",
//                         alignSelf: "flex-start",
//                         // width: "120px",
//                         // height: "70px",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                       }}
//                     >
//                       Floor {floors + 1}
//                     </Typography>

//                     <Box
//                       sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//                     >
//                       <Button
//                         variant="contained"
//                         sx={{
//                           backgroundColor: "#FFFFFF",
//                           color: "#000000",
//                           p: 1,
//                           fontSize: "14px",
//                           textTransform: "capitalize",
//                           "&:hover": {
//                             backgroundColor: "#FFFFFF",
//                             color: "#000000",
//                           },
//                           "&:focus": {
//                             backgroundColor: "#FFFFFF",
//                             color: "#000000",
//                           },
//                         }}
//                         onClick={handleResetSpace}
//                       >
//                         Reset Space
//                       </Button>
//                       {selectedDirection.length > 1 && showButton && (
//                         <Button
//                           variant="contained"
//                           sx={{
//                             backgroundColor: "#7E1946",
//                             color: "white",
//                             p: 1,
//                             fontSize: "14px",
//                             textTransform: "capitalize",
//                             "&:hover": {
//                               backgroundColor: "#7E1946",
//                               color: "white",
//                             },
//                             "&:focus": {
//                               backgroundColor: "#7E1946",
//                               color: "white",
//                             },
//                           }}
//                           onClick={handleGoBack}
//                         >
//                           Go Back
//                         </Button>
//                       )}
//                     </Box>
//                   </Box>
//                 </div>
//               </Box>
//             </Grid>
//             <Grid item xs={4}>
//               <Box sx={{ maxHeight: "calc(110vh - 64px)", overflowY: "auto" }}>
//                 <Shops
//                   dataHandler={dataHandler}
//                   handleResetSpace={handleResetSpace}
//                 />
//               </Box>
//             </Grid>
//           </Grid>
//         </Box>
//       ) : (
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <Box
//             sx={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               height: "auto",
//             }}
//           >
//             <div className="smplr-wrapper">
//               <div id="test" className="smplr-embed"></div>
//               {/* {!viewerReady && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: "50%",
//                     left: "50%",
//                     transform: "translate(-50%, -50%)",
//                     zIndex: 1000,
//                   }}
//                 >
//                   <CustomLoader size={30} />
//                 </div>
//               )} */}
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: 10,
//                   left: 20,
//                   right: 10,
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     backgroundColor: "#7E1946",
//                     color: "white",
//                     p: 1,
//                     fontSize: "14px",
//                     textAlign: "center",
//                     borderRadius: "4px",
//                     alignSelf: "flex-start",
//                     // width: "120px",
//                     // height: "70px",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   Floor {floors + 1}
//                 </Typography>

//                 <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                   <Button
//                     variant="contained"
//                     sx={{
//                       backgroundColor: "#FFFFFF",
//                       color: "#000000",
//                       p: 1,
//                       fontSize: "14px",
//                       textTransform: "capitalize",
//                       "&:hover": {
//                         backgroundColor: "#FFFFFF",
//                         color: "#000000",
//                       },
//                       "&:focus": {
//                         backgroundColor: "#FFFFFF",
//                         color: "#000000",
//                       },
//                     }}
//                     onClick={handleResetSpace}
//                   >
//                     Reset Space
//                   </Button>
//                   {selectedDirection.length > 1 && showButton && (
//                     <Button
//                       variant="contained"
//                       sx={{
//                         backgroundColor: "#7E1946",
//                         color: "white",
//                         p: 1,
//                         fontSize: "14px",
//                         textTransform: "capitalize",
//                         "&:hover": {
//                           backgroundColor: "#7E1946",
//                           color: "white",
//                         },
//                         "&:focus": {
//                           backgroundColor: "#7E1946",
//                           color: "white",
//                         },
//                       }}
//                       onClick={handleGoBack}
//                     >
//                       Go Back
//                     </Button>
//                   )}
//                 </Box>
//               </Box>
//             </div>
//           </Box>

//           <Box
//             sx={{
//               marginTop: "15px",
//               maxHeight: "calc(60vh - 64px)",
//               overflowY: "auto",
//               width: "100%",
//             }}
//           >
//             <Shops
//               dataHandler={dataHandler}
//               handleResetSpace={handleResetSpace}
//             />
//           </Box>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default Navigation;

import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Box, Grid, Button, Typography } from "@mui/material";
import { loadSmplrJs } from "@smplrspace/smplr-loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import Shops from "./shop";
import "./navigation.css";
import { ContextProvider } from "../../GlobalContext";
import { fetchData as fetchDataService } from "../../apiService";
import { Icons } from "../../assets/svgIcons";

const initialCameraPlacement = {
  beta: -0.6801144947386014,
  radius: -50,
  target: {
    x: 146.769202649818302,
    y: 330.769202649818302,
    z: -147.769202649818302,
  },
};

const categories = [
  {
    name: "Games",
    color: "#f59f00",
    icon: Icons.game,
  },
  {
    name: "Food & Beverage ",
    color: "#f03e3e",
    icon: Icons.food,
  },
  {
    name: "Food",
    color: "#d6336c",
    icon: Icons.food,
  },
  {
    name: "Cafe",
    color: "#ae3ec9",
    icon: Icons.cafe,
  },
  {
    name: "Technology",
    color: "#7048e8",
    icon: Icons.laptop,
  },
  {
    name: "Clothes",
    color: "#4263eb",
    icon: Icons.mens,
  },
  {
    name: "Kid's Wear",
    color: "#37b24d",
    icon: Icons.kid,
  },
];

const cardColors = [
  "#f59f00",
  "#f03e3e",
  "#d6336c",
  "#ae3ec9",
  "#7048e8",
  "#4263eb",
  "#1098ad",
  "#37b24d",
  "#f76707",
  "#20c997",
  "#3bc9db",
  "#4dabf7",
  "#748ffc",
  "#ff8787",
];

const Navigation = () => {
  const spaceRef = useRef();
  const location = useLocation();
  const param = location.state?.selectedItem;

  const isPortrait = useMediaQuery("(orientation: portrait)");

  const organizationId = localStorage.getItem("Organization");

  const {
    setSelectedUnit,
    selectedUnit,
    selectedPath,
    setSelectedPath,
    setUnits,
  } = useContext(ContextProvider);


  const id = localStorage.getItem("ScreenId");
  const [viewerReady, setViewerReady] = useState(false);
  const [floors, setFloors] = useState(0);
  const [currentScreen, setCurrentScreen] = useState([]);
  const currentPathIdRef = useRef(selectedPath);
  const [selectedDirection, setSelectedDirection] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [toastId, setToastId] = useState(null);
  const [unit, setUnit] = useState("");
  const [rooms, setRooms] = useState([]);
  const [startPoint, setStartPoint] = useState([]);

  const [paramId, setParamId] = useState(param?.pathId);

  const cameraPlacementRef = useRef(initialCameraPlacement || null);
  const resetTimeoutRef = useRef(null);


  const displayNameField = selectedUnit?.customFields?.filter((field) =>
    field.fieldLabel?.toLowerCase().includes("display name")
  )[0];

  useEffect(() => {
    loadSmplrJs("esm")
      .then((smplr) => {
        spaceRef.current = new smplr.Space({
          spaceId: "cf250454-c195-4a33-bd54-d1bdabcbb680",
          clientToken: "pub_c24233b8ab93411ba3623ca53306d66e",
          containerId: "test",
          whiteLabel: false,
        });
        fetchData(smplr);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!viewerReady) return;

    currentPathIdRef.current = selectedPath;

    screenStartPoint();

    let dataLayer = [];

    if (spaceRef) {
      spaceRef.current.addDataLayer({
        id: "rooms",
        type: "polygon",
        data: rooms,
        tooltip: (d) => `
      <div style="
          display: flex; 
          align-items: center; 
          justify-content: center; 
          width: 20px; 
          height: 20px; 
          padding: 0; 
          margin: 0; 
          border-radius: 50%;
          overflow: hidden;
      ">
          <img src="${
            d.photos
              ? d.photos
              : "https://uploads-ssl.webflow.com/5eca8aa0518a6eb17eda7575/65a572aed02ee07c9a7dde5e_Pin1.png"
          }"
               alt="Icon" 
               style="width: 100%; height: 100%;" />
      </div>
    `,
        persistentTooltip: true,
        tooltipContainerStyle: `
          font-size: 10px;
          line-height: 1;
          padding: 2px;
          max-width: 100px;
          background-color: rgba(255, 255, 255, 0);
          border-radius: 50%;
          box-shadow: none;
      `,
        onClick: (d) => console.log("Room clicked:", d),
        color: (d) => d.categoryDetails[0]?.color || "#748ffc",
        alpha: 1,
      });
    }

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
    }

    if (paramId) {
      const data = currentScreen[0]?.assets?.filter(
        (item) => item.id === paramId
      );
      singleFloorHandler(data);
    }

    return () => {
      if (spaceRef.current) {
        // spaceRef.current.removeDataLayer('rooms');
      }
    };
  }, [viewerReady, selectedPath, paramId]);

  const fetchData = useCallback(async (smplr) => {
    const currentUrl = window.location.href;
    const regex = /\/([a-fA-F0-9\-]{36})(?:\/|$)/;
    const match = currentUrl.match(regex);
    const id = match ? match[1] : null;

    localStorage.setItem("ScreenId", id);

    const smplrClient = new smplr.QueryClient({
      organizationId: "07c31ef2-446e-444a-bb52-b1cbe5f3f675",
      clientToken: "pub_c24233b8ab93411ba3623ca53306d66e",
    });

    spaceRef.current.startViewer({
      preview: false,
      mode: "3d",
      onReady: async () => {
        setViewerReady(true);
        if (spaceRef.current) {
          await spaceRef.current.showUpToLevel(floors || 0);
          await spaceRef.current.centerCamera()
          // await spaceRef.current.zoomIn()
          // await spaceRef.current.zoomIn()
          // await spaceRef.current.zoomIn()
          // await spaceRef.current.zoomIn()
        }
      },
      // onResize:()=>spaceRef?.current?.setCa,
      // cameraPlacement: initialCameraPlacement,
      disableCameraControls: false,
      disableCameraRotation: false,
      hideNavigationButtons: false,
      hideLevelPicker: true,
    });

    try {
      const space = await smplrClient.getSpace(
        "cf250454-c195-4a33-bd54-d1bdabcbb680"
      );

      const polygons = space?.assetmap.filter(
        (item) => item.type === "polygon"
      );

      const allScreenPoints = space?.assetmap.filter(
        (item) => item.type === "point"
      );

      // const dataLayer=polygons[0].assets.filter((item)=>item.levelIndex===floors);

      const response = await fetchDataService(
        "/getAllListingbyOrganizationId",
        {
          organizationId,
          smplrSpaceId: id,
        }
      );

      setUnits(response);
      const mergedData = polygons[0]?.assets.map((item) => {
        const listingId = item.extras?.listingId;
        const matchedUnit = response.filter((unit) => unit._id === listingId);

        const primaryTag = matchedUnit[0]?.tags?.[0] || null;

        const matchedCategory = primaryTag
          ? categories.find(
              (category) =>
                category.name.toLowerCase() === primaryTag.toLowerCase()
            )
          : null;

        return {
          ...item,
          tags: matchedUnit[0]?.tags || [],
          photos: matchedUnit[0]?.photos?.aws_original_url,
          categoryDetails: matchedCategory ? [matchedCategory] : [],
        };
      });

      setRooms(mergedData);

      const presentScreen = space?.assetmap.filter((item) => item.id === id);
      const currentFloor = presentScreen[0]?.assets?.filter(
        (item) => item.name === "Elevator"
      );
      const screenStartPoint = allScreenPoints[0].assets.filter(
        (item) => item?.name === presentScreen[0]?.name
      );

      setStartPoint(screenStartPoint[0]);

      setFloors(currentFloor[0]?.levelIndex);
      setCurrentScreen(presentScreen);
    } catch (error) {
      console.error("Could not get space", error);
    }
  }, []);

  // const fetchData = useCallback(async (smplr) => {
  //   const currentUrl = window.location.href;
  //   const regex = /\/([a-fA-F0-9\-]{36})(?:\/|$)/;
  //   const match = currentUrl.match(regex);
  //   const id = match ? match[1] : null;

  //   localStorage.setItem('ScreenId', id);

  //   const smplrClient = new smplr.QueryClient({
  //     organizationId: "07c31ef2-446e-444a-bb52-b1cbe5f3f675",
  //     clientToken: "pub_c24233b8ab93411ba3623ca53306d66e",
  //   });

  //   if (!spaceRef.current) {
  //     console.error('spaceRef is not initialized');
  //     return;
  //   }

  //   try {
  //     const space = await smplrClient.getSpace('cf250454-c195-4a33-bd54-d1bdabcbb680');
  //     if (!space || !space.assetmap) {
  //       console.error('Invalid space data');
  //       return;
  //     }

  //     spaceRef.current.startViewer({
  //       preview: false,
  //       onModeChange: (mode) => console.log("Mode changed to", mode),
  //       onReady: async () => {
  //         setViewerReady(true);
  //         if (spaceRef.current) {
  //           await spaceRef.current.showUpToLevel(floors || 0);
  //         }
  //       },
  //       cameraPlacement: initialCameraPlacement,
  //       // experimentalFacadeBasedPerformance:true,
  //       onError: (errorMessage) =>
  //         console.error("Could not start viewer", errorMessage),
  //       onVisibleLevelsChanged: (visibleLevels) => {
  //         console.log(visibleLevels);
  //       },
  //       onResize: (containerRect) => {
  //         console.log("Viewer resized. New dimensions:", containerRect);
  //       },
  //       disableCameraControls: false,
  //       disableCameraRotation: false,
  //       hideNavigationButtons: false,
  //       hideLevelPicker: true,
  //     });

  //     const polygons = space.assetmap.filter((item) => item.type === 'polygon');
  //     const allScreenPoints = space.assetmap.filter((item) => item.type === 'point');

  //     const response = await fetchDataService('/getAllListingbyOrganizationId', {
  //       organizationId,
  //       smplrSpaceId: id,
  //     });

  //     setUnits(response);

  //     const mergedData = polygons[0]?.assets.map((item) => {
  //       const listingId = item.extras?.listingId;
  //       const matchedUnit = response.filter((unit) => unit._id === listingId);

  //       const primaryTag = matchedUnit[0]?.tags?.[0] || null;

  //       const matchedCategory = primaryTag
  //         ? categories.find(
  //             (category) =>
  //               category.name.toLowerCase() === primaryTag.toLowerCase()
  //           )
  //         : null;

  //       return {
  //         ...item,
  //         tags: matchedUnit[0]?.tags || [],
  //         photos: matchedUnit[0]?.photos?.aws_original_url,
  //         categoryDetails: matchedCategory ? [matchedCategory] : [],
  //       };
  //     });

  //     setRooms(mergedData);

  //     const presentScreen = space.assetmap.filter((item) => item.id === id);
  //     const currentFloor = presentScreen[0]?.assets?.filter((item) => item.name === 'Elevator');
  //     const screenStartPoint = allScreenPoints[0]?.assets?.filter(
  //       (item) => item?.name === presentScreen[0]?.name
  //     );

  //     setStartPoint(screenStartPoint[0]);
  //     setFloors(currentFloor[0]?.levelIndex);
  //     setCurrentScreen(presentScreen);
  //   } catch (error) {
  //     console.error('Could not get space', error);
  //   }
  // }, []);

  // useEffect(() => {
  //   const handleInteraction = () => {
  //     removeCameraPlacement();
  //     resetCameraAfterDelay();
  //   };

  //   const removeCameraPlacement = () => {
  //     if (spaceRef.current) {
  //       console.log('Removing camera placement');
  //       spaceRef.current.setCameraPlacement({ animate: true, animationDuration: 0.6 });
  //     } else {
  //       console.error('spaceRef is not available to remove camera placement');
  //     }
  //   };

  //   const restoreCameraPlacement = () => {
  //     if (spaceRef.current && cameraPlacementRef.current) {
  //       console.log('Restoring camera placement', cameraPlacementRef.current);
  //       spaceRef.current.setCameraPlacement(cameraPlacementRef.current);
  //     } else {
  //       console.error('spaceRef or cameraPlacementRef is not available to restore camera placement');
  //     }
  //   };

  //   const resetCameraAfterDelay = () => {
  //     clearTimeout(resetTimeoutRef.current);
  //     resetTimeoutRef.current = setTimeout(restoreCameraPlacement, 5000);
  //   };

  //   // Add event listeners for click/touch events
  //   spaceRef?.current?.addEventListener('click', handleInteraction);
  //   spaceRef?.current?.addEventListener('touchstart', handleInteraction);

  //   // Cleanup event listeners on component unmount
  //   return () => {
  //     spaceRef?.current?.removeEventListener('click', handleInteraction);
  //     spaceRef?.current?.removeEventListener('touchstart', handleInteraction);
  //     clearTimeout(resetTimeoutRef.current);
  //   };
  // }, []);

  

  const screenStartPoint = () => {
    if (spaceRef.current) {
      // spaceRef?.current.removeAllDataLayers();
      spaceRef.current.addDataLayer({
        id: "screenn-start-point",
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

    spaceRef?.current.removeDataLayer("screenn-start-point");

    spaceRef?.current.addDataLayer({
      id: "way",
      type: "dotted-polyline",
      data: [data[0]]?.map((d) => ({
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
      `${
        unit ||
        selectedUnit?.block ||
        displayNameField?.feildValue ||
        param?.title
      } is on floor ${
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
    spaceRef?.current.removeDataLayer("screenn-start-point");
    // spaceRef?.current.removeDataLayer('rooms');

    let id;
    if (data.length > 1) {
      id = toast.success(
        `The unit ${
          unit || selectedUnit?.block || displayNameField?.feildValue
        } is located on floor ${
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
        `The unit ${
          unit || selectedUnit?.block || displayNameField?.feildValue
        } is located on floor ${
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
    // Create multiple timeouts
    data?.forEach((path, index) => {
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

            //     id: 'rooms',
            //     type: 'polygon',
            //     data: rooms,
            //     tooltip: (d) => `
            //         <div style="
            //             display: flex;
            //             align-items: center;
            //             justify-content: center;
            //             width: 20px;
            //             height: 20px;
            //             padding: 0;
            //             margin: 0;
            //             border-radius: 50%;
            //             overflow: hidden;
            //         ">
            //             <img src="https://uploads-ssl.webflow.com/5eca8aa0518a6eb17eda7575/65a572aed02ee07c9a7dde5e_Pin1.png"
            //                  alt="Icon"
            //                  style="width: 100%; height: 100%;" />
            //         </div>
            //     `,
            //     persistentTooltip: true,
            //     tooltipContainerStyle: `
            //         font-size: 10px;
            //         line-height: 1;
            //         padding: 2px;
            //         max-width: 100px;
            //         background-color: rgba(255, 255, 255, 0);
            //         border-radius: 50%;
            //         box-shadow: none;
            //     `,
            //     onClick: (d) => console.log('Room clicked:', d),
            //     color: (d) => {
            //         if (d.extras?.listingId) {
            //             const index = hashCode(d.extras.listingId);
            //             return cardColors[index];
            //         }
            //     },
            //     alpha: 0.6
            // });

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
    console.log("data", data, item);
    setUnit(item.block);

    spaceRef?.current.removeDataLayer("screenn-start-point");
    // spaceRef?.current.removeDataLayer('rooms');
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
      // setFloors(1);
      spaceRef?.current?.showUpToLevel(0);
      return;
    }
    if (toastId) {
      toast.dismiss(toastId);
    }

    setSelectedPath(data);
  };

  const handleResetSpace = () => {
    // if (selectedDirection.length > 0) {
    //   // spaceRef?.current.showUpToLevel(selectedDirection[0].levelIndex);
    //   spaceRef?.current.showUpToLevel(0);
    //   spaceRef?.current.removeAllDataLayers();
    // } else {
    //   spaceRef?.current.showUpToLevel(0);
    // }
    // if (paramId) {
    //   spaceRef?.current.removeAllDataLayers();
    //   setParamId("");
    // }

    spaceRef?.current.removeAllDataLayers();
    spaceRef?.current.showUpToLevel(0);
    setParamId("");
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
                  <div id="test" className="smplr-embed" ></div>
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
                      {
                        (selectedPath ||  paramId) &&
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
                      }
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
              <Box sx={{ maxHeight: "calc(110vh - 64px)", overflowY: "auto" }}>
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
                  {
                    (selectedPath || paramId) &&
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
                  }
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
              maxHeight: "calc(60vh - 64px)",
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

