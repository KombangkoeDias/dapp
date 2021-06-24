import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionMovingInfo from "./TransactionMovingInfo";
import $ from "jquery";
import getTransactionsByAccount from "./TransactionQuery";
import styles from "./TransactionMovingInfo.module.css";

const TransactionList = (props) => {
  const [Transactions, setTransactions] = useState([]);
  const [Slices, setSlices] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [showPageMenu, setShowPageMenu] = useState(false);

  useEffect(() => {
    if (props.loaded === true && props.Web3js !== null) {
      props.setProcessed(false);
      processTransactionList(props.txs).then((transactions) => {
        console.log(transactions);
        setTransactions(transactions);
        props.setProcessed(true);
      });
    }
  }, [props.Web3js, props.loaded, props.txs]);

  useEffect(() => {
    sliceTransactionsList();
  }, [Transactions[0]]);

  useEffect(() => {
    if (props.loaded && props.processed) {
      setTimeout(() => setShowPageMenu(true), 2500);
    } else {
      setShowPageMenu(false);
    }
  }, [props.loaded, props.processed]);

  useEffect(() => {
    if (props.getNewTx === true) {
      getNewTransaction();
      props.setGetNewTx(false);
    }
  }, [props.getNewTx]);

  const mapActionToInputs = (action) => {
    switch (action) {
      case "Approve":
        return ["Spender", "Amount"];
      case "Burn":
        return ["Address", "Amount"];
      case "Buy":
        return [];
      case "Sell":
        return ["Amount"];
      case "IncreaseAllowance":
        return ["Spender", "Amount"];
      case "DecreaseAllowance":
        return ["Spender", "Amount"];
      case "Mint":
        return ["Address", "Amount"];
      case "Transfer":
        return ["Receiver", "Amount"];
      case "TransferFrom":
        return ["From", "To", "Amount"];
    }
  };

  const mapActionToParams = (action) => {
    switch (action) {
      case "Approve":
        return ["address", "uint256"];
      case "Burn":
        return ["address", "uint256"];
      case "Buy":
        return [];
      case "Sell":
        return ["uint256"];
      case "IncreaseAllowance":
        return ["address", "uint256"];
      case "DecreaseAllowance":
        return ["address", "uint256"];
      case "Mint":
        return ["address", "uint256"];
      case "Transfer":
        return ["address", "uint256"];
      case "TransferFrom":
        return ["address", "address", "uint256"];
    }
  };

  // const mapActionToColor = (action) => {
  //   switch (action) {
  //     case "Approve":
  //       return "pink";
  //     case "Burn":
  //       return "red";
  //     case "Buy":
  //       return "lightgreen";
  //     case "IncreaseAllowance":
  //       return "aqua";
  //     case "DecreaseAllowance":
  //       return "indigo";
  //     case "Mint":
  //       return "#AAF0D1";
  //     case "Transfer":
  //       return "yellow";
  //     case "TransferFrom":
  //       return "orange";
  //   }
  // };
  // const mapActionToName = (action) => {
  //   switch (action) {
  //     case "approve":
  //       return "Approve";
  //     case "burn":
  //       return "Burn";
  //     case "buy":
  //       return "Buy";
  //     case "increaseAllowance":
  //       return "Increase Allowance";
  //     case "decreaseAllowance":
  //       return "Decrease Allowance";
  //     case "mint":
  //       return "Mint";
  //     case "transfer":
  //       return "Transfer";
  //     case "transferFrom":
  //       return "Transfer From";
  //   }
  // };

  const setPage = (page) => {
    if (page >= 0 && page < Slices.length) {
      setPageNum(page);
    }
  };

  const processTransactionList = async (list) => {
    let Transactions = [];
    for (let i = list.length - 1; i >= 0; i--) {
      try {
        let tx = list[i];
        //console.log(tx);
        var functionName = tx.input.substring(2, 10);
        var paramVals = tx.input.substring(10, tx.input.length);
        var respond = await axios.get(
          "https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/" +
            functionName
        );

        functionName = respond.data;
        var idx = functionName.indexOf("(");
        functionName = functionName.substring(0, idx);
        var paramVals = props.Web3js.eth.abi.decodeParameters(
          mapActionToParams(
            functionName.charAt(0).toUpperCase() + functionName.slice(1)
          ),
          paramVals
        );

        let params = mapActionToInputs(
          functionName.charAt(0).toUpperCase() + functionName.slice(1)
        );

        let obj = {};

        obj["Action"] = functionName;

        for (let j = 0; j < params.length; j++) {
          if (
            params[j] === "Amount" &&
            functionName !== "mint" &&
            functionName !== "burn"
          ) {
            obj[params[j]] = props.Web3js.utils.fromWei(paramVals[j]);
          } else {
            obj[params[j]] = paramVals[j];
          }
        }

        Transactions.push(obj);
        //console.log(obj);

        //console.log(paramVals);
      } catch (err) {
        continue;
      }
    }
    return Transactions;
  };

  const sliceTransactionsList = () => {
    var slices = [];
    for (let i = 0; i < Math.floor(Transactions.length / 5) + 1; ++i) {
      var subslices = [];
      for (let j = 0; j < 5; ++j) {
        if (5 * i + j < Transactions.length) {
          subslices.push(Transactions[5 * i + j]);
        }
      }
      slices.push(subslices);
    }
    //console.log(slices);
    setSlices(slices);
  };

  const caretStyle = (cond) => {
    return cond
      ? { color: "yellow", fontSize: "30px" }
      : { color: "grey", fontSize: "30px" };
  };

  const getNewTransaction = async () => {
    const txs = await getTransactionsByAccount(
      props.Web3js,
      props.currAccount,
      null,
      null
    );
    const processed = await processTransactionList([txs[txs.length - 1]]);
    //const newTxs = <TransactionMovingInfo i={0} tx={processed[0]} id={5} />
    const newTxs = $("#transaction0").clone();
    newTxs.attr("id", "tmp");
    $("#transaction4").hide();
    newTxs.prependTo("#list").animate({ opacity: 1 }, "0.5s", async () => {
      let copyOfTxs = [...Transactions];
      copyOfTxs.unshift(processed[0]);
      console.log(copyOfTxs);
      //console.log(copyOfTxs);
      $("#transaction4 div").removeClass(styles.comein);
      $("#transaction4").show();
      newTxs.hide();
      setTransactions(copyOfTxs);
    });
  };

  return (
    <div className="mt-4">
      {/* <hr style={{ border: "1px solid white" }} /> */}
      <div
        className="row"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <h2 style={{ color: "white" }}>Transactions</h2>
      </div>
      <div
        className="row"
        style={{
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {((!props.loaded && !props.processed) ||
          (props.loaded && !props.processed)) && (
          <React.Fragment>
            <h3 className="mr-2">Loading Transactions</h3>
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </React.Fragment>
        )}
        {Transactions.length === 0 && props.loaded && props.processed && (
          <h2 style={{ color: "white" }}>No Transaction Yet</h2>
        )}
      </div>
      {Transactions.length !== 0 && props.loaded && props.processed && (
        <div id="list">
          {Slices[pageNum].map((tx, i) => {
            return <TransactionMovingInfo i={i} tx={tx} key={i} />;
          })}
        </div>
      )}
      {Transactions.length !== 0 && (
        <div
          className="row mt-3"
          style={{
            justifyContent: "center",
            display: showPageMenu ? "flex" : "none",
          }}
          id="control"
        >
          <div
            className="mr-3"
            type={pageNum >= 2 ? "button" : ""}
            onClick={() => setPage(pageNum - 2)}
            styles={{}}
          >
            <i
              className="fa fa-caret-left"
              style={caretStyle(pageNum >= 2)}
            ></i>
            <i
              className="fa fa-caret-left"
              style={caretStyle(pageNum >= 2)}
            ></i>
          </div>
          <i
            type={pageNum >= 1 ? "button" : ""}
            className="fa fa-caret-left mr-3"
            style={caretStyle(pageNum >= 1)}
            onClick={() => setPage(pageNum - 1)}
          ></i>
          <h4 style={{ color: "white" }}>
            Page {pageNum + 1} out of {Slices.length}
          </h4>
          <i
            type={pageNum < Slices.length - 1 ? "button" : ""}
            className="fa fa-caret-right ml-3"
            style={caretStyle(pageNum < Slices.length - 1)}
            onClick={() => setPage(pageNum + 1)}
          ></i>
          (
          <div
            className="ml-3"
            type={pageNum < Slices.length - 2 ? "button" : ""}
            onClick={() => setPage(pageNum + 2)}
          >
            <i
              className="fa fa-caret-right"
              style={caretStyle(pageNum < Slices.length - 2)}
            ></i>
            <i
              className="fa fa-caret-right"
              style={caretStyle(pageNum < Slices.length - 2)}
            ></i>
          </div>
        </div>
      )}
      {/* <button className="btn btn-primary" onClick={() => Test()}>
        Test
      </button> */}
      <div style={{ visibility: "hidden" }}>
        <TransactionMovingInfo i={0} tx={{ Action: "Tx" }} id="5" />
      </div>
    </div>
  );
};

export default TransactionList;
