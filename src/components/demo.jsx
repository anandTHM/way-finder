import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Icons } from "../assets/svgIcons";
import { useMediaQuery } from "@mui/material";
import CustomCard from "./Card";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ContextProvider } from "../GlobalContext";

const cardColors = ["#EEFDED", "#FFF1F1", "#FFF1F1", "#FEF7EB", "#F1F1FF","#FFEDE8","#FEE8F0"];
const cardIcons = [
  Icons.game,
  Icons.food,
  Icons.food,
  Icons.cafe,
  Icons.laptop,
  Icons.men,
  Icons.kid
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
    name:"Clothes",
    color:"#FFEDE8",
    icon:Icons.mens,
  },
  {
    name:"Kid's Wear",
    color:"#FEE8F0",
    icon:Icons.kid,
  }
];

const theme = createTheme({
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          maxWidth: "60vw",
          maxHeight: "60vh",
          width: "auto",
          height: "auto",
        },
      },
    },
  },
});

function CategorySelector({ open, onClose, onSelectCategories, searchTerm }) {
  const { selectedCategories, setSelectedCategories } =
    useContext(ContextProvider);

  console.log("selectedCategories", selectedCategories);

  const isPortrait = useMediaQuery("(orientation: portrait)");

  const offersInputData = searchTerm
    ? searchTerm.split(",").map((item) => item.trim())
    : [];

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category.name)
        ? prev.filter((name) => name !== category.name)
        : [...prev, category.name]
    );
  };

  const handleSubmit = () => {
    onSelectCategories(selectedCategories);
    onClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={() => {
          setSelectedCategories(offersInputData);
          onClose();
        }}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ borderBottom: "1.5px solid #E3E3E3" }}>
          <DialogTitle>
            <Typography variant="h6">Select Categories</Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => {
                setSelectedCategories(offersInputData);
                onClose();
              }}
              aria-label="close"
              sx={{
                position: "absolute",
                right: 16,
                top: 12,
              }}
            >
              <CloseIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </DialogTitle>
        </Box>
        <DialogContent>
          <Grid container spacing={2}>
            {categories.map((item, index) => (
              <Grid item xs={6} key={index} sx={{ marginBottom: "-25px" }}>
                <CustomCard
                  item={item}
                  color={cardColors[index % cardColors.length]}
                  icon={cardIcons[index % cardIcons.length]}
                  onClick={() => handleCategoryClick(item)}
                  selected={selectedCategories.includes(item.name)}
                  small
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <Box sx={{ padding: "5px", borderTop: "1.5px solid #E3E3E3" }}>
          <DialogActions sx={{ marginRight: "8px" }}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                background: "#7E1946",
                fontFamily: "100",
                "&:hover": {
                  background: "#7E1946",
                },
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </ThemeProvider>
  );
}

export default CategorySelector;
