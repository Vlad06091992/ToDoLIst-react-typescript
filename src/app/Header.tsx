import { AppBar, Button, IconButton, LinearProgress, Toolbar, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "features/auth/auth-selectors";
import { useActions } from "hooks/useActions";
import { authThunks } from "features/auth/auth-reducer";
import { selectStatus } from "app/app-selectors";

export const Header = () => {
  const { initializeAppTC, logout } = useActions(authThunks);
  const logoutHandler = useCallback(() => logout(), []);
  const status = useSelector(selectStatus);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Typography variant="h6">News</Typography>
        {isLoggedIn && (
          <Button color="inherit" onClick={logoutHandler}>
            Log out
          </Button>
        )}
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  );
};
