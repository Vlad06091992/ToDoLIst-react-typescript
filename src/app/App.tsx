import React, { useCallback, useEffect } from "react";
import { TodolistsList } from "../features/TodolistsList/TodolistsList";

import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Login } from "../features/auth/Login";
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { selectIsLoggedIn } from "features/auth/auth-selectors";
import { selectIsInitialized, selectStatus } from "app/app-selectors";
import { ErrorSnackbar } from "common/components";
import { useActions } from "hooks/useActions";
import { authThunks } from "features/auth/auth-reducer";

type PropsType = {
  demo?: boolean;
};

function App({ demo = false }: PropsType) {
  const status = useSelector(selectStatus);
  const isInitialized = useSelector(selectIsInitialized);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const { initializeAppTC, logout } = useActions(authThunks);

  useEffect(() => {
    initializeAppTC();
  }, []);

  const logoutHandler = useCallback(() => logout(), []);

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <ErrorSnackbar />
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
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsList demo={demo} />} />
          <Route path={"/login"} element={<Login />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
