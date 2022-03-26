import "./styles.css";
import { useState } from "react";
import { ethers } from "ethers";
import contractAbi from "./Contract_abi.json";

export default function Simplestore() {
  const contractAddress = `0xb62a7599D4c4Bc8C87b06D4D40f0ACf7B584465b`;

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [currentContractVal, setCurrentContractVal] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWalletHandler = () => {
    //checks if the user has a wallet , ie metamask etc
    if (window.ethereum) {
      // connects your frontend to metamask
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          // sets the address to the first
          accountChangeHandler(result[0]);

          // Changes the state of the button text it is connected!
          setConnButtonText("Wallet Connected!");
        });
    } else {
      setErrorMessage("Please install Metamask browser extension!");
    }
  };

  const accountChangeHandler = (newAccount) => {
    // changes the state of the address of the connected address
    setDefaultAccount(newAccount);
    // sets up the provider ,signer and initiates the contract
    updateEthers();
  };

  const updateEthers = () => {
    // used to allow the calling(provider) and signing of transactions
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const signer = provider.getSigner();
    setSigner(signer);

    // intialize the contract and set the state value to be our contract
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    setContract(contract);
  };
  const getCurrentVal = async () => {
    // we are going to call functions in the smart contract now

    let value = await contract.get();
    setCurrentContractVal(value);
  };

  const setHandler = async (event) => {
    event.preventDefault();

    // connectWalletHandler();
    await contract.set(event.target.setText.value);
  };
  return (
    <div className="App">
      <h3>{"Get/Set Interaction with Contract"} </h3>
      <button onClick={connectWalletHandler}> {connButtonText} </button>
      <h3> Address : {defaultAccount} </h3>
      {/* form to take input to be sent to the SC  */}
      <form onSubmit={setHandler}>
        {/* When submitted , the set function will be called and the storage will change! */}

        <input id="setText" type="text" />
        <button type="submit"> Submit New </button>
      </form>

      <button onClick={getCurrentVal}> Get Current Value </button>
      {currentContractVal}
      {errorMessage}
    </div>
  );
}
