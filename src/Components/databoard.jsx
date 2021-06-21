import React, { useEffect, useState } from "react";
import "./databoard.css";
const axios = require("axios").default;

export default function Databoard() {
  const [DisplayData, setDisplayData] = useState([]);

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.coingecko.com/api/v3/search/trending",
    })
      .then(function (response) {
        return response.data.coins;
      })
      .then(function (response) {
        return response.map((coin) => {
          return (
            <div className="coin-item" key={coin.item["id"]}>
              {coin.item["name"]}
            </div>
          );
        });
      })
      .then(function (disArr) {
        setDisplayData((prev) => disArr);
      });
  }, []);

  return (
    <div className="datab-parent">
      <div className="title">
        <span>Trending On Coingecko</span>
      </div>
      <div className="par">{DisplayData}</div>;
    </div>
  );
}
