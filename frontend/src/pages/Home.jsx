import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth.jsx";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Button, IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);
  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  return (
    <>
      <div className="navBar">
        <div className="navLeft">
          <h2 className="brand">Apna Video Call</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => {
                navigate("/history");
              }}
            >
              <RestoreIcon sx={{ color: "white" }} />
            </IconButton>
            <p className="nav-text">History</p>
          </div>

          <Button
            className="logoutBtn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="meetContainer">
        <div className="leftPanel">
          <h1 className="title">High-Quality Video Calls</h1>
          <p className="subtitle">
            Fast, reliable, and simple — just enter your code.
          </p>

          <div className="joinBox">
            <TextField
              onChange={(e) => setMeetingCode(e.target.value)}
              value={meetingCode}
              label="Meeting Code"
              variant="outlined"
              fullWidth
              sx={{
                backgroundColor: "transparent !important",
                borderRadius: "6px",

                // Remove background even when focused
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "transparent !important",
                },

                "& .MuiOutlinedInput-root.Mui-focused": {
                  backgroundColor: "transparent !important",
                },

                // Input text color
                "& .MuiInputBase-input": {
                  color: "white",
                  backgroundColor: "transparent !important",
                },

                // Label color
                "& .MuiInputLabel-root": {
                  color: "white",
                },

                // Border color default
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },

                // Border on hover
                "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "white",
                  },

                // Border on focus
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "white",
                  },
              }}
            />

            <Button
              variant="contained"
              onClick={handleJoinVideoCall}
              className="joinBtn"
            >
              Join
            </Button>
          </div>
        </div>

        <div className="rightPanel">
          <img src="/logo3.png" alt="" className="heroImage" />
        </div>
      </div>
    </>
  );
}

export default withAuth(HomeComponent);
