import React, { useContext, useEffect, useState } from "react";
import AmenitiesCard from "./Card";
import { Grid, Box, Typography, useMediaQuery } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import image1 from "../../assets/Group112.svg";
import kiddie from "../../assets/kiddie.svg";
import wheels from "../../assets/wheels.svg";
import digital from "../../assets/digital.svg";
import mall from "../../assets/mall.svg";
import { useNavigate } from "react-router-dom";
import { ContextProvider } from "../../GlobalContext";

const data = [
  {
    id: "1",
    title: "24 hour on site security",
    description: "We have 24*7 security monitoring the entire mall",
    image: image1,
  },
  {
    id: "2",
    title: "Digital directory",
    description: "Available for enhancing customer experience",
    image: digital,
  },
  {
    id: "2",
    title: "Digital directory",
    description: "Available for enhancing customer experience",
    image: digital,
  },
  {
    id: "2",
    title: "Digital directory",
    description: "Available for enhancing customer experience",
    image: digital,
  },
  {
    id: "4",
    title: "Kiddie Carts",
    description: "We have 24*7 security monitoring the entire mall",
    image: kiddie,
  },
  {
    id: "5",
    title: "Mall Guide",
    description: "We have 24*7 security monitoring the entire mall",
    image: mall,
  },
  {
    id: "7",
    title: "Wheel Chair",
    description: "We have 24*7 security monitoring the entire mall",
    image: wheels,
  },
  {
    id: "8",
    title: "Kiddie Carts",
    description: "We have 24*7 security monitoring the entire mall",
    image: kiddie,
  },
];

const Amenities = () => {
  const navigate = useNavigate();
  const { setDefaultRoute } = useContext(ContextProvider);
  const id = localStorage.getItem("ScreenId");

  const isSmallDevice = useMediaQuery("(max-width:600px)");

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          mx: 3,
          my: 2,
          cursor: "pointer",
          maxWidth: 1600,
        }}
        onClick={() => {
          setDefaultRoute("Navigations");
          navigate(`/${id}/navigation`);
        }}
      >
        <ArrowBackIcon sx={{ fontSize: "2.5rem" }} />
        <Typography
          variant="h5"
          sx={{ fontSize: isSmallDevice ? "18px" : "22px" }}
        >
          Amenities
        </Typography>
      </Box>
      <Grid container spacing={4} sx={{ px: isSmallDevice ? 2 : 8 }}>
        {data.map((item) => (
          <Grid item xs={12} sm={12} md={6} lg={6} xl={4} key={item.id}>
            <Box sx={{ p: isSmallDevice ? 1 : 2 }}>
              <AmenitiesCard
                icon={item.image}
                title={item.title}
                description={item.description}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Amenities;
