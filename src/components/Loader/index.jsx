import React from "react";
import { CircularProgress, Box, Container } from "@mui/material";

const CustomLoader = ({ size, color }) => {
  return (
    <Container
      sx={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <CircularProgress size={size} sx={{ color: color ? color : "#7E1946" }} />
    </Container>
  );
};

export default CustomLoader;
