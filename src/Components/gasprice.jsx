import React from "react";
import useWebSocket from "react-use-websocket";
import "./gasprice.css";

export default function GasPrice(props) {
  const socketUrl = "wss://www.gasnow.org/ws/gasprice";
  const { lastMessage } = useWebSocket(socketUrl);

  function generateDivs() {
    return (
      <>
        <div className="gas-title">Gas Prices</div>
        <div>
          Fast: {Math.round(JSON.parse(lastMessage.data).data.fast / 10e8)}
        </div>
        <div>
          Standard: {Math.round(JSON.parse(lastMessage.data).data.standard / 10e8)}
        </div>
        <div>
          Slow: {Math.round(JSON.parse(lastMessage.data).data.slow / 10e8)}
        </div>
      </>
    );
  }

  return (
    <div class="par-gas">{!lastMessage ? <p>loading</p> : generateDivs()} </div>
  );
}
