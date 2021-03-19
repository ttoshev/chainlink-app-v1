
import { Route, BrowserRouter as Router } from "react-router-dom" 
import React from "react";
import Home from "./Pages/Home"
import About from "./Pages/About"

import "./App.css";

function App(props) {
  return(
    <Router>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/about" component={About}></Route>
    </Router>
  );
}

export default App;
