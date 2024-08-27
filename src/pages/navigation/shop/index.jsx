import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  Grid,
  Stack,
  TextField,
  useTheme,
  useMediaQuery,
  Box,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { createTheme, ThemeProvider } from "@mui/material";
import { ContextProvider } from "../../../GlobalContext";
import CustomCard from "../../../components/Card";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";
import { Chip } from "@mui/material";

import { Icons } from "../../../assets/svgIcons";
import { ToastContainer, toast } from "react-toastify";
import { fetchData } from "../../../apiService";

const cardColors = [
  "#EEFDED",
  "#FFF1F1",
  "#FFF1F1",
  "#FEF7EB",
  "#F1F1FF",
  "#FFEDE8",
  "#FEE8F0",
];
const cardIcons = [
  Icons.game,
  Icons.food,
  Icons.food,
  Icons.cafe,
  Icons.laptop,
  Icons.men,
  Icons.kid,
];

const categories = [
  {
    name: "Games",
    color: "#EEFDED",
    icon: Icons.game,
  },
  {
    name: "Food and Beverage ",
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
    name: "Clothes",
    color: "#FFEDE8",
    icon: Icons.mens,
  },
  {
    name: "Kid's Wear",
    color: "#FEE8F0",
    icon: Icons.kid,
  },
];

const Navbar = () => {
  const { defaultRoute, activeButton, setActiveButton } =
    useContext(ContextProvider);

  const handleButtonClick = (page) => {
    setActiveButton(page === activeButton ? null : page);
  };

  return (
    <Box sx={{ marginBottom: 3, paddingTop: 1, boxShadow: 3 }}>
      {defaultRoute === "Navigations" && (
        <Grid container justifyContent="center">
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="text"
              sx={{
                p: 2,
                width: "100%",
                borderBottom:
                  activeButton === "Shop" ? "5px solid #7E1946" : "none",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textTransform: "capitalize",
                color: activeButton === "Shop" ? "#7E1946" : "#7B7B7B",
                fontSize: { xs: "0.75rem", sm: "1.2rem" },
                letterSpacing: "0.1rem",
                fontWeight: 400,
              }}
              onClick={() =>
                activeButton !== "Shop" && handleButtonClick("Shop")
              }
            >
              Shop
            </Button>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="text"
              sx={{
                p: 2,
                fontSize: "1rem",
                width: "100%",
                borderBottom:
                  activeButton === "Category" ? "5px solid #7E1946" : "none",
                color: activeButton === "Category" ? "#7E1946" : "#7B7B7B",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textTransform: "capitalize",
                fontSize: { xs: "0.75rem", sm: "1.2rem" },
                letterSpacing: "0.1rem",
                fontWeight: 400,
              }}
              onClick={() =>
                activeButton !== "Category" && handleButtonClick("Category")
              }
            >
              Category
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

const theme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          fontSize: "1rem",
        },
        listbox: {
          fontSize: "1rem",
        },
        popupIndicator: {
          "& .MuiSvgIcon-root": {
            fontSize: "1.5rem",
          },
        },
        clearIndicator: {
          "& .MuiSvgIcon-root": {
            fontSize: "1rem",
          },
        },
        tag: {
          "& .MuiChip-deleteIcon": {
            fontSize: "1rem",
          },
        },
      },
    },
  },
});

