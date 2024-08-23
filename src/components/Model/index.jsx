import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Model({ open, handleClose, hasIcon, onSubmitHandler, selectedUnit }) {
  console.log(selectedUnit);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [comments, setComments] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!name) errors.name = "Name is required";
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }
    if (!mobile) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d+$/.test(mobile)) {
      errors.mobile = "Mobile number must be numeric";
    } else if (!/^\d{10}$/.test(mobile)) {
      errors.mobile = "Mobile number must be 10 digits";
    }
    return errors;
  };

  const handleChange = (e, field) => {
    const { value } = e.target;
    switch (field) {
      case "name":
        setName(value);
        if (error.name) setError((prev) => ({ ...prev, name: "" }));
        break;
      case "email":
        setEmail(value);
        if (error.email) setError((prev) => ({ ...prev, email: "" }));
        break;
      case "mobile":
        setMobile(value);
        if (error.mobile) setError((prev) => ({ ...prev, mobile: "" }));
        break;
      case "comments":
        setComments(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    
    const payload = {
      name,
      mobile: Number(mobile),
      email,
      comments,
      source: "Path Finder",
    };

    setLoading(true);
    try {
      console.log("===========")
      await onSubmitHandler(payload);
      setName("");
      setEmail("");
      setMobile("");
      setComments("");
      setError({});
      handleClose();
      toast.success("Submitted successfully", {
        style: { fontSize: '18px', padding: '16px' },
        bodyStyle: { fontSize: '18px' },
      });
    } catch (err) {
      setError({
        submit:
          "An error occurred while submitting your details. Please try again.",
      });
      toast.error("An error occurred while submitting your details. Please try again.", {
        style: { fontSize: '18px', padding: '16px' },
        bodyStyle: { fontSize: '18px' },
      });
    } finally {
      setLoading(false);
    }
  };

  const onCloseHandler = () => {
    handleClose();
    setName("");
    setEmail("");
    setMobile("");
    setError("");
    setComments("");
  };

  return (
    <>
      <Dialog open={open} onClose={onCloseHandler} maxWidth="md" fullWidth>
        <Box>
          <DialogTitle sx={{ padding: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1.5px solid #E3E3E3",
                width: "100%",
                p: 2,
              }}
            >
              <Typography variant="h6">
                {!selectedUnit
                  ? "Feedback Form"
                  : selectedUnit.title || selectedUnit.name}
              </Typography>
              <IconButton edge="end" color="inherit" onClick={onCloseHandler}>
                <CloseIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontSize: "18px" }}>
                {selectedUnit && "Enter your details "}
              </Typography>
              <TextField
                autoFocus
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => handleChange(e, "name")}
                error={!!error.name}
                helperText={error.name}
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
              />
              <TextField
                label="Email ID"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => handleChange(e, "email")}
                error={!!error.email}
                helperText={error.email}
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
              />
              <TextField
                label="Mobile Number"
                type="text"
                fullWidth
                variant="outlined"
                value={mobile}
                onChange={(e) => handleChange(e, "mobile")}
                error={!!error.mobile}
                helperText={error.mobile}
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
              />
              <TextField
                label="Comments"
                type="text"
                fullWidth
                variant="outlined"
                value={comments}
                onChange={(e) => handleChange(e, "comments")}
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
                multiline
                rows={3}
              />
              {error.submit && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  {error.submit}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
            <Button
              type="submit"
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              sx={{
                maxWidth: "20vw",
                backgroundColor: "#7E1946",
                color: "#fff",
                padding: "0.7rem",
                fontSize: "16px",
                "&:hover": {
                  backgroundColor: "#7E1946",
                  boxShadow: "none",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={30} sx={{ color: "#fff" }} />
              ) : (
                "Submit"
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <ToastContainer />
    </>
  );
}

export default Model;
