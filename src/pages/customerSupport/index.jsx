import React, { useContext, useEffect, useState } from "react";
import bag from "../../assets/bagg.svg";
import desk from "../../assets/desk.svg";
import {
  Grid,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomerSupportCard from "./Card";
import direction from "../../assets/direction.svg";
import PhoneIcon from "@mui/icons-material/Phone";
import { useNavigate } from "react-router-dom";
import Model from "../../components/Model";
import { ContextProvider } from "../../GlobalContext";
import { fetchData } from "../../apiService";

const data = [
  {
    id: "1",
    image: bag,
    title: "Baggage Section",
    pathId: "87804fe4-88b5-4060-92c4-793969b86f6f",
  },
  {
    id: "2",
    image: desk,
    title: "Information Desk",
    pathId: "160ad506-cc6c-4276-9163-dbf8d4924df9",
  },
];

const CustomerSupport = () => {
  const navigate = useNavigate();
  const { setDefaultRoute } = useContext(ContextProvider);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(data[0]);

  const id = localStorage.getItem("ScreenId");
  const organizationId = localStorage.getItem("Organization");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmitHandler = async (payload) => {
    const url = "/sendMail";

    const queryParams = {
      organizationId: organizationId,
      email: payload.email,
      name: payload.name,
      countryCode: "+91",
      offerEmail: data?.to,
      phoneNumber: payload.mobile,
      source: payload.source,
      type: "Feedback",
      comments: payload.comments,
    };

    try {
      const result = await fetchData(url, queryParams);
      console.log("Success:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const onClickhandler = (item) => {
    setDefaultRoute("Navigations");
    navigate(`/${id}/navigation`, { state: { selectedItem } });
  };

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
        <Typography variant="h5" sx={{ fontSize: 22 }}>
          Customer Services
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid container sx={{ maxWidth: "500px", justifyContent: "center" }}>
          {data.map((item) => (
            <Grid item xs={12} sm={6} md={6} key={item.id}>
              <Box
                sx={{ m: 4, cursor: "pointer" }}
                onClick={() => handleCardClick(item)}
              >
                <CustomerSupportCard
                  icon={item.image}
                  title={item.title}
                  border={selectedItem.id === item.id}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          width: "100%",
          px: 2,
        }}
      >
        <Grid
          container
          spacing={4}
          sx={{
            maxWidth: "700px",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#7E1946",
                color: "white",
                "&:hover": {
                  backgroundColor: "grey",
                },
                p: 2,
                textTransform: "capitalize",
                fontSize: "16px",
                fontWeight: 400,
              }}
              startIcon={
                <img src={direction} width={"16px"} alt="Direction icon" />
              }
              onClick={onClickhandler}
            >
              Get Direction - {selectedItem.title}
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "black",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
                p: 2,

                fontSize: "16px",
                textTransform: "capitalize",
                fontWeight: 400,
              }}
              fullWidth
              onClick={handleClickOpen}
            >
              Feedback Form
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          marginTop: 4,
          marginBottom: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            display: "flex",
            flexDirection: "column",
            boxShadow: 1,
            border: "1px solid #D9D9D9",
            borderRadius: "8px",
          }}
        >
          <Grid container sx={{ height: "100%" }}>
            <Grid item xs={12} sm={6}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "18px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  Contact us
                </Typography>
              </CardContent>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                  height: "100%",
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    textAlign: "center",
                    fontSize: "16px",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#F9E7EF",
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <PhoneIcon sx={{ color: "black", fontSize: 20 }} />{" "}
                  </Box>
                  9876543210
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Model
        open={open}
        handleClose={handleClose}
        hasIcon={true}
        onSubmitHandler={onSubmitHandler}
      />
    </Box>
  );
};

export default CustomerSupport;
