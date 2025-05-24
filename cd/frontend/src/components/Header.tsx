import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLinks";

const Header = () => {
  const auth = useAuth();
  return (
    <AppBar
      sx={{ bgcolor: "transparent", position: "static", boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex" }}>
        <div>
          {auth?.isLoggedIn ? (
            <>
              <NavigationLink
                bg="#00fffc"
                to="/chat"
                text="Go To Chat"
                textColor="black"
              />
              <NavigationLink
                bg="#51538f"
                to="/mood"
                text="Mood Tracker"
                textColor="white"
              />
              <NavigationLink
                bg="#00fffc"
                to="/journal"
                text="Journal"
                textColor="black"
              />
              <NavigationLink
                bg="#51538f"
                textColor="white"
                to="/"
                text="logout"
                onClick={auth.logout}
              />
            </>
          ) : null}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
