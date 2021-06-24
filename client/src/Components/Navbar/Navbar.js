import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import axios from "axios";
import serverURL from "../../config/serverURL";
import { notification } from "antd";
import chainid_kovan from "../../config/chainid";

const Navbar = (props) => {
  const [address, setAddress] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      const respond = await axios.get(serverURL + "/contract/address");
      setAddress(respond.data.address);
    };
    const fetchInfo = async () => {
      const respond = await axios.get(serverURL + "/contract/info");
      setInfo(respond.data);
    };
    fetchAddress();
    fetchInfo();
  }, []);

  // useEffect(() => {
  //   if (props.instance !== null && props.address !== null) {
  //     const fetchBalance = async () => {
  //       const respond = await axios.get(serverURL + "/contract/balanceOf", {
  //         params: { address: props.address },
  //       });
  //       setBalance(respond.data.balanceOf);
  //     };
  //     fetchBalance();
  //   }
  // }, [props.instance, props.address]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand ml-2" href="/" style={{ color: "white" }}>
        Decentralized Application
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          {/* <li className={"nav-item active mr-2 " + styles.linkItem}>
            <a className="nav-link" href="/" style={{ color: "white" }}>
              Home
            </a>
          </li> */}
          {/* <li className={"nav-item "}>
            <a
              className="nav-link disabled"
              href="#"
              style={{ color: "white" }}
            >
              Contract Address : {address === null && "Loading"}
              {address !== null && address}{" "}
            </a>
          </li> */}
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className={"nav-item active "}>
            <div
              className="nav-link mr-2"
              type="button"
              onClick={
                props.address
                  ? () => {
                      navigator.clipboard.writeText(props.address).then(
                        function () {
                          // notification.success({
                          //   message: "Address Copied",
                          //   description: `Address Copied successfully`,
                          //   placement: "topRight",
                          // });
                        },
                        function (err) {
                          // notification.error({
                          //   message: "Cannot Copy Address",
                          //   description: `Address Copied failed`,
                          //   placement: "topRight",
                          // });
                        }
                      );
                    }
                  : () => props.connect()
              }
              title={
                props.address === null
                  ? "Loading..."
                  : "address: " + props.address
              }
              style={{
                width: "150px",
                border: "1px solid white",
                textOverflow: "ellipsis",
                overflowX: "hidden",
                borderRadius: "15px",
                opacity: props.address !== null ? 0.5 : 1,
                backgroundColor:
                  props.address !== null ? "transparent" : "gray",
                textAlign: "center",
              }}
            >
              {props.address !== null && props.address}
              {props.address === null && props.chainid === null
                ? "connect"
                : props.chainid === chainid_kovan
                ? "Loading..."
                : "wrong chain"}
            </div>
          </li>
          <li className={"nav-item active "}>
            <div
              className={"nav-link"}
              style={{ color: "white" }}
              title={
                address === null ? "Loading..." : "contract address: " + address
              }
            >
              {(info === null || props.balance === null) &&
                props.chainid === chainid_kovan &&
                "Loading..."}
              {info !== null &&
                props.balance !== null &&
                props.chainid === chainid_kovan && (
                  <>
                    {" "}
                    {props.balance} ${info.symbol}
                  </>
                )}
              {info !== null && props.chainid !== chainid_kovan && (
                <> ${info.symbol}</>
              )}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
