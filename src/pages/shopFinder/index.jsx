import React, { useContext, useEffect, useState } from "react";
import CustomCarousel from "../../components/carousel";
import { Grid, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import ShopFinderCard from "./card";
import { Icons } from "../../assets/svgIcons";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../components/Loader";
import { ContextProvider } from "../../GlobalContext";
import { fetchData as fetchApiData } from "../../apiService";

const generatePlaceholderCategories = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    name: `Category ${i + 1}`,
  }));
};

const cardItems = [
  { icon: Icons.watches, color: "#F1FFFC" },
  { icon: Icons.food, color: "#FFF1F1" },
  { icon: Icons.food, color: "#FFF1F1" },
  { icon: Icons.cafe, color: "#FEF7EB" },
  { icon: Icons.game, color: "#EEFDED" },
  { icon: Icons.hypomarket, color: "#E5FAFD" },
  { icon: Icons.cafes, color: "#FEF7EB" },
  { icon: Icons.men, color: "#FFEDE8" },
  { icon: Icons.women, color: "#F1EEFC" },
  { icon: Icons.mens, color: "#FFEDE8" },
  { icon: Icons.kid, color: "#FEE8F0" },
  { icon: Icons.laptop, color: "#FEE8F0" },
  { icon: Icons.cosmetic, color: "#FFF2FE" },
  { icon: Icons.enter, color: "#EDF3FF" },
];

const categories = [
  {
    name: "Games",
    color: "#EEFDED",
    icon: Icons.game,
  },
  {
    name: "Food & Beverage ",
    color: "#FFF1F1",
    icon: Icons.food,
  },
  {
    name: "Food",
    color: "#FFF1F1",
    icon: Icons.food,
  },
  {
    name: "Cafe",
    color: "#FEF7EB",
    icon: Icons.cafe,
  },
  {
    name: "Technology",
    color: "#F1F1FF",
    icon: Icons.laptop,
  },
  {
    name: "Cloths",
    color: "#FFEDE8",
    icon: Icons.mens,
  },
  {
    name: "Kid's Wear",
    color: "#FEE8F0",
    icon: Icons.kid,
  },
];

const ShopFinder = () => {
  const id = localStorage.getItem("ScreenId");
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState(null);

  const organizationId = localStorage.getItem("Organization");
  const smplrSpaceId = localStorage.getItem("ScreenId");

  const theme = useTheme();
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const cardsPerRow = isLandscape ? 7 : 4;

  const { setSelectedCategory } = useContext(ContextProvider);

  const totalCategories = 14;
  const placeholderCount = Math.max(totalCategories - categories.length, 0);
  const placeholderCategories = generatePlaceholderCategories(placeholderCount);

  const allCategories = [...categories, ...placeholderCategories];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const endpoint = "/offers";
    const queryParams = {
      organizationId: organizationId,
      smplrSpaceId: smplrSpaceId,
      status: "active",
    };

    try {
      const result = await fetchApiData(endpoint, queryParams);
      setOffers(result.rows);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load offers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  const navigateToOffers = () => {
    navigate(`/${id}/offers`);
  };

  const handleCardClick = (category) => {
    setSelectedCategory(category);
    navigate(`/${id}/shops`, { state: { param: category } });
  };

  return (
    <Box sx={{ p: 2 }}>
      {loading ? (
        <CustomLoader size={70} />
      ) : (
        <>
          {offers?.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mx: 3,
                my: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontSize: 22 }}>
                Offers
              </Typography>

              <Typography
                variant="h5"
                sx={{ fontSize: 22, cursor: "pointer", color: "#7E1946" }}
                onClick={navigateToOffers}
              >
                View all
              </Typography>
            </Box>
          )}
          <Box sx={{ mx: 1, overflow: "auto" }}>
            <CustomCarousel offers={offers} />
          </Box>

          <Box>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              sx={{ overflow: "auto" }}
            >
              {allCategories.map((categoryItem, index) => (
                <Grid
                  item
                  xs={12 / cardsPerRow}
                  key={index}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <ShopFinderCard
                    icon={cardItems[index % cardItems.length].icon}
                    backgroundColor={cardItems[index % cardItems.length].color}
                    title={categoryItem.name}
                    onClick={() => handleCardClick(categoryItem)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ShopFinder;
