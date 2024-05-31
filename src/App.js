import React, { useState, useEffect } from "react";
import CodeEditor from './components/CodeEditor';
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./pages/Home"
import Potd from "./pages/Potd"
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProblemSolve from "./pages/ProblemSolve";
import Problems from "./pages/Problems";
import Discuss from "./pages/Discuss";
import DisplayPost from "./pages/DisplayPost";
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
      <Route path = "/problems" element={
      <Layout>
      <Problems />
      </Layout>
      }
      />
      <Route path="/solve" element={
        <Layout>
      <ProblemSolve />
      </Layout>}
      />
      <Route path="/discuss" element={
        <Layout>
          <Discuss/>
      </Layout>}
      />
      <Route path="/post" element={
        <Layout>
          <DisplayPost/>
      </Layout>}
      />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
