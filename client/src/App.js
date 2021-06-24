import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import serverURL from "./config/serverURL";
import Navbar from "./Components/Navbar/Navbar";
import Select from "react-select";
import web3 from "web3";
import Contract from "./ContractClass/Contract";
import WINcoin from "./WINcoin/WincoinUp";
import Form from "./Components/Form";
import $ from "jquery";
import getTransactionsByAccount from "./Transaction/TransactionQuery";
import TransactionList from "./Transaction/TransactionList";
import { notification } from "antd";
import contractAddress from "./config/contractAddress";
import chainid_kovan from "./config/chainid";

function App() {
  const [action, setAction] = useState("Transfer");
  const [Web3js, setWeb3js] = useState(null);
  const [instance, setInstance] = useState(null);
  const [currAccount, setCurrAccount] = useState(null);
  const [options, setOptions] = useState([
    { value: "Allowance", label: "Allowance" },
    { value: "Approve", label: "Approve" },
    { value: "Balance Of", label: "Balance Of" },
    { value: "Burn", label: "Burn" },
    { value: "Buy", label: "Buy" },
    { value: "Decrease Allowance", label: "Decrease Allowance" },
    { value: "Increase Allowance", label: "Increase Allowance" },
    { value: "Mint", label: "Mint" },
    { value: "Transfer", label: "Transfer" },
    { value: "Transfer From", label: "Transfer From" },
    { value: "Sell", label: "Sell" },
  ]);
  const [chainid, setChainid] = useState(null);
  const [height, setHeight] = useState($(document).height());
  const [Balance, setBalance] = useState(null);
  const [tsx, setTxs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [coolDown, setCoolDown] = useState(true);
  const [getNewTx, setGetNewTx] = useState(false);

  // connect Metamask
  useEffect(() => {
    //console.log(web3.givenProvider);
    connect();
  }, [window.web3]);

  const getNewTransaction = () => {
    setGetNewTx(true);
  };

  const fetchBalance = async () => {
    const respond = await axios.get(serverURL + "/contract/balanceOf", {
      params: { address: currAccount },
    });
    setBalance(respond.data.balanceOf);
  };

  const loadTransaction = async () => {
    setLoaded(false);
    setProcessed(false);
    if (Web3js !== null && currAccount !== null) {
      const txs = await getTransactionsByAccount(Web3js, currAccount, 0, null);
      setTxs(txs);
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (instance !== null && currAccount !== null) {
      fetchBalance();
    }
  }, [instance, currAccount]);

  useEffect(() => {
    if (currAccount !== null && chainid === chainid_kovan) {
      loadTransaction();
    }
  }, [currAccount, chainid]);

  const connect = () => {
    if (window.web3) {
      setWeb3js(new web3(window.web3.currentProvider));
      window.ethereum.enable();
    } else {
      setWeb3js(new web3("http://localhost:7545"));
    }
  };

  // constantly checking for update
  useEffect(() => {
    setInterval(() => {
      if (Web3js !== null) {
        Web3js.eth.net.getId().then((chainid) => {
          if (chainid === chainid_kovan) {
            // local testnet 5777
            Web3js.eth.getAccounts((error, result) => {
              if (error) {
                console.log(error);
              } else {
                if (result[0] !== currAccount) {
                  setCurrAccount(result[0]);
                }
              }
            });
          } else {
            setCurrAccount(null);
          }
          setChainid(chainid);
        });
      }
    }, 100);
  });

  const modal = (
    <div
      className="modal fade"
      id="exampleModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">
              Modal title
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">...</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const makeSubscription = () => {
    Web3js.eth.subscribe(
      "logs",
      {
        address: "0x6400bE5392B82Aabd9845FBDB37C28A8703A553D",
      },
      async () => {
        if (coolDown) {
          console.log("some event happened");
          // await fetchBalance();
          //await loadTransaction();
          setCoolDown(false);
          setTimeout(() => {
            setCoolDown(true);
          }, 5000);
        }
      }
    );
  };

  // load contract once connect to metamask
  useEffect(() => {
    const loadContract = async () => {
      if (Web3js !== null) {
        const the_instance = new Contract(
          {
            abi: WINcoin.abi,
            address: contractAddress,
          },
          Web3js
        );
        return the_instance;
      } else {
        return false;
      }
    };

    loadContract().then((contract) => {
      if (contract) {
        //console.log(contract);
        // contract.contract
        //   .getPastEvents("allEvents", { fromBlock: 0, toBlock: "latest" })
        //   .then((events) => console.log(events))
        //   .catch((err) => console.error(err));
        setInstance(contract);
      }
    });
  }, [Web3js, currAccount]);

  useEffect(() => {
    $(document).on("resize", () => {
      setHeight($(document).height());
    });
  }, []);

  useEffect(() => {
    if (Web3js !== null) {
      makeSubscription();
    }
  }, [Web3js]);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#5e5d61",
      // match with the menu
      // Overwrittes the different states of border
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      color: "white ",
      "&:hover": {
        // Overwrittes the different states of border
        borderColor: "#e40c5a",
      },
    }),
    singleValue: (style) => ({
      ...style,
      color: "white",
    }),
    menu: (base) => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0,
      color: "white",
      backgroundColor: "#5e5d61",
    }),
  };

  return (
    <div
      style={{
        //backgroundColor: "#1c1c1c",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1496065187959-7f07b8353c55?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
        backgroundSize: "cover",
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Navbar
        balance={Balance}
        fetchBalance={() => fetchBalance()}
        address={currAccount}
        connect={() => connect()}
        instance={instance}
        chainid={chainid}
      />
      <div
        className="row mt-3"
        style={{
          display: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "50%" }}>
          <Select
            options={options}
            value={{ value: action, label: action }}
            onChange={(e) => setAction(e.value)}
            styles={customStyles}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: "#1c1c1c",
                primary: "#e40c5a",
                primary50: "#e40c5a",
              },
            })}
          />
        </div>
        <br />
      </div>

      <Form
        action={action}
        instance={instance}
        address={currAccount}
        fetchBalance={() => fetchBalance()}
        loadTransaction={() => loadTransaction()}
        getNewTransaction={() => getNewTransaction()}
      />

      <TransactionList
        txs={tsx}
        Web3js={Web3js}
        loaded={loaded}
        processed={processed}
        setProcessed={(value) => setProcessed(value)}
        currAccount={currAccount}
        getNewTx={getNewTx}
        setGetNewTx={(val) => setGetNewTx(val)}
      />

      {/* <button
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModalCenter"
      >
        Launch demo modal
      </button>
      {() => modal} */}
    </div>
  );
}

export default App;
