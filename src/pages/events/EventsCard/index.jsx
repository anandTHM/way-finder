import React, { useEffect, useState, useCallback, useMemo } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Model from "../../../components/Model";
import { EventsCard } from "..";
import { useMediaQuery } from "@mui/material";
import CustomLoader from "../../../components/Loader";
import dayjs from "dayjs";
import { fetchData } from "../../../apiService";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import empty from "../../../assets/empty.svg";
import moment from "moment";
import customParseFormat from "dayjs/plugin/customParseFormat"; // Import the plugin

dayjs.extend(customParseFormat);

const Event = () => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [allTodaysEvents, setAllTodaysEvents] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const param = location.state?.param;
  const navigate = useNavigate();
  const isPortrait = useMediaQuery("(orientation: portrait)");
  const toDay = moment().format("YYYY-MM-DD");

  const smplrSpaceId = localStorage.getItem("ScreenId");

  const handleOpen = useCallback((imageData) => {
    setSelectedImage(imageData);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedImage(null);
  }, []);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date || dayjs());
  }, []);

  const fetchDataForToday = useCallback(() => {
    setSelectedDate(dayjs());
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const queryParams = {
      category: "club events",
      status: "active",
      organizationId: "5943d4efa3d24b443f4008a2",
      startDate: selectedDate ? selectedDate.format("YYYY-MM-DD") : "",
      sort: sortBy,
      smplrSpaceId: smplrSpaceId,
    };

    try {
      const data = await fetchData("/events", queryParams);
      const filteredItems =
        data.rows?.filter(
          (item) =>
            moment(item?.bookingInfo?.availableDates[0]?.date).format(
              "YYYY-MM-DD"
            ) === toDay
        ) || [];
      const upcomingEvents =
        data.rows?.filter(
          (item) =>
            moment(item?.bookingInfo?.availableDates[0]?.date).format(
              "YYYY-MM-DD"
            ) !== toDay
        ) || [];

      setAllTodaysEvents(filteredItems);
      setAllEvents(upcomingEvents);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, sortBy, toDay]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onSubmitHandler = async (payload) => {
    const url = `/sendMail`;
    const queryParams = {
      organizationId: "5943d4efa3d24b443f4008a2",
      email: payload.email,
      name: payload.name,
      countryCode: "+91",
      phoneNumber: payload.mobile,
      source: "Way Finder",
      type: "Events",
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

  const formatDate = (date) => (date ? dayjs(date).format("DD MM YYYY") : "");

  const renderEvents = useMemo(() => {
    const eventsToDisplay = param === 1 ? allTodaysEvents : allEvents;
    if (eventsToDisplay?.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
          }}
        >
          <Typography variant="h6" color="textSecondary">
            {param === 1 ? "No Data Available for Today" : "No Data Available"}
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {eventsToDisplay?.map((card, index) => (
          <Grid
            item
            xs={4}
            sm={isPortrait ? 6 : 4}
            md={isPortrait ? 6 : 4}
            key={index}
          >
            <EventsCard
              image={card?.files[0]?.aws_url || empty}
              data={card}
              price={card?.bookingInfo?.rate}
              events={card.events}
              onClick={() => handleOpen(card)}
            />
          </Grid>
        ))}
      </Grid>
    );
  }, [allTodaysEvents, allEvents, param, isPortrait, handleOpen]);

  return (
    <>
      {loading ? (
        <CustomLoader size={70} />
      ) : (
        <>
          {param !== 1 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                p: 1,
                m: 2,
                bgcolor: "background.paper",
                borderRadius: 1,
                gap: 2,
              }}
            >
              <Box sx={{ cursor: "pointer" }}>
                {/* <Button
                  variant="outlined"
                  sx={{ width: 200, textAlign: "center", padding: "14px", borderRadius: "4px", borderColor: "rgba(0, 0, 0, 0.23)", "&:hover": { borderColor: "rgba(0, 0, 0, 0.5)" }, fontSize: "1rem", fontWeight: "400", color: "black" }}
                  onClick={fetchDataForToday}
                >
                  Today
                </Button> */}
              </Box>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date Picker"
                    value={selectedDate}
                    onChange={handleDateChange}
                    shouldDisableDate={(date) =>
                      dayjs(date).isBefore(dayjs().add(1, "day").startOf("day"))
                    }
                    format="DD/MM/YYYY"
                    sx={{
                      "& .MuiInputLabel-root": {
                        fontSize: "18px",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "18px",
                      },
                      "& .MuiFormHelperText-root": {
                        fontSize: "18px",
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#7E1946",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#7E1946",
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px white inset",
                        WebkitTextFillColor: "#000000",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          value: formatDate(selectedDate),
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
              <Box>
                <FormControl
                  sx={{
                    width: 200,
                    "& .MuiInputLabel-root": {
                      fontSize: "18px",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "18px",
                    },
                    "& .MuiFormHelperText-root": {
                      fontSize: "18px",
                    },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#7E1946",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#7E1946",
                    },
                    "& input:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0 1000px white inset",
                      WebkitTextFillColor: "#000000",
                    },
                  }}
                >
                  <InputLabel id="field-2-label">Sort By</InputLabel>
                  <Select
                    labelId="Sort-by-label"
                    id="Sort By"
                    label="Sort By"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="earliestToLatest">
                      Earliest To Latest
                    </MenuItem>
                    <MenuItem value="latestToEarliest">
                      Latest To Earliest
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                m: 2,

                maxWidth: 1600,
              }}
            >
              <ArrowBackIcon
                sx={{ fontSize: "2.5rem", cursor: "pointer" }}
                onClick={handleGoBack}
              />
              <Typography variant="h5" sx={{ fontSize: "20px" }}>
                {param === 1 ? "Happening Now" : "Upcoming Events"}
              </Typography>
            </Box>
            {renderEvents}
          </Box>
          <Model
            open={open}
            handleClose={handleClose}
            selectedUnit={selectedImage}
            onSubmitHandler={onSubmitHandler}
          />
        </>
      )}
    </>
  );
};

export default Event;
