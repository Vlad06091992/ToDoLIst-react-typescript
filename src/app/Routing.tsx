import { Container } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { TodolistsList } from "features/TodolistsList/TodolistsList";
import { Login } from "features/auth/Login";
import React from "react";

type PropsType = {
  demo?: boolean;
};

export const Routing = ({ demo = false }: PropsType) => {
  return (
    <Container fixed>
      <Routes>
        <Route path={"/"} element={<TodolistsList demo={demo} />} />
        <Route path={"/login"} element={<Login />} />
      </Routes>
    </Container>
  );
};
