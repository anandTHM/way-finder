import * as React from "react";
import { Card, CardMedia, Typography, Box } from "@mui/material";

function AmenitiesCard({ icon, title, description }) {
  return (
    <Box sx={{ display: "flex", alignItems: "start", gap: 2, mb: 2 }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 4,
          boxShadow: 3,
          width: 140,
          height: 120,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardMedia
          component="img"
          sx={{ height: 50, width: 50, objectFit: "contain" }}
          image={icon}
          title="Card image"
        />
      </Card>

      <Box sx={{ textAlign: "left", width: "100%" }}>
        <Typography variant="body1" sx={{ fontSize: 18 }}>
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: 16,
            overflowWrap: "break-word",
            wordBreak: "break-word",
            width: "280px",
            whiteSpace: "normal",
          }}
          color="text.secondary"
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

export default AmenitiesCard;
