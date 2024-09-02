import React, { useContext, useEffect, useState } from "react";
import burgerKing from "../../../assets/burgerKing.svg";
import demart from "../../../assets/demart.svg";
import ShopFinderCard from "../card";
import { Box, Typography, useMediaQuery } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import CustomLoader from "../../../components/Loader";
import { ContextProvider } from "../../../GlobalContext";
import { fetchData as fetchApiData } from "../../../apiService";

const images = [
  demart,
  burgerKing,
  demart,
  burgerKing,
  demart,
  burgerKing,
  demart,
  burgerKing,
  demart,
  burgerKing,
  demart,
  burgerKing,
  demart,
  burgerKing,
  demart,
  burgerKing,
  demart,
  burgerKing,
  demart,
  burgerKing,
  demart,
];

const Shops = () => {
  const [loader, setLoader] = useState(false);
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const param = location.state.param;
  const { selectedCategory } = useContext(ContextProvider);

  const organizationId = localStorage.getItem("Organization");
  const smplrSpaceId = localStorage.getItem("ScreenId");

  const fetchListingByOrganizationId = async () => {
    setLoader(true);
    try {
      const tagsArray = param.name
        .split(" ")
        .filter((tag) => tag.trim() !== "");

      const queryParams = {
        organizationId,
        smplrSpaceId,
        ...tagsArray.reduce((acc, tag, index) => {
          acc[`tags[${index}]`] = tag;
          return acc;
        }, {}),
      };

      const data = await fetchApiData(
        "/getAllListingbyorganizationId",
        queryParams
      );
      setShops(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchListingByOrganizationId();
  }, [selectedCategory]);

  const isLandscape = useMediaQuery("(orientation: landscape)");
  const cardsPerRow = isLandscape ? 7 : 5;

  const id = localStorage.getItem("ScreenId");

  return (
    <Box sx={{ p: 2 }}>
      {loader ? (
        <CustomLoader size={70} />
      ) : (
        <>
          <Box sx={{ m: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: "1rem 0.5rem",
                cursor: "pointer",
                position: "relative",
                zIndex: 1,
              }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon sx={{ fontSize: "2.5rem" }} />
            </div>
          </Box>

          {shops && shops?.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `repeat(${cardsPerRow}, 4fr)`,
              }}
            >
              {/* {images.map((icon, index) => (
                  <Box key={index}>
                    <ShopFinderCard
                      icon={icon}
                      showName={false}
                      onClick={() => navigate(`/${id}/shops/details`)}
                    />
                  </Box>
                ))} */}
              {shops.map((icon, index) => (
                <Box key={index} >
                  <ShopFinderCard
                    icon={icon?.photos[0]?.aws_original_url}
                    showName={false}
                    onClick={() =>
                      navigate(`/${id}/shops/${icon.id}`, {
                        state: { param: icon },
                      })
                    }
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "22px" }}
                color="textSecondary"
              >
                No data available
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Shops;
