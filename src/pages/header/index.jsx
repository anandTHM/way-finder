import React from "react";
import { Grid } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useState, useEffect, useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { ContextProvider } from "../../GlobalContext";
import sun from "../../assets/sun.svg";
import moon from "../../assets/moon.svg";
import moon2 from "../../assets/moon2.svg";
import star from "../../assets/star.svg";
import { useMediaQuery } from "@mui/material";

const leftSideBar = [
  { name: "Shop Finder", to: "shopFinder" },
  { name: "Navigations", to: "navigation" },
  { name: "Amenities", to: "amenities" },
  { name: "Customer Services", to: "customerServices" },
  { name: "Events", to: "events" },
];

function Header() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [activeButton, setActiveButton] = useState("Shop");
  const [dayLight, setDayLight] = useState(null);

  const { defaultRoute, setDefaultRoute } = useContext(ContextProvider);

  const currentHour = new Date().getHours();
  const isPortrait = useMediaQuery("(orientation: portrait)");

  const handleTabSwitch = (text) => {
    setDefaultRoute(text);
  };

  useEffect(() => {
    fetch("https://ipinfo.io/json?token=9a4910bcc76590")
      .then((response) => response.json())
      .then((data) => {
        const loc = data.loc.split(",");
        const lat = loc[0];
        const lng = loc[1];
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);

        return fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}`);
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(" Sunrise:", data.results);
        setDayLight(data.results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;

      // Format the date
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const day = now.getDay();
      const date = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const dateString = `${date}, ${days[day]} ${year}`;

      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const isNightTime = () => {
    if (!dayLight) return false;
    const now = new Date();
    const sunrise = new Date(`${now.toDateString()} ${dayLight.sunrise}`);
    const sunset = new Date(`${now.toDateString()} ${dayLight.sunset}`);
    return now < sunrise || now > sunset;
  };

  const handleButtonClick = (page) => {
    setActiveButton(page === activeButton ? null : page);
  };

  return (
    <AppBar position="absolute" color="transparent" sx={{ boxShadow: "none" }}>
      <Container
        maxWidth={true}
        sx={{
          padding: "0 1rem",
          boxShadow: 3,
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontFamily: "monospace",
              fontWeight: 400,
              color: "#ffffff",
              textDecoration: "none",
              fontSize: { xs: "0.75rem", sm: "1rem" },
              background: isNightTime()
                ? "linear-gradient(90deg, #031F40 60%, #FFFFFF 100%)"
                : "linear-gradient(90deg, #0091D9 60%, #FFFFFF 100%)",
              padding: { xs: "5px", sm: "8px", md: "10px", lg: "12px" },
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: { xs: "start", md: "start" },
              textAlign: { xs: "left", md: "left" },
              marginLeft: "-3rem",
              width: isPortrait ? "280px" : "350px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ marginRight: "1rem" }}>
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 400,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    letterSpacing: "0.1rem",
                  }}
                >
                  {currentTime}
                </div>
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 400,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    letterSpacing: "0.1rem",
                  }}
                >
                  {currentDate}
                </div>
              </div>
              <div>
                <img
                  src={isNightTime() ? moon2 : sun}
                  alt="Day/Night Icon"
                  style={{
                    height: isNightTime() ? 65 : 46,
                    width: isNightTime() ? 65 : 46,
                    marginLeft: "1rem",
                  }}
                />
              </div>
            </div>
          </Typography>

          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              spacing={0}
              sx={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <Grid item xs={12} xl={12} lg={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    overflowX: "auto",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                    width: "100%",
                  }}
                >
                  {leftSideBar.map((page) => (
                    <Link
                      key={page.to}
                      to={page.to}
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        sx={{
                          px: 2,
                          mx: 1,
                          color:
                            page.name === defaultRoute ? "#7E1946" : "black",
                          border:
                            page.name === defaultRoute
                              ? "2px solid #7E1946"
                              : "2px solid rgba(217, 217, 217, 1)",
                          whiteSpace: "nowrap",
                          textTransform: "capitalize",
                          fontSize: { xs: "0.75rem", sm: "1.2rem" },
                          letterSpacing: "0.1rem",
                          fontWeight: 400,
                          "&:hover": {
                            border:
                              page.name === defaultRoute
                                ? "2px solid #7E1946"
                                : "2px solid rgba(217, 217, 217, 1)",
                            backgroundColor: "transparent",
                          },
                        }}
                        variant="outlined"
                        onClick={() => handleTabSwitch(page.name)}
                      >
                        {page.name}
                      </Button>
                    </Link>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Toolbar>
      </Container>
      <Outlet />
    </AppBar>
  );
}

export default Header;
