import React from "react";
import { Box, TextField } from "@mui/material";
import { Select, InputLabel, FormControl, MenuItem } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const CustomDatePicker = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        m: 2,
        bgcolor: "background.paper",
        borderRadius: 1,
        gap: 2, // Add spacing between items
      }}
    >
      <Box>
        <TextField
          variant="outlined"
          sx={{ width: 200, "& input": { textAlign: "center" } }}
          value={"Today"}
        />
      </Box>
      <Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date Picker"
            renderInput={(params) => (
              <TextField {...params} variant="outlined" />
            )}
          />
        </LocalizationProvider>
      </Box>
      <Box>
        <FormControl sx={{ width: 200 }}>
          <InputLabel id="field-2-label">Sort By</InputLabel>
          <Select
            labelId="Sort-by-label"
            id="Sort By"
            label="Sort By"
            defaultValue=""
          >
            <MenuItem value={20}>Earliest To Latest</MenuItem>
            <MenuItem value={20}>Latest To Earliest</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default CustomDatePicker;
