import React, { useEffect, useState } from "react";
import axios from "axios";
import cheerio from "cheerio";
import { FiRefreshCcw as Refresh } from "react-icons/fi";
import { FiArrowUpRight as ArrowUp } from "react-icons/fi";
import { FiArrowDownRight as ArrowDown } from "react-icons/fi";

let portfolio = [];

function getScrape(promiseState, setPromiseState) {
  // global vars
  portfolio = [];

  // data array
  const arr = [
    ["palantir-aktie@stBoerse_TGT", "aktien", 130, false],
    ["take_two-aktie@stBoerse_TGT", "aktien", 5, false],
    ["lvmh-aktie@stBoerse_TGT", "aktien", 1, false],
    ["arcelormittal-aktie@stBoerse_TGT", "aktien", 70, false],
    ["ishares-global-clean-energy-etf-ie00b1xnhc34/tgt", "etf", 150, true],
    ["hsbc-msci-world-etf-ie00b4x9l533/tgt", "etf", 200, true],
    ["lyxor-msci-robotics-ai-esg-filtered-etf-lu1838002480/tgt", "etf", 80, true],
    ["ishares-automation-robotics-etf-ie00byzk4552/tgt", "etf", 60, true],
    ["ishares-core-msci-world-etf-ie00b4l5y983/tgt", "etf", 25, true],
  ];

  const proxy = "https://web-production-0fb1.up.railway.app/";
  const target = "www.finanzen.net/";
  const baseURL = proxy + target;

  arr.forEach(async function (item, index) {
    // store values from array as variables
    const urlParam = item[0];
    let type = item[1];
    const quantity = item[2];
    const isSpecial = item[3];
    const url = baseURL + type + "/" + urlParam;

    // initialize export variables
    let name;
    let price;
    let chgabs;
    let chgrel;

    if (type === "aktien") {

      // define data selectors at target page
      const name_selector = [
        "body > main > section:nth-child(2) > div > div > h2",
        "body > main > section:nth-child(3) > div > div > h2"
      ];
      const price_selector = "#snapshot-value-fst-current-0 > span:nth-child(1)";
      const chg_abs_selector = "#snapshot-value-fst-absolute-0 > span:nth-child(1)";
      const chg_rel_selector = "#snapshot-value-fst-relative-0 > span:nth-child(1)";

      // send request
      await axios.get(url).then(({ data }) => {
        const $ = cheerio.load(data);

        name_selector.forEach(elem => {
          if ($(elem).text().length != 0) {
            name = $(elem).text().replace("Aktie", "");
          }
        });

        price = $(price_selector).text().replace(",", ".");
        price = parseFloat(price).toFixed(2);
        chgabs = $(chg_abs_selector)
          .text()
          .replace(",", ".")
          .replace("EUR", "")
          .replace("±", "");
        chgrel = $(chg_rel_selector).text().replace("%", "").replace("±", "");
        type = type.toUpperCase();

        // initialize timestamp of last fetch
        const now = new Date();
        let fullDate = "";
        if ((now.getHours() >= 22) || (now.getHours() >= 0 && now.getHours() <= 8)) {
          fullDate =
            ("0" + now.getDate()).slice(-2) + "." +
            (now.getMonth() + 1) + "." + now.getFullYear() + " at " +
            "22:00";
        } else {
          fullDate =
            ("0" + now.getDate()).slice(-2) + "." +
            (now.getMonth() + 1) + "." +
            now.getFullYear() + " at " +
            ("0" + now.getHours()).slice(-2) + ":" +
            now.getMinutes();
        }

        // wait for all variables to have loaded
        return Promise.all([name, price, chgabs, chgrel, fullDate]).then(
          portfolio.push({
            name: name,
            price: price,
            chgabs: chgabs,
            chgrel: chgrel,
            quantity: quantity,
            type: type,
            url: url,
            update: fullDate,
          }),
          setPromiseState(promiseState++)
        );
      });
    }
    if (type === "etf") {
      let chgRelSel;
      if (isSpecial) {
        chgRelSel =
          "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > div.table-responsive.quotebox > table:nth-child(1) > tbody > tr:nth-child(1) > td.mtext-right.dtext-center.text-nowrap";
      } else {
        chgRelSel =
          "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > div.table-responsive.quotebox > table:nth-child(1) > tbody > tr:nth-child(1) > td.mtext-right.dtext-center.text-nowrap";
      }
      const nameSel =
        "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > h1";

      const priceSelArr = [
        "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > div.table-responsive.quotebox > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(1)"
      ]

      const chgAbsSelArr = [
        "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > div.table-responsive.quotebox > table:nth-child(1) > tbody > tr:nth-child(1) > td.text-nowrap.text-center.desk-before-absolut-top-19.before-absolut-top-10",
        "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > div.table-responsive.quotebox > table:nth-child(1) > tbody > tr:nth-child(1) > td.text-nowrap.text-center.desk-before-absolut-top-19.before-absolut-top-10"
      ]

      // send request
      await axios.get(url).then(({ data }) => {
        const $ = cheerio.load(data);
        name = $(nameSel).text().replace("ETF", "").trim();

        priceSelArr.every(function (elem, index) {
          if ($(elem).text() != "") {
            price = $(elem).text().replace(",", ".").replace("±", "");
            price = parseFloat(price).toFixed(2);
          }
        });

        chgAbsSelArr.every(function (chgAbsSelElem, index) {
          if ($(chgAbsSelElem).text().length != 0) {
            chgabs = $(chgAbsSelElem)
              .text()
              .replace(",", ".")
              .replace("EUR", "")
              .replace("±", "");
          }
        });

        chgrel = $(chgRelSel).text().replace("%", "").replace("±", "");
        type = type.toUpperCase();

        // initialize timestamp of last fetch
        const now = new Date();
        let fullDate = "";
        if ((now.getHours() >= 22) || (now.getHours() >= 0 && now.getHours() <= 8)) {
          fullDate =
            ("0" + now.getDate()).slice(-2) + "." +
            (now.getMonth() + 1) + "." + now.getFullYear() + " at " +
            "22:00";
        } else {
          fullDate =
            ("0" + now.getDate()).slice(-2) + "." +
            (now.getMonth() + 1) + "." +
            now.getFullYear() + " at " +
            ("0" + now.getHours()).slice(-2) + ":" +
            now.getMinutes();
        }

        // wait for all variables to have loaded
        return Promise.all([name, price, chgabs, chgrel, fullDate]).then(
          portfolio.push({
            name: name,
            price: price,
            chgabs: chgabs,
            chgrel: chgrel,
            quantity: quantity,
            type: type,
            url: url,
            update: fullDate,
          }),
          setPromiseState(promiseState++)
        );
      });
    }
  });
}

