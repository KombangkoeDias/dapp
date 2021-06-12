import React, { useState } from "react";
import styles from "./TransactionMovingInfo.module.css";

const TransactionMovingInfo = (props) => {
  const move = props.i;
  const [timeToMove, setTimeToMove] = useState(false);

  setTimeout(() => {
    setTimeToMove(true);
  }, move * 500);

  const mapActionToColor = (action) => {
    switch (action) {
      case "Approve":
        return "pink";
      case "Burn":
        return "red";
      case "Buy":
        return "lightgreen";
      case "IncreaseAllowance":
        return "aqua";
      case "DecreaseAllowance":
        return "indigo";
      case "Mint":
        return "#AAF0D1";
      case "Transfer":
        return "yellow";
      case "TransferFrom":
        return "orange";
    }
  };
  const mapActionToName = (action) => {
    switch (action) {
      case "approve":
        return "Approve";
      case "burn":
        return "Burn";
      case "buy":
        return "Buy";
      case "increaseAllowance":
        return "Increase Allowance";
      case "decreaseAllowance":
        return "Decrease Allowance";
      case "mint":
        return "Mint";
      case "transfer":
        return "Transfer";
      case "transferFrom":
        return "Transfer From";
    }
  };
  const mapActionToIcon = (action) => {
    switch (action) {
      case "approve":
        return <i className="fa fa-gavel" style={{ color: "pink" }}></i>;
      case "burn":
        return <i className="fa fa-fire" style={{ color: "red" }}></i>;
      case "buy":
        return;
      case "increaseAllowance":
        return <i className="fa fa-chevron-up" style={{ color: "aqua" }}></i>;
      case "decreaseAllowance":
        return (
          <i className="fa fa-chevron-down" style={{ color: "indigo" }}></i>
        );
      case "mint":
        return <i className="fa fa-magic" style={{ color: "#AAF0D1" }}></i>;
      case "transfer":
        return (
          <i className="fa fa-paper-plane" style={{ color: "yellow" }}></i>
        );
      case "transferFrom":
        return (
          <i
            className="fa fa-angle-double-left"
            style={{ color: "orange" }}
          ></i>
        );
    }
  };

  return (
    <div
      key={props.i}
      style={{
        position: "relative",
        display: timeToMove ? "block" : "none",
      }}
      id={"transaction" + props.i}
      className="mb-2"
    >
      <div
        className={"row ml-2 mr-2 " + styles.comein}
        style={{
          border:
            "2px solid " +
            mapActionToColor(
              props.tx.Action.charAt(0).toUpperCase() + props.tx.Action.slice(1)
            ),
          paddingTop: "10px",
          paddingBottom: "10px",
          borderRadius: "10px",
          backgroundColor: "#5e5e61",
        }}
      >
        {Object.keys(props.tx).map((field, i) => {
          return (
            <div
              className="col-3"
              key={i}
              style={{
                textOverflow: "ellipsis",
                overflowX: "hidden",
                color: "white",
              }}
            >
              {field} :{" "}
              {field === "Action" ? (
                <>
                  {" "}
                  {mapActionToName(props.tx[field])}{" "}
                  {mapActionToIcon(props.tx[field])}{" "}
                </>
              ) : (
                props.tx[field]
              )}{" "}
              {field === "Amount" ? " $WIN" : ""}
            </div>
          );
        })}
      </div>
      {/* <hr style={{ border: "1px solid white" }} /> */}
    </div>
  );
};

export default TransactionMovingInfo;
