import React, { useState, useEffect } from "react";
import CodeEditor from './components/CodeEditor';
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./pages/Home"
import Potd from "./pages/Potd"
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout >
        <Home/>
      </Layout>}/>
      <Route path = "/Potd" element={
        <Layout>
          <Potd/>
        </Layout>
      } />
      <Route path = "/login" element={
        <Layout>
          <Login/>
        </Layout>
      } />
      <Route path = "/register" element={
        <Layout>
          <Register/>
        </Layout>
      } />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
