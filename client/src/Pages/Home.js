import React, { useState, useEffect, useCallback } from "react";
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import getWeb3 from "../getWeb3";

function Home(props) {
    // state = { storageValue: 0, web3: null, accounts: null, contract: null , newValue: "" };
    const [storageValue, setStorageValue] = useState("Test")
    const [web3, setWeb3] = useState(null)
    const [accounts, setAccounts] = useState([])
    const [contract, setContract] = useState(null)
    const [newValue, setNewValue] = useState("")

    useEffect(() => {
        try {
            getWeb3()
            .then(web3 => {
                setWeb3(web3);

                web3.eth.getAccounts()
                .then(accounts => {

                    setAccounts(accounts);
                    const contractInstance = new web3.eth.Contract(
                        SimpleStorageContract.abi,
                        '0xe4859E3dd8D92a32FEc2bCDC1ca87d9a4e36d00d',
                        {
                            from: accounts[0],
                            gasPrice: 1000,
                            gas: 100000
                        }
                    );
                    contractInstance.deploy({
                        data: SimpleStorageContract.bytecode,
                        arguments: ["Boss"] // default name
                    });
                    setContract(contractInstance);
                    runExample(contractInstance);
                })

                .catch(e => {
                    console.log("Error getting account: " + e)
                })
            })
            .catch(e => {
                console.log("Error getting web3: " + e);
            })
        } catch (error) {
            console.log(error);
        }

    }, []);

    const handleChange = useCallback(
        (event) => {
            setNewValue(event.target.value)
        },
        [],
    );

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault()
        
            try {
                console.log(newValue)
                await contract.methods.set(newValue).send(newValue, { from: accounts[0]});
            } 
            catch(error) {
                console.log(error)
            }
        
            const response = await contract.methods.get().call();
            setStorageValue(response) 
        },
        [contract, newValue, accounts],
    );   

    const runExample = async (contract) => {
        // Get the value from the contract to prove it worked.
        const response = await contract.methods.get().call();
    
        // Update state with the result.
        setStorageValue(response);
    };


    if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
        <div className="App">
            <h1>Welcome to our Dapp</h1>
            <h2>Re-imagine education...</h2>
            <div>Your name is: {storageValue}</div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={newValue} onChange={handleChange}></input>
                <input type="submit" value="Submit"></input>
            </form>
        
        </div>
    )
    
}

export default Home;