import * as React from "react";
import { Card, CardMedia, Box, Typography } from "@mui/material";
import empty from "../../../assets/empty.svg";

function ShopFinderCard({ icon, title, backgroundColor, onClick }) {
  return (
    <Box
      sx={{
        overflow: "hidden",
        textAlign: "center",
        width: "90%",
        cursor: "pointer",
        aspectRatio: "1 / 1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClick}
    >
      <Card
        sx={{
          width: title ? "90%" : "100%",
          height: title ? "90%" : "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: backgroundColor,
          boxShadow: 3,
          position: "relative",
          overflow: "hidden",
          borderRadius: "5px",
          p: 3,
        }}
      >
        {title ? (
          <CardMedia
            component="img"
            sx={{
              height: "50%",
              width: "50%",
              objectFit: "contain",
            }}
            image={icon}
            title="Card image"
          />
        ) : (
          <CardMedia
            component="img"
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "contain",
              borderRadius: "5px",
              border:"1.5px solid #E4E4E4"
            }}
            image={icon || empty}
            title="Card image"
          />
        )}
      </Card>
      {title && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            p: 1,
            mt: 1,
          }}
        >
          <Typography sx={{ fontSize: "16px" }}>{title}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default ShopFinderCard;
