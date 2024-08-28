import React, { useContext, useEffect, useState } from "react";
import { Grid, Typography, Button, Box, useMediaQuery } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import direction from "../../../assets/direction.svg";
import CustomCarousel from "../../../components/carousel";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../../components/Loader";
import { useLocation } from "react-router-dom";
import { fetchData } from "../../../apiService";
import { ContextProvider } from "../../../GlobalContext";
import empty from "../../../assets/empty.svg";

function ShopDetails() {
  const location = useLocation();
  const param = location.state?.param;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [listingDetails, setListingsDetails] = useState([]);
  const [error, setError] = useState("");

  const displayNameField = param?.customFields?.filter(
    (field) =>
      field.fieldLabel?.toLowerCase().includes("display name")
  )[0];
  
  const isPortrait = useMediaQuery("(orientation: portrait)");

  const { setSelectedUnit, setDefaultRoute, setSelectedPath } =
    useContext(ContextProvider);

  const smplrSpaceId = localStorage.getItem("ScreenId");
  const organizationId = localStorage.getItem("Organization");

  useEffect(() => {
    fetchOffers();
    fetchListingsDetails();
  }, []);

  const fetchListingsDetails = async () => {
    try {
      const queryParams = {
        organizationId: "5943d4efa3d24b443f4008a2",
        status: "active",
        listing: param.id,
        smplrSpaceId: smplrSpaceId,
      };

      const data = await fetchData(
        "/getAllListingbyOrganizationId",
        queryParams
      );
      setListingsDetails(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const queryParams = {
        organizationId: "5943d4efa3d24b443f4008a2",
        status: "active",
        listing: param.id,
        smplrSpaceId: smplrSpaceId,
      };

      const data = await fetchData("/offers", queryParams);
      setOffers(data.rows);
      // setOffers((prevState)=[...prevState,...data.rows]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onDirectionHandler = async () => {
    try {
      const queryParams = {
        organizationId: organizationId,
        listingId: param.id,
        smplrSpaceId: smplrSpaceId,
      };

      const data = await fetchData("/getRoutesByUnitId", queryParams);
      if (data) {
        setSelectedPath(data);
        setDefaultRoute("Navigations");
        setSelectedUnit(param);
        navigate(`/${smplrSpaceId}/navigation`);
      }
    } catch (error) {
      console.error("There was a problem fetching the directions:", error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {loading ? (
        <CustomLoader size={70} />
      ) : (
        <>
          <Grid container spacing={1} sx={{ m: 1 }}>
            <Grid
              item
              xs={1}
              sx={{ display: "flex", alignItems: "start" }}
              onClick={() => navigate(-1)}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "start",
                  cursor: "pointer",
                }}
              >
                <ArrowBackIcon sx={{ fontSize: "2.5rem" }} />
              </Box>
            </Grid>

            <Grid
              item
              xs={1}
              sx={{
                display: "flex",
                alignItems: "center",
                paddingRight: "20px",
              }}
            >
              <img
                src={param?.photos[0]?.aws_url || empty}
                alt="Store"
                style={{ width: "120%", height: "auto", marginLeft: "-5%", border:"1.5px solid #E4E4E4" }}
              />
            </Grid>

            <Grid
              item
              xs={isPortrait ? 4 : 4}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
              }}
            >
              <Typography variant="h6" sx={{ fontSize: "26px" }}>
                {" "}
                { displayNameField?.feildValue ||   param?.block}
              </Typography>
              <Typography variant="body1">
                Floor: Ground Floor | Store No: U670
              </Typography>
              <Typography variant="body1">
                Store Timings: 11:00 AM - 10:00 PM
              </Typography>
            </Grid>

            <Grid
              item
              xs={isPortrait ? 6 : 6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  m: 2,
                  p: 1,
                }}
              >
                {listingDetails.tenants && (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                  >
                    <Typography variant="body1">
                      Manager Name: {listingDetails?.tenants[0]?.firstName}{" "}
                      {listingDetails?.tenants[0]?.lastName}
                    </Typography>
                    <Typography variant="body1">
                      Contact Number: 948985 58478
                    </Typography>
                  </Box>
                )}
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#7E1946",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#5C0F34",
                    },
                    ml: 2, //
                    minWidth: "auto",
                  }}
                  startIcon={
                    <img src={direction} width={"20px"} alt="Direction icon" />
                  }
                  onClick={onDirectionHandler}
                >
                  Get Directions
                </Button>
              </Box>
            </Grid>
          </Grid>
          {offers?.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <Typography variant="h6">No offers available</Typography>
            </Box>
          ) : (
            <Box xs={{ m: 1 }}>
              <CustomCarousel
                offers={offers}
                has={"offers"}
                isPortrait={isPortrait}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default ShopDetails;
