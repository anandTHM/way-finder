import React from "react";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";
import empty from "../../assets/empty.svg";

const CustomCard = ({ item, onClick, has, color, icon, selected, small }) => {
  const theme = useTheme();
  const isPortrait = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isPortrait ? "column" : "row",
        alignItems: "center",
        cursor: "pointer",
        border: selected ? "1.5px solid #7E1946" : "1.5px solid #D9D9D9",
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        overflow: "hidden",
        height: small ? "80%" : "100%",
        // boxShadow: selected && 3
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          gap: 1,
          p: 1,
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            width: small ? 60 : 80,
            height: small ? 60 : 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: color || "",
            borderRadius: "8px",
            m: small ? "10px 0" : 0,
          }}
        >
          {has ? (
            <CardMedia
              component="img"
              sx={{
                width: 70,
                height: 70,
                objectFit: "contain",
                borderRadius: "8px",
              }}
              image={item?.photos[0]?.aws_original_url || empty}
              alt="Category icon"
            />
          ) : (
            <CardMedia
              component="img"
              sx={{
                width: small ? 20 : 40,
                height: small ? 20 : 40,
                objectFit: "contain",
                borderRadius: "8px",
              }}
              image={icon}
              alt="Category icon"
            />
          )}
        </Box>
        <Typography
          sx={{
            fontSize: "18px",
            padding: "0.5rem",
            mx: 2,
            textAlign: "start",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.block || item.name}
        </Typography>
      </Box>
      {has && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            backgroundColor: "#F2F2F2",
            padding: 0,
            margin: 0,
            minWidth: "80px",
            maxWidth: "auto",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "18px",
              padding: "1.5rem",
              fontWeight: "500",
              margin: 0,
              color: "#333333",
              background: "transparent",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline-block",
            }}
          >
            F{item?.floor || 1}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CustomCard;
