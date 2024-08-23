import React, { useState, useEffect, useContext } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Grid,
  Typography,
  Box,
  Autocomplete,
  TextField,
  useTheme,
  useMediaQuery,
  Input,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Model from "../../../components/Model";
import CustomLoader from "../../../components/Loader";
import empty from "../../../assets/empty.svg";
import { fetchData as fetchApiData } from "../../../apiService";
import CategorySelector from "../../../components/demo";
import { IconButton } from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers";
import { ContextProvider } from "../../../GlobalContext";
import { Icons } from "../../../assets/svgIcons";

const cardColors = ["#EEFDED", "#FFF1F1", "#FFF1F1", "#FEF7EB", "#F1F1FF"];
const cardIcons = [
  Icons.game,
  Icons.food,
  Icons.food,
  Icons.cafe,
  Icons.laptop,
];

const categories = [
  {
    name: "Games",
    color: "#EEFDED",
    icon: Icons.game,
  },
  {
    name: "Food and Beverage",
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
];

const SearchableDropdown = ({
  isPortrait,
  units,
  onSearch,
  onSelectUnit,
  onClear,
  searchTerm,
  selectedCategories,
}) => {
  const combinedSearchTerm = selectedCategories.join(", ");

  return (
    <Box
      sx={{
        py: 1,
        px: 0.4,
        margin: -1,
        width: isPortrait ? "100%" : "50%",
      }}
    >
      <Autocomplete
        freeSolo
        options={[]}
        inputValue={combinedSearchTerm}
        onInputChange={(event, newValue) => onSearch(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            variant="outlined"
            onChange={onSearch}
            // onFocus={onSearch}
            sx={{
              width: "100%",
              "& .MuiInputBase-input": {
                width: "100%",
              },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                  {combinedSearchTerm && (
                    <IconButton
                      onClick={() => onClear()}
                      sx={{
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </>
              ),
            }}
          />
        )}
        onChange={(event, value) => onSelectUnit(value)}
      />
    </Box>
  );
};

const Offers = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [units, setUnits] = useState([]);
  const [onClickedImageData, setOnClickedImageData] = useState({});
  const [categorySelector, setCategorySelector] = useState(false);
  const theme = useTheme();
  const isPortrait = useMediaQuery("(orientation: portrait)");
  const navigate = useNavigate();

  const organizationId = localStorage.getItem("Organization");
  const smplrSpaceId = localStorage.getItem("ScreenId");

  const { setSelectedCategories } = useContext(ContextProvider);

  useEffect(() => {
    // const getAllUnits = async () => {
    //   const url = '/getAllListingbyOrgId';
    //   const queryParams = {
    //     orgId: orgId,
    //     smplrSpaceId: smplrSpaceId
    //   };

    //   try {
    //     const data = await fetchApiData(url, queryParams);
    //     setUnits(data);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };

    // getAllUnits();
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    const url = "/offers";
    const queryParams = {
      organizationId: organizationId,
      status: "active",
      smplrSpaceId: smplrSpaceId,
    };

    try {
      const result = await fetchApiData(url, queryParams);
      setOffers(result.rows);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = (pair) => {
    setOnClickedImageData(pair);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    fetchOffers();
    setSelectedCategories([]);
  };

  const onSubmitHandler = async (payload) => {
    const url = "/sendMail";
    const queryParams = {
      organizationId: organizationId,
      email: payload.email,
      name: payload.name,
      countryCode: "+91",
      phoneNumber: payload.mobile,
      offerEmail: onClickedImageData?.to,
      source: payload.source,
      type: "Offers",
      comments: payload.comments,
    };

    try {
      const result = await fetchApiData(url, queryParams);
      console.log("Success:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSelectCategories = async (categories) => {
    setSearchTerm(categories.join(", "));
    setCategorySelector(false);
    setLoading(true);

    console.log("Categories:", categories);

    if (categories.length > 0) {
      try {
        const tagsArray = categories
          .flatMap((tag) => tag.split(" "))
          .filter((word) => word.trim() !== "");

        const queryParams = {
          organizationId,
          smplrSpaceId: smplrSpaceId,
          ...tagsArray.reduce((acc, tag, index) => {
            acc[`tags[${index}]`] = encodeURIComponent(tag);
            return acc;
          }, {}),
        };

        const queryString = new URLSearchParams(queryParams).toString();

        const data = await fetchApiData("/getOffersByTags", queryString);
        setOffers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      fetchOffers();
    }
  };

  const onCloseCategoryhandler = () => {
    setCategorySelector(false);
  };

  return (
    <Box sx={{ mx: 3 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          margin: "1rem 0.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <ArrowBackIcon
          sx={{ fontSize: "2rem", cursor: "pointer" }}
          onClick={() => navigate(-1)}
        />
        <Typography variant="h5" sx={{ fontSize: "1.5rem" }}>
          Offers
        </Typography>
      </div>
      <Box sx={{ m: 1 }}>
        <TextField
          value={searchTerm}
          variant="outlined"
          onClick={() => setCategorySelector(true)}
          InputProps={{
            endAdornment: searchTerm && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <ClearIcon />
              </IconButton>
            ),
            style: { paddingRight: 0 },
          }}
          placeholder="Select categories"
          fullWidth
          sx={{
            borderColor: "grey.500",
            borderRadius: 1,
            width: isPortrait ? "100%" : "49%",
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
      </Box>

      {loading ? (
        <CustomLoader size={70} />
      ) : offers.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", mt: 2 }}>
          No offers available
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {offers.map((pair, index) => (
            <Grid item xs={12} key={index}>
              <Grid container spacing={1}>
                {pair.files.map((image, imgIndex) => (
                  <Grid
                    item
                    xs={isPortrait ? 12 : 6}
                    key={imgIndex}
                    onClick={() => handleClickOpen(pair)}
                  >
                    <div
                      style={{
                        position: "relative",
                        paddingTop: isPortrait ? "20%" : "30%",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={image.aws_url || empty}
                        alt={`Offer ${index}-${imgIndex}`}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          padding: "0.5rem",
                          objectPosition: "top",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      )}
      <CategorySelector
        open={categorySelector}
        onClose={onCloseCategoryhandler}
        onSelectCategories={handleSelectCategories}
        searchTerm={searchTerm}
      />
      <Model
        open={open}
        handleClose={handleClose}
        onSubmitHandler={onSubmitHandler}
        selectedUnit={onClickedImageData}
      />
    </Box>
  );
};

export default Offers;
