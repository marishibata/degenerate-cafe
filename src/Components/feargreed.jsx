import React, { useState, useEffect } from "react";
import "./feargreed.css";
const axios = require("axios").default;

export default function FearGreed(props) {
  const [FGIndexFinal, setFGIndexFinal] = useState(0);
  const [FGRanking, setFGRanking] = useState("Loading");
  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.alternative.me/fng/",
    }).then((data) => {
      setFGIndexFinal(data.data.data[0].value);
      setFGRanking(data.data.data[0].value_classification);
    });
  }, []);


  return (
    <div className="fear-greed">
      <div className="title">
        <span>Today's Cryptocurrency Fear And Greed Index</span>
      </div>
      <div className="fear-greed-title">How high are we...</div>
      <div className="fear-greed-number">{FGIndexFinal}</div>
      <div className="fear-greed-title">We're feeling...</div>
      <div className="fear-greed-number">{FGRanking}</div>
    </div>
  );
}
