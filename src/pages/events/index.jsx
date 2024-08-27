import React, { useEffect, useState, useCallback } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Slider from "react-slick";
import { Box, useMediaQuery } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../components/Loader";
import empty from "../../assets/empty.svg";
import moment from "moment";
import { fetchData } from "../../apiService";
import Model from "../../components/Model";
import "./events.css";

export function EventsCard({ price, image, data, onClick }) {
  return (
    <Card
      sx={{
        maxWidth: {
          xs: "100%",
          sm: "600px",
          md: "800px",
          lg: "1000px",
        },
        m: 2,

        cursor: "pointer",
        boxShadow: 3,
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        sx={{ height: 270, objectFit: "cover" }}
        image={image || empty}
        alt={data?.name || "Event image"}
      />
      <CardContent>
        <Box>
          <Typography gutterBottom sx={{ fontSize: "20px", fontWeight: "500" }}>
            {data?.name || "Testing Demo"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              flex: "0 0 80%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              pr: 2,
            }}
          >
            <Typography sx={{ fontSize: "16px" }}>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor
              nihil corporis, voluptatum .
            </Typography>
          </Box>
          <Box
            sx={{
              flex: "0 0 20%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Typography sx={{ fontSize: "20px", fontWeight: "500" }}>
              {price > 0 ? `$${price}` : "Free"}
            </Typography>
            {price > 0 && (
              <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
                Per Person
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

const getSlidesToShow = (itemsCount) => {
  if (itemsCount >= 6) {
    return 3;
  } else {
    return 2;
  }
};

const getSliderSettings = (eventsLength, currentSlide, setCurrentSlide) => ({
  dots: true,
  infinite: true,
  speed: 500,
  // slidesToShow: getSlidesToShow(eventsLength),
  slidesToShow: 3,
  slidesToScroll: 1,
  customPaging: (i) => (
    <div
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: i === currentSlide ? "#565656" : "#D9D9D9",
        cursor: "pointer",
        margin: "0 5px",
      }}
    />
  ),
  dotsClass: "slick-dots custom-dots",
  beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        // slidesToShow: getSlidesToShow(eventsLength),
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: true,
      },
    },
  ],
});

const EventsCardCarousel = () => {
  const [sliderRef, setSliderRef] = useState(null);
  const [sliderRef1, setSliderRef1] = useState(null);
  const [currentSlideTodays, setCurrentSlideTodays] = useState(0);
  const [currentSlideUpcoming, setCurrentSlideUpcoming] = useState(0);
  const [allEvents, setAllEvents] = useState([]);
  const [allTodaysEvents, setAllTodaysEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const toDay = moment().format("YYYY-MM-DD");
  const organizationId = localStorage.getItem("Organization");
  const navigate = useNavigate();
  const isPortrait = useMediaQuery("(orientation: portrait)");
  const [selectedImage, setSelectedImage] = useState(null);

  const [open, setOpen] = useState(false);
  const smplrSpaceId = localStorage.getItem("ScreenId");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const url = "/events";
    const queryParams = {
      category: "club events",
      status: "active",
      organizationId: organizationId,
      startDate: "",
      sort: "earliestToLatest",
      smplrSpaceId: smplrSpaceId,
    };

    try {
      const data = await fetchData(url, queryParams);
      const filteredItems = data.rows?.filter(
        (item) =>
          moment(item?.bookingInfo?.availableDates[0]?.date).format(
            "YYYY-MM-DD"
          ) === toDay
      );
      const upcomingEvents = data.rows?.filter(
        (item) =>
          moment(item?.bookingInfo?.availableDates[0]?.date).format(
            "YYYY-MM-DD"
          ) !== toDay
      );

      setAllTodaysEvents(filteredItems);
      setAllEvents(upcomingEvents);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false);
    }
  }, [organizationId, toDay]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (sliderRef) {
      const interval = setInterval(() => {
        sliderRef.slickNext();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sliderRef]);

  useEffect(() => {
    if (sliderRef1) {
      const interval = setInterval(() => {
        sliderRef1.slickNext();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sliderRef1]);

  const onClickViewHandler = (param) => {
    const id = localStorage.getItem("ScreenId");
    navigate(`/${id}/events/allEvents`, { state: { param: param } });
  };

  const sliderSettingsTodays = getSliderSettings(
    allTodaysEvents?.length,
    currentSlideTodays,
    setCurrentSlideTodays
  );
  const sliderSettingsUpcoming = getSliderSettings(
    allEvents?.length,
    currentSlideUpcoming,
    setCurrentSlideUpcoming
  );

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
    }
  };

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedImage(null);
  }, []);

  const handleOpen = useCallback((imageData) => {
    setSelectedImage(imageData);
    setOpen(true);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      {loading ? (
        <CustomLoader size={70} />
      ) : (
        <>
          {/* Happening Now */}
          <Box sx={{ my: 2 }}>
            {allTodaysEvents?.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mx: 2,
                }}
              >
                <Typography variant="h5" sx={{ fontSize: 22 }}>
                  Happening Now
                </Typography>
                {allTodaysEvents?.length > 3 && (
                  <Typography
                    variant="h5"
                    sx={{ fontSize: 22, cursor: "pointer", color: "#7E1946" }}
                    onClick={() => onClickViewHandler(1)}
                  >
                    View all
                  </Typography>
                )}
              </Box>
            )}
            <Box sx={{ position: "relative" }}>
              {isPortrait ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                  }}
                >
                  {allTodaysEvents?.slice(0, 2).map((card, index) => (
                    <EventsCard
                      key={index}
                      price={card?.bookingInfo?.rate}
                      image={card?.files[0]?.aws_url || empty}
                      data={card}
                      onClick={() => handleOpen(card)}
                    />
                  ))}
                </Box>
              ) : allTodaysEvents?.length > 3 ? (
                <Slider {...sliderSettingsTodays} ref={setSliderRef}>
                  {allTodaysEvents?.map((card, index) => (
                    <Box key={index}>
                      <EventsCard
                        price={card?.bookingInfo?.rate}
                        image={card?.files[0]?.aws_url || empty}
                        data={card}
                        onClick={() => handleOpen(card)}
                      />
                    </Box>
                  ))}
                </Slider>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1,
                  }}
                >
                  {allTodaysEvents?.slice(0, 3).map((card, index) => (
                    <EventsCard
                      key={index}
                      price={card?.bookingInfo?.rate}
                      image={card?.files[0]?.aws_url || empty}
                      data={card}
                      onClick={() => handleOpen(card)}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          {/* Upcoming Events */}
          <Box sx={{ my: 2 }}>
            {allEvents?.length > 3 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mx: 2,
                }}
              >
                <Typography variant="h5" sx={{ fontSize: 22 }}>
                  Upcoming Events
                </Typography>

                <Typography
                  variant="h5"
                  sx={{ fontSize: 22, cursor: "pointer", color: "#7E1946" }}
                  onClick={() => onClickViewHandler(2)}
                >
                  View all
                </Typography>
              </Box>
            )}
            <Box sx={{ position: "relative" }}>
              {isPortrait ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                  }}
                >
                  {allEvents?.slice(0, 4).map((card, index) => (
                    <EventsCard
                      key={index}
                      price={card?.bookingInfo?.rate}
                      image={card?.files[0]?.aws_url || empty}
                      data={card}
                      onClick={() => handleOpen(card)}
                    />
                  ))}
                </Box>
              ) : allEvents?.length > 3 ? (
                <Slider {...sliderSettingsUpcoming} ref={setSliderRef1}>
                  {allEvents.map((card, index) => (
                    <Box key={index}>
                      <EventsCard
                        price={card?.bookingInfo?.rate}
                        image={card?.files[0]?.aws_url || empty}
                        data={card}
                        onClick={() => handleOpen(card)}
                      />
                    </Box>
                  ))}
                </Slider>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 2,
                  }}
                >
                  {allEvents?.slice(0, 3).map((card, index) => (
                    <EventsCard
                      key={index}
                      price={card?.bookingInfo?.rate}
                      image={card?.files[0]?.aws_url || empty}
                      data={card}
                      onClick={() => handleOpen(card)}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
      <Model
        open={open}
        handleClose={handleClose}
        selectedUnit={selectedImage}
        onSubmitHandler={onSubmitHandler}
      />
    </Box>
  );
};

export default EventsCardCarousel;