const Shops = ({ dataHandler, handleResetSpace }) => {
  const organizationId = "5943d4efa3d24b443f4008a2";
  const screenId = localStorage.getItem("ScreenId");

  const { activeButton, setActiveButton, selectedUnit, setSelectedUnit } =
    useContext(ContextProvider);

  const [units, setUnits] = useState([]);
  // const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unitLoading, setUnitLoading] = useState(false);

  const theme = useTheme();
  const isPortrait = useMediaQuery("(orientation: portrait)");

  useEffect(() => {
    getAllUnits();
  }, []);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      fetchUnitsForCategories(selectedCategories);
    } else {
      setUnits([]);
      getAllUnits();
    }
  }, [selectedCategories]);

  const getAllUnits = async () => {
    setUnitLoading(true);
    try {
      const data = await fetchData("/getAllListingbyOrganizationId", {
        organizationId,
        smplrSpaceId: screenId,
      });
      setUnits(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setUnitLoading(false);
    }
  };

  const fetchUnitsForCategories = async (categories) => {
    console.log("Fetching units for categories", categories);
    setUnitLoading(true);
    try {
      const newUnits = [];
      const unitMap = new Map();

      const tagsArray = categories
        .flatMap((tag) => tag.name.split(" "))
        .filter((word) => word.trim() !== "");

      const queryParams = {
        organizationId,
        smplrSpaceId: screenId,
        ...tagsArray.reduce((acc, tag, index) => {
          acc[`tags[${index}]`] = encodeURIComponent(tag);
          return acc;
        }, {}),
      };

      const queryString = new URLSearchParams(queryParams).toString();

      // const response = await fetch(
      //   `http://localhost:9000/shared-resource/way-finder/getAllListingbyOrganizationId?${queryString}`
      // );

      const data = await fetchData(
        "/getAllListingbyOrganizationId",
        queryString
      );

      data.forEach((unit) => unitMap.set(unit._id, unit));

      newUnits.push(...unitMap.values());
      setUnits(newUnits);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setUnitLoading(false);
    }
  };

  const onClickHandlerCard = async (item) => {
    setSelectedUnit(item);

    try {
      const queryParams = {
        organizationId,
        listingId: item._id,
        smplrSpaceId: screenId,
      };

      const data = await fetchData("/getRoutesByUnitId", queryParams);

      dataHandler(data, item);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onClickCategoryHandler = (category) => {
    setActiveButton("Shop");

    if (selectedCategories.some((cat) => cat.name === category.name)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat.name !== category.name)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const removeCategory = (categoryToRemove) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.filter((cat) => cat !== categoryToRemove)
    );

    // getAllUnits()
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategories(newValue);
    setActiveButton("Shop");
  };

  const filteredOptions = useMemo(
    () =>
      categories.filter(
        (option) =>
          !selectedCategories.some(
            (selectedCategory) => selectedCategory.name === option.name
          )
      ),
    [categories, selectedCategories]
  );

  const handleClear = () => {
    setSelectedUnit(null);
    handleResetSpace();
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "1rem", maxWidth: "100%" }}>
        <ThemeProvider theme={theme}>
          <Stack spacing={2} sx={{ width: "100%" }}>
            {activeButton === "Category" ? (
              <Autocomplete
                multiple
                id="category-dropdown"
                options={filteredOptions}
                getOptionLabel={(option) => option?.name}
                value={selectedCategories}
                onChange={handleCategoryChange}
                renderTags={() => null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Categories"
                    sx={{
                      "& .MuiInputBase-root": {
                        fontSize: "18px",
                        padding: "0.5rem",
                        border: "1.5px solid #D9D9D9",
                        borderRadius: "8px",
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "18px",
                        padding: "0.5rem",
                      },
                      "& .MuiAutocomplete-tag": {
                        fontSize: "18px",
                        padding: "0.5rem",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "18px",
                        padding: "0.5rem",
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#7E1946",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#7E1946",
                      },
                    }}
                  />
                )}
              />
            ) : activeButton === "Shop" ? (
              <Autocomplete
                id="unit-dropdown"
                options={units}
                getOptionLabel={(option) => option?.block}
                value={selectedUnit}
                onChange={(event, newValue) => {
                  setSelectedUnit(newValue);
                  if (newValue) {
                    onClickHandlerCard(newValue);
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue === "") {
                    handleClear();
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search"
                    sx={{
                      "& .MuiInputBase-root": {
                        fontSize: "18px",
                        padding: "0.5rem",
                        border: "1.5px solid #D9D9D9",
                        borderRadius: "8px",
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "18px",
                        padding: "0.5rem",
                      },
                      "& .MuiAutocomplete-tag": {
                        fontSize: "18px",
                        padding: "0.5rem",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "18px",
                        padding: "0.5rem",
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#7E1946",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#7E1946",
                      },
                    }}
                  />
                )}
              />
            ) : null}
          </Stack>
        </ThemeProvider>
        <Box>
          {selectedCategories.length > 0 && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              {selectedCategories.map((cat) => (
                <Chip
                  key={cat.name}
                  label={cat.name}
                  onDelete={() => removeCategory(cat)}
                  sx={{
                    fontSize: "18px",
                    padding: 3,
                    borderRadius: "8px",
                    backgroundColor: "#F7F7F7",
                    color: "#585858",
                    border: "1.5px solid #D9D9D9",
                    "& .MuiChip-deleteIcon": {
                      width: 30,
                      height: 30,
                    },
                  }}
                  deleteIcon={<CloseIcon sx={{ color: "#717171" }} />}
                />
              ))}
            </Box>
          )}
        </Box>
        <Grid container spacing={2} sx={{ mt: 1, position: "relative" }}>
          {loading ? (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <CircularProgress sx={{ color: color ? color : "#7E1946" }} />
            </Grid>
          ) : categories.length === 0 ? (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <Typography
                variant="body1"
                sx={{ textAlign: "center", mt: 2, fontSize: "18px" }}
              >
                No categories found.
              </Typography>
            </Grid>
          ) : activeButton === "Shop" ? (
            selectedCategories.length > 0 || units.length > 0 ? (
              unitLoading ? (
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100px",
                  }}
                >
                  <CircularProgress />
                </Grid>
              ) : units.length > 0 ? (
                units.map((item, index) => (
                  <Grid item xs={!isPortrait ? 12 : 6} key={index}>
                    <CustomCard
                      item={item}
                      onClick={() => onClickHandlerCard(item)}
                      has={"shop"}
                    />
                  </Grid>
                ))
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    width: "100%",
                    textAlign: "center",
                    mt: 2,
                    fontSize: "18px",
                  }}
                >
                  No shops found for the selected categories.
                </Typography>
              )
            ) : (
              <Typography
                variant="body1"
                sx={{
                  width: "100%",
                  textAlign: "center",
                  mt: 2,
                  fontSize: "18px",
                }}
              >
                No category is selected. Please select a category.
              </Typography>
            )
          ) : (
            categories.map((item, index) => (
              <Grid item xs={!isPortrait ? 12 : 6} key={index}>
                <CustomCard
                  item={item}
                  color={cardColors[index % cardColors.length]}
                  icon={cardIcons[index % cardIcons.length]}
                  onClick={() => onClickCategoryHandler(item)}
                />
              </Grid>
            ))
          )}
        </Grid>
      </div>
      <ToastContainer />
    </>
  );
};

export default Shops;
