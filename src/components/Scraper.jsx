import React, { useEffect, useState } from "react";
import axios from "axios";
import cheerio from "cheerio";
import { FiRefreshCcw as Refresh } from "react-icons/fi";

let portfolio = [];
function getScrape(count, setCount, promiseState, setPromiseState) {

  portfolio = [];
  setCount(count + 1);

  const arr = [
    [
      // Palantir
      "palantir-aktie@stBoerse_TGT",
      "aktien",
      67
    ],
    [
      // TTWO
      "take_two-aktie@stBoerse_TGT",
      "aktien",
      5
    ],
    [
      // LVMH
      "lvmh-aktie@stBoerse_TGT",
      "aktien",
      1
    ],
    [
      // MT
      "arcelormittal-aktie@stBoerse_TGT",
      "aktien",
      41
    ],
    [
      // GCE
      "ishares-global-clean-energy-etf-ie00b1xnhc34/tgt",
      "etf",
      112
    ],
    [
      // HSBC MSCI WORLD
      "hsbc-msci-world-etf-ie00b4x9l533/tgt",
      "etf",
      143
    ],
    [
      "lyxor-msci-robotics-ai-esg-filtered-etf-lu1838002480/tgt",
      "etf",
      65
    ],
    [
      "ishares-automation-robotics-etf-ie00byzk4552/tgt",
      "etf",
      30
    ],
    [
      "ishares-core-msci-world-etf-ie00b4l5y983/tgt",
      "etf",
      6
    ]
  ];

  const baseURLlocal = "http://localhost:8010/proxy/";
  const baseURL = "https://www.finanzen.net/"

  arr.forEach(async function (item, index) {
    const urlParam = item[0];
    let type = item[1];
    const quantity = item[2];

    const url = baseURL + type + "/" + urlParam;

    let name; let price; let chgabs; let chgrel;

    if (type === "aktien") {
      // define data selectors at target page
      const nameSel = "body > main > section:nth-child(2) > div > div > h2";
      const priceSel = "#snapshot-value-fst-current-0 > span:nth-child(1)";
      const chgAbsSel = "#snapshot-value-fst-absolute-0 > span:nth-child(1)";
      const chgRelSel = "#snapshot-value-fst-relative-0 > span:nth-child(1)";

      // send request
      await axios.get(url, {
        headers: {
          "Access-Control-Allow-Origin": "https://lucky-toffee-34af45.netlify.app/",
          "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        }
      }).then(({ data }) => {
        const $ = cheerio.load(data);
        name = $(nameSel).text().replace("Aktie", "").trim();
        price = $(priceSel).text().replace(",", ".");
        price = parseFloat(price).toFixed(2);
        chgabs = $(chgAbsSel).text().replace(",", ".");
        chgrel = $(chgRelSel).text();
        type = type.toUpperCase();

        return Promise.all([name, price, chgabs, chgrel]).then(
          portfolio.push({
            name: name,
            price: price,
            chgabs: chgabs,
            chgrel: chgrel,
            quantity: quantity,
            type: type,
            url: url,
            update: Date().toLocaleString()
          }),
          setPromiseState(promiseState++),
        );
      });
    }
    if (type === "etf") {
      const nameSel =
        "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > h1";
      const priceSel =
        "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > div.table-responsive.quotebox > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(1)";
      const chgAbsSel =
        "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > div.table-responsive.quotebox > table:nth-child(1) > tbody > tr:nth-child(1) > td.text-nowrap.text-center.desk-before-absolut-top-19.before-absolut-top-10.green.arrow-green";
      const chgRelSel =
        "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > div.table-responsive.quotebox > table:nth-child(1) > tbody > tr:nth-child(1) > td.mtext-right.dtext-center.text-nowrap.green";

      // send request
      await axios.get(url, {
        headers: {
          "Access-Control-Allow-Origin": "https://lucky-toffee-34af45.netlify.app/",
          "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        }
      }).then(({ data }) => {
        const $ = cheerio.load(data);
        name = $(nameSel).text().replace("ETF", "").trim();
        price = $(priceSel).text().replace(",", ".");
        price = parseFloat(price).toFixed(2);
        chgabs = $(chgAbsSel).text().replace(",", ".").replace("EUR", "");
        chgrel = $(chgRelSel).text();
        type = type.toUpperCase();

        return Promise.all([name, price, chgabs, chgrel]).then(
          portfolio.push({
            name: name,
            price: price,
            chgabs: chgabs,
            chgrel: chgrel,
            quantity: quantity,
            type: type,
            url: url,
            update: Date().toLocaleString()
          }),
          setPromiseState(promiseState++),
        );
      })
    }
  });
}

export default function Scraper() {
  const [count, setCount] = useState(0);
  const [promiseState, setPromiseState] = useState(0);
  const [marketState, setMarketState] = useState(false);

  const [portfolioExists, setPortfolioExists] = useState(true);

  let today = new Date()
  let time = today.getHours();

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
    if ( 8 >= time < 22) {
      setMarketState(true);
    } else {
      setMarketState(false);
    }
    getScrape(count, setCount, promiseState, setPromiseState);
    if (portfolio.length == 0) {
      setMarketState(false);
    }
  }, []);

  let completeAbs = 0;
  let completeTodayAbs = 0;
  portfolio.forEach(element => {
    completeAbs = completeAbs + (element.price * element.quantity);
    completeTodayAbs = completeTodayAbs + (element.chgabs * element.quantity);
  })

  return (
    <>
      <div className="scraper-ct">
        <h2>my data 👋</h2>
        <button onClick={() => getScrape(count, setCount, promiseState, setPromiseState)}>Refresh <Refresh style={{ marginLeft: "10px" }} /></button>
      </div>
      <div className="scraper-return">
        <div className="scraper-header">
          <h3>Total: {completeAbs.toFixed(2)} EUR 💰</h3>
          <h3>Today: {(completeTodayAbs.toFixed(2)<=0?"":"+") + completeTodayAbs.toFixed(2)} EUR 📈</h3>
          <h3>
            <span className="pill">{ marketState ? "MARKET OPEN" : "MARKET CLOSED 😴"}</span>
          </h3>
        </div>
        <div>
          {
            portfolio.map((item, index) => (
              <div key={index} className="scrape-data-item">
                <h2>💸 {item.name}</h2>
                <code>{item.url}</code>
                <p className="scrape-data-tabs">
                  <span className="pill">{item.type}</span>
                </p>
                <p className="scrape-data-tabs">
                  <span>Last: {item.price} EUR</span>
                  <span>{item.chgabs} EUR</span>
                  <span>{item.chgrel} %</span>
                </p>
                <p className="scrape-data-tabs">
                  <span>quantity: {item.quantity}</span>
                  <span>total: {(item.quantity * item.price).toFixed(2)} EUR</span>
                  <span>today: {(item.quantity * item.chgabs).toFixed(2)} EUR</span>
                </p>
                <code>Last updated: {item.update}</code>
              </div>
            ))
          }
          <div className="error-log">
            <h3>
              { portfolioExists ? "Data unavailable 😢" : "" }
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}
