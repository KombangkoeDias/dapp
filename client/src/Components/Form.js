import React from "react";
import axios from "axios";
import serverURL from "../config/serverURL";
import styles from "./Form.module.css";
import $ from "jquery";

const customInput = (props) => {
  const createSetStateObject = (e) => {
    const obj = {};
    obj[props.type] = e.target.value;
    return obj;
  };

  return (
    <div
      className="row mt-3"
      style={{
        color: "white",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="col"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <label htmlFor={props.type} className="mr-3 mt-2">
          {props.type}
        </label>
        <input
          id={props.type}
          value={props.value}
          onChange={(e) => props.component.setState(createSetStateObject(e))}
          placeholder={props.type}
          style={{
            width: "50%",
            backgroundColor: "#5e5e61",
            color: "white",
            paddingLeft: "10px",
          }}
        />
      </div>
    </div>
  );
};

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Owner: "",
      Spender: "",
      Amount: "",
      Address: "",
      Receiver: "",
      From: "",
      To: "",
      queryValue: "",
      Txhash: "",
      error: null,
    };
  }

  mapActionToInputs = (action) => {
    switch (action) {
      case "Allowance":
        return ["Owner", "Spender"];
      case "Approve":
        return ["Spender", "Amount"];
      case "Balance Of":
        return ["Address"];
      case "Burn":
        return ["Address", "Amount"];
      case "Buy":
        return [];
      case "Increase Allowance":
        return ["Spender", "Amount"];
      case "Decrease Allowance":
        return ["Spender", "Amount"];
      case "Mint":
        return ["Address", "Amount"];
      case "Transfer":
        return ["Receiver", "Amount"];
      case "Transfer From":
        return ["From", "Amount"];
    }
  };

  mapActionToQueryType = (action) => {
    switch (action) {
      case "Allowance":
        return "call";
      case "Approve":
        return "send";
      case "Balance Of":
        return "call";
      case "Burn":
        return "send";
      case "Buy":
        return "send";
      case "Increase Allowance":
        return "send";
      case "Decrease Allowance":
        return "send";
      case "Mint":
        return "send";
      case "Transfer":
        return "send";
      case "Transfer From":
        return "send";
    }
  };

  makeQuery = (action) => {
    if (action === "Allowance") {
      axios
        .get(serverURL + "/contract/allowance", {
          params: { owner: this.state.Owner, spender: this.state.Spender },
        })
        .then((respond) => {
          this.setState(
            {
              queryValue: respond.data.allowance,
              error: null,
              Txhash: "",
            },
            () => {
              $("#call").addClass(styles.comein);
              setTimeout(() => {
                $("#call").removeClass(styles.comein);
              }, 1000);
            }
          );
        });
    } else if (action === "Balance Of") {
      axios
        .get(serverURL + "/contract/balanceOf", {
          params: { address: this.state.Address },
        })
        .then((respond) => {
          this.setState(
            {
              queryValue: respond.data.balanceOf,
              error: null,
              Txhash: "",
            },
            () => {
              $("#call").addClass(styles.comein);
              setTimeout(() => {
                $("#call").removeClass(styles.comein);
              }, 1000);
            }
          );
        });
    }
  };

  makeCall = (action) => {
    const errString =
      "Error: Error: [ethjs-query] while formatting outputs from RPC '";
    const getjsonError = (err) => {
      const jsonError = err.stack.substring(
        errString.length,
        err.stack.length - 1
      );
      const json = JSON.parse(jsonError);
      const errdata = json.value.data.data;
      for (const key in errdata) {
        if (errdata[key].error === "revert") {
          console.log("Error : " + errdata[key].reason + "\n");
          this.setState({ error: "Error : " + errdata[key].reason }, () => {
            $("#error").addClass(styles.comein);
            setTimeout(() => {
              $("#error").removeClass(styles.comein);
              $("#error").addClass(styles.goout);
              setTimeout(() => {
                $("#error").removeClass(styles.goout);
                this.setState({ error: null });
              }, 1000);
            }, 5000);
          });
          //throw "Error : " + errdata[key].reason;
        }
      }
    };

    const setTransaction = (hash) => {
      this.setState({ Txhash: hash, error: null, queryValue: "" }, () => {
        $("#success").addClass(styles.comein);
        setTimeout(() => {
          $("#success").removeClass(styles.comein);
          $("#success").addClass(styles.goout);
          setTimeout(() => {
            $("#success").removeClass(styles.goout);
            this.setState({ Txhash: "" });
          }, 1000);
        }, 5000);
      });
    };
    try {
      switch (action) {
        case "Approve":
          this.props.instance
            .approve(
              this.props.address,
              this.state.Spender,
              parseFloat(this.state.Amount)
            )
            .then((hash) => {
              console.log(hash);
              setTransaction(hash);
              this.props.getNewTransaction();
            })
            .catch((err) => {
              getjsonError(err);
            });
          return;
        case "Burn":
          this.props.instance
            .burn(
              this.state.Address,
              parseFloat(this.state.Amount),
              this.props.address
            )
            .then((hash) => {
              console.log(hash);
              setTransaction(hash);
              this.props.fetchBalance();
              this.props.getNewTransaction();
            })
            .catch((err) => {
              getjsonError(err);
            });
          return;
        case "Buy":
          return;
        case "Increase Allowance":
          this.props.instance
            .increaseAllowance(
              this.props.address,
              this.state.Spender,
              parseFloat(this.state.Amount)
            )
            .then((hash) => {
              console.log(hash);
              setTransaction(hash);
              this.props.getNewTransaction();
            })
            .catch((err) => {
              getjsonError(err);
            });
          return;
        case "Decrease Allowance":
          this.props.instance
            .decreaseAllowance(
              this.props.address,
              this.state.Spender,
              parseFloat(this.state.Amount)
            )
            .then((hash) => {
              console.log(hash);
              setTransaction(hash);
              this.props.getNewTransaction();
            })
            .catch((err) => {
              getjsonError(err);
            });
          return;
        case "Mint":
          this.props.instance
            .mint(
              this.state.Address,
              parseFloat(this.state.Amount),
              this.props.address
            )
            .then((hash) => {
              console.log(hash);
              setTransaction(hash);
              this.props.fetchBalance();
              this.props.getNewTransaction();
            })
            .catch((err) => {
              getjsonError(err);
            });
          return;
        case "Transfer":
          this.props.instance
            .transfer(
              this.props.address,
              this.state.Receiver,
              parseFloat(this.state.Amount)
            )
            .then((hash) => {
              console.log(hash);
              setTransaction(hash);
              this.props.fetchBalance();
              this.props.getNewTransaction();
            })
            .catch((err) => {
              getjsonError(err);
            });

          return;
        case "Transfer From":
          this.props.instance
            .transferFrom(
              this.state.From,
              this.props.address,
              parseFloat(this.state.Amount)
            )
            .then((hash) => {
              console.log(hash);
              setTransaction(hash);
              this.props.fetchBalance();
              this.props.getNewTransaction();
            })
            .catch((err) => {
              getjsonError(err);
            });

          return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.action !== this.props.action) {
      this.setState({ queryValue: "", Txhash: "", error: null });
    }
  }

  render() {
    const Inputs = this.mapActionToInputs(this.props.action);

    if (this.props.instance === null) {
      return <h4>No Web3 detected</h4>;
    }

    return (
      <React.Fragment>
        {Inputs.map((type) => (
          <div key={type}>
            {customInput({
              type: type,
              value: this.state[type],
              component: this,
            })}
          </div>
        ))}
        {this.mapActionToQueryType(this.props.action) === "send" && (
          <div
            className="row"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button
              className="btn btn-secondary mt-4"
              onClick={() => this.makeCall(this.props.action)}
            >
              Execute
            </button>
          </div>
        )}
        {this.mapActionToQueryType(this.props.action) === "call" && (
          <React.Fragment>
            <div
              className="row"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button
                className="btn btn-secondary mt-4"
                onClick={() => this.makeQuery(this.props.action)}
              >
                Query
              </button>
            </div>
          </React.Fragment>
        )}
        {this.state.Txhash === "" &&
          this.state.error === null &&
          this.state.queryValue === "" && (
            <div
              className="row mt-3"
              style={{
                color: "lightgreen",
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
              id="placeholder"
            >
              <p style={{ color: "transparent" }}>Placeholder</p>
            </div>
          )}
        {this.state.queryValue !== "" && (
          <div
            className="row mt-3"
            style={{
              display: "flex",
              justifyContent: "center",
              color: "lightgreen",
              position: "relative",
            }}
            id="call"
          >
            {this.props.action === "Balance Of" && (
              <p>
                {"Balance of address " +
                  this.state.Address +
                  " is " +
                  this.state.queryValue +
                  " $WIN"}
                <br />
              </p>
            )}{" "}
            {this.props.action === "Allowance" && (
              <p>
                {"Allowance from " +
                  this.state.Owner +
                  " to " +
                  this.state.Spender +
                  " is " +
                  this.state.queryValue +
                  " $WIN"}
              </p>
            )}
          </div>
        )}

        {this.state.Txhash !== "" &&
          this.mapActionToQueryType(this.props.action) === "send" &&
          this.state.error === null && (
            <div
              className="row mt-3"
              style={{
                color: "lightgreen",
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
              id="success"
            >
              <p>
                Successfully {this.props.action}. Transaction hash :{" "}
                {this.state.Txhash}
              </p>
            </div>
          )}
        {this.state.error !== null && (
          <div
            className="row mt-3"
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
            id="error"
          >
            <p style={{ color: "red" }}>{this.state.error}</p>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Form;
