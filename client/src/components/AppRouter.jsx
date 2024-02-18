import React, {FC, useContext, useState} from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from "./LoginForm";
import ResetPass from './ResetPass';
import ResetPassEmal from './ResetPassEmal';


const AppRouter = () => {
    
    return (
        <Router>
        <Routes>
          <Route path='/login' element={<LoginForm/>}></Route>
          <Route path='/registration' element={<LoginForm/>}></Route>
          <Route path='/reset' element={<ResetPass/>}></Route>
          {/* <Route path='/reset/:link' element={<ResetPassEmal/>}></Route> */}
        </Routes>
        </Router>
    )
    
}

export default AppRouter