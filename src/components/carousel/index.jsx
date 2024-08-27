import * as React from "react";
import { useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import empty from "../../assets/empty.svg";
import Model from "../Model";
import { fetchData } from "../../apiService";

const organizationId = localStorage.getItem("Organization");

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
function CustomCarousel({ offers, has, isPortrait }) {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md", "lg"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const [open, setOpen] = useState(false);
  const [onClickedImageData, setOnClickedImageData] = useState({});

  const [activeStep, setActiveStep] = React.useState(0);

  const itemsPerPage = isLargeScreen ? 2 : 1;
  const maxSteps = Math.ceil(offers?.length / itemsPerPage) || 0;

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = (pair) => {
    setOnClickedImageData(pair);
    setOpen(true);
  };

  const onSubmitHandler = async (payload) => {
    const url = "/sendMail";
    const queryParams = {
      organizationId: organizationId,
      email: payload.email,
      name: payload.name,
      countryCode: "+91",
      phoneNumber: payload.mobile,
      // offerEmail: onClickedImageData?.to,
      source: payload.source,
      type: "Offers",
      comments: payload.comments,
    };

    try {
      const result = await fetchData(url, queryParams);
      console.log("Success:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSwipe = (index) => {
    if (index >= maxSteps) {
      setActiveStep(0);
    } else {
      setActiveStep(index);
    }
  };

  if (isPortrait) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {offers?.length > 0 ? (
            offers?.map((image, index) => (
              <Box
                key={index}
                component="img"
                sx={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  padding: 1,
                  borderRadius: 4,
                }}
                src={image.files[index]?.aws_url || empty}
                alt={image.label}
                onClick={() => handleClickOpen(image)}
              />
            ))
          ) : (
            <Box
              component="img"
              sx={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
                padding: 1,
              }}
              src={empty}
              alt="No offers available"
            />
          )}
        </Box>
        <Model
          open={open}
          handleClose={handleClose}
          onSubmitHandler={onSubmitHandler}
          selectedUnit={onClickedImageData}
        />
      </>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AutoPlaySwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleSwipe}
        enableMouseEvents
        sx={{ flex: 1 }}
      >
        {Array.from({ length: maxSteps }).map((_, index) => (
          <div key={index}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              {offers?.length > 0 ? (
                offers
                  .slice(
                    index * itemsPerPage,
                    index * itemsPerPage + itemsPerPage
                  )
                  .map((image, idx) => (
                    <Box
                      key={idx}
                      component="img"
                      sx={{
                        height: has ? "80vh" : "40vh",
                        width: isLargeScreen ? "50vw" : "100%",
                        objectFit: "cover",

                        padding: 1,
                        borderRadius: 4,
                      }}
                      src={image.files[idx]?.aws_url || empty}
                      alt={image.label}
                      onClick={() => handleClickOpen(image)}
                    />
                  ))
              ) : (
                <Box
                  key={index}
                  component="img"
                  sx={{
                    height: has ? "80vh" : "40vh",
                    width: isLargeScreen ? "50vw" : "100%",
                    objectFit: "cover",

                    padding: 1,
                    borderRadius: 4,
                  }}
                  src={images.files[0]?.aws_url || empty}
                  alt="No offers available"
                />
              )}
            </Box>
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{
          justifyContent: "center",
          bgcolor: "transparent",
          "& .MuiMobileStepper-dot": {
            backgroundColor: "#D9D9D9",
            m: "0 4px",
            width: "10px",
            height: "10px",
          },
          "& .MuiMobileStepper-dotActive": {
            backgroundColor: "#565656",
            margin: "0 4px",
            width: "10px",
            height: "10px",
          },
          marginBottom: 1,
        }}
      />

      <Model
        open={open}
        handleClose={handleClose}
        onSubmitHandler={onSubmitHandler}
        selectedUnit={onClickedImageData}
      />
    </Box>
  );
}

export default CustomCarousel;
