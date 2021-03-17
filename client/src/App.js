import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null , newValue: "" };

  componentDidMount = async () => {
    try {
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
     
      // Get the contract instance.
      var contractInstance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        '0xe4859E3dd8D92a32FEc2bCDC1ca87d9a4e36d00d',
        {
          from: accounts[0],
          gasPrice: 1000,
          gas: 100000
        }
      )

      contractInstance.deploy({
        data: SimpleStorageContract.bytecode,
        arguments: ["Boss"] // default name
      })

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: contractInstance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log(error);
    }
  };

  handleChange(event) {
    this.setState({newValue: event.target.value})
  }

  async handleSubmit(event) {
    event.preventDefault()

    const { accounts, contract } = this.state;
    try {
      console.log(this.state.newValue)
      await contract.methods.set(this.state.newValue).send(this.state.newValue, { from: accounts[0]});
    } 
    catch(error) {
      console.log(error)
    }

    const response = await contract.methods.get().call();
    this.setState({storageValue: response});

  }

  runExample = async () => {
    const { contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Welcome to our Dapp</h1>
        <h2>Re-imagine education...</h2>
        <div>Your name is: {this.state.storageValue}</div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.newValue} onChange={this.handleChange.bind(this)}></input>
          <input type="submit" value="Submit"></input>
        </form>
      
      </div>
    );
  }
}

export default App;
