import { Route, BrowserRouter as Router } from "react-router-dom" 
import React, { useReducer, useEffect} from "react";
import Home from "./Pages/Home"
import About from "./Pages/About"
import NavigationBar from './Components/NavigationBar';
import rootReducer from "./Reducers/rootReducer"
import types from "./Reducers/types"
import getWeb3 from "./getWeb3";

import "./App.css";

function App(props) {
  const initialState = {
    web3: null,
    accounts: [],
    contract: null,
    storageValue: "",
    newValue: ""
  }

  const [state, dispatch] = useReducer(rootReducer, initialState)

  useEffect(() => {
    try {
      getWeb3()
      .then(web3 => {
        dispatch({type: types.UPDATE_WEB3, value: web3})
        web3.eth.getAccounts()
        .then(accounts => {
          dispatch({type: types.UPDATE_ACCOUNTS, value: accounts})
          console.log("state")
          console.log(state)
        })
        .catch(e => {
            console.log("Error getting account: " + e)
        })
      })
    } catch(e) {
      console.log('Error: ' + e)
    }
  }, [])

  return(
    <Router>
        <NavigationBar></NavigationBar>
        <Route exact path="/" render={(props) =><Home {...props} web3={state.web3} accounts={state.accounts}/>}></Route>
        <Route exact path="/about" component={About}></Route>
    </Router>
  );
}

export default App;
