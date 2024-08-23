import * as React from "react";
import { Card, CardMedia, Box, Typography } from "@mui/material";

function CustomerSupportCard({ icon, title, border }) {
  return (
    <>
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 1,
          border: border ? "1.5px solid  #7E1946" : "none",
        }}
      >
        <Card
          sx={{
            flexShrink: 0,
            py: 8,
          }}
        >
          <CardMedia
            component="img"
            sx={{ height: 50, objectFit: "contain" }}
            image={icon}
            title="Card image"
          />
        </Card>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          textAlign: "center",
          padding: 2,
        }}
      >
        <Typography variant={border ? "h6" : "body1"} sx={{ fontSize: "18px" }}>
          {title}
        </Typography>
      </Box>
    </>
  );
}

export default CustomerSupportCard;
