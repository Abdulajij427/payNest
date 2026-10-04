import { useState } from 'react'

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import {Signup} from "./pages/Signup.tsx";
import {Signin} from "./pages/Signin.tsx";
import{Dashboard} from "./pages/Dashboard.tsx";
import {SendMoney} from "./pages/SendMoney.tsx";

import './App.css'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/singin" element={<Signin/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/send" element={<SendMoney/>}/>
        </Routes>
      </BrowserRouter>
    </>
      
  )
}

export default App