function getMarketState(marketState, setMarketState) {

  let today = new Date();
  let time = parseInt(today.getHours());

  if (time >= 8 && time <= 22) {
    setMarketState(true);
  } else {
    setMarketState(false);
  }
  return marketState;
}

export default function Scraper() {
  const [promiseState, setPromiseState] = useState(0);
  const [marketState, setMarketState] = useState(true);

  useEffect(() => {
    // Update the document title using the browser API
    document.title = "Tradegate Scraper ✨ digital bando"
    getMarketState(
      marketState,
      setMarketState
    )
    getScrape(
      promiseState,
      setPromiseState,
      marketState,
      setMarketState
    );
  }, []);

  let completeAbs = 0;
  let completeTodayAbs = 0;
  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    signDisplay: 'always'
  });

  portfolio.forEach((element) => {
    completeAbs = completeAbs + element.price * element.quantity;
    completeTodayAbs = completeTodayAbs + element.chgabs * element.quantity;
  });
  return (
    <>
      <div className="scraper-ct">
        <h1>My data 👋</h1>
        <button
          onClick={() => [
            getScrape(
              promiseState,
              setPromiseState
            ), getMarketState(
              marketState,
              setMarketState
            )]
          }
        >
          Refresh <Refresh style={{ marginLeft: "10px" }} />
        </button>
      </div>
      <div className="scraper-return">
        <div className="scraper-header">
          <div className="scraper-header-cat">
            <span>Total</span>
            <h3>{formatter.format(completeAbs.toFixed(2)).replace("+", "")}</h3>
          </div>
          <div className="scraper-header-cat">
            <span>Today</span>
            <h3>
              {formatter.format(completeTodayAbs.toFixed(2))}
              {completeTodayAbs.toFixed(2) <= 0 ? <ArrowDown /> : <ArrowUp />}
            </h3>
          </div>
          <div className="scraper-header-cat">
            <h3>
              <span className="pill">
                {marketState ? "MARKET OPEN 🥳" : "MARKET CLOSED 😴"}
              </span>
            </h3>
          </div>
        </div>
        <div>
          {portfolio.map((item, index) => (
            <div key={index} className="scrape-data-item">
              <h2>💸 {item.name}</h2>
              {/*<code>{item.url}</code>*/}
              <div className="scrape-data-tabs asset-type">
                <span className="pill">{item.type}</span>
              </div>
              <div className="scrape-data-tabs">
                <div className="scrape-data-tabs-item">
                  <span className="tab-item-header">Last</span>
                  <h3>{formatter.format(item.price)}</h3>
                </div>
                <div className="scrape-data-tabs-item">
                  <h3>{formatter.format(item.chgabs)}</h3>
                </div>
                <div className="scrape-data-tabs-item">
                  <h3>{item.chgrel} %</h3>
                </div>
              </div>
              <div className="scrape-data-tabs">
                <div className="scrape-data-tabs-item">
                  <span className="tab-item-header">Quantity</span>
                  <h3>{item.quantity}</h3>
                </div>
                <div className="scrape-data-tabs-item">
                  <span className="tab-item-header">Total</span>
                  <h3>
                    {formatter.format((item.quantity * item.price).toFixed(2)).replace("+", "")}
                  </h3>
                </div>
                <div className="scrape-data-tabs-item">
                  <span className="tab-item-header">Today</span>
                  <h3>
                    {formatter.format((item.quantity * item.chgabs).toFixed(2))}
                  </h3>
                </div>
              </div>
              <code>Last updated: {item.update}</code>
            </div>
          ))}
          <div className="error-log">
            <h3>Data unavailable 😢</h3>
          </div>
        </div>
      </div>
    </>
  );
}
