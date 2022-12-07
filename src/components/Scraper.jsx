import React, { useEffect, useState } from "react";
import axios from "axios";
import cheerio from "cheerio";
import { FiRefreshCcw as Refresh } from "react-icons/fi";

let portfolio = [];
function getScrape(count, setCount, promiseState, setPromiseState, portfolioExists, setPortfolioExists) {

  portfolio = [];
  setCount(count + 1);

  const arr = [
    [
      // Palantir
      "palantir-aktie@stBoerse_TGT",
      "aktien",
      130,
      false
    ],
    [
      // TTWO
      "take_two-aktie@stBoerse_TGT",
      "aktien",
      5,
      false
    ],
    [
      // LVMH
      "lvmh-aktie@stBoerse_TGT",
      "aktien",
      1,
      false
    ],
    [
      // MT
      "arcelormittal-aktie@stBoerse_TGT",
      "aktien",
      70,
      false
    ],
    [
      // GCE
      "ishares-global-clean-energy-etf-ie00b1xnhc34/tgt",
      "etf",
      150,
      true
    ],
    [
      // HSBC MSCI WORLD
      "hsbc-msci-world-etf-ie00b4x9l533/tgt",
      "etf",
      200,
      true
    ],
    [
      "lyxor-msci-robotics-ai-esg-filtered-etf-lu1838002480/tgt",
      "etf",
      80,
      true
    ],
    [
      "ishares-automation-robotics-etf-ie00byzk4552/tgt",
      "etf",
      60,
      true
    ],
    [
      "ishares-core-msci-world-etf-ie00b4l5y983/tgt",
      "etf",
      25,
      true
    ]
  ];

  const baseURL = "https://web-production-0fb1.up.railway.app/www.finanzen.net/"

  arr.forEach(async function (item, index) {
    const urlParam = item[0];
    let type = item[1];
    const quantity = item[2];
    const isSpecial = item[3];
    const url = baseURL + type + "/" + urlParam;

    let name; let price; let chgabs; let chgrel;

    if (type === "aktien") {
      // define data selectors at target page
      const nameSel = "body > main > section:nth-child(3) > div > div > h2";
      const priceSel = "#snapshot-value-fst-current-0 > span:nth-child(1)";
      const chgAbsSel = "#snapshot-value-fst-absolute-0 > span:nth-child(1)";
      const chgRelSel = "#snapshot-value-fst-relative-0 > span:nth-child(1)";

      // send request
      await axios.get(url).then(({ data }) => {
        const $ = cheerio.load(data);
        name = $(nameSel).text().replace("Aktie", "").trim();
        price = $(priceSel).text().replace(",", ".");
        price = parseFloat(price).toFixed(2);
        chgabs = $(chgAbsSel).text().replace(",", ".").replace("EUR", "").replace("±", "");;
        chgrel = $(chgRelSel).text().replace("%", "").replace("±", "");;
        type = type.toUpperCase();

        const now = new Date();
        const fullDate = ("0" + now.getDate()).slice(-2) + "." + (now.getMonth() + 1) + "." + now.getFullYear() + " at " + ("0" + now.getHours()).slice(-2) + ":" + now.getMinutes();

        return Promise.all([name, price, chgabs, chgrel, fullDate]).then(
          portfolio.push({
            name: name,
            price: price,
            chgabs: chgabs,
            chgrel: chgrel,
            quantity: quantity,
            type: type,
            url: url,
            update: fullDate
          }),
          setPromiseState(promiseState++),
          setPortfolioExists(portfolioExists++)
        );
      });
    }
    if (type === "etf") {
      let chgAbsSel; let chgRelSel;
      if (isSpecial) {
        chgAbsSel = "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > div.table-responsive.quotebox > table:nth-child(1) > tbody > tr:nth-child(1) > td.text-nowrap.text-center.desk-before-absolut-top-19.before-absolut-top-10.red.arrow-red";
        chgRelSel = "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > div.table-responsive.quotebox > table:nth-child(1) > tbody > tr:nth-child(1) > td.mtext-right.dtext-center.text-nowrap.red";
      } else {
        chgAbsSel =
          "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > div.table-responsive.quotebox > table:nth-child(1) > tbody > tr:nth-child(1) > td.text-nowrap.text-center.desk-before-absolut-top-19.before-absolut-top-10.green.arrow-green";
        chgRelSel =
          "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > div.table-responsive.quotebox > table:nth-child(1) > tbody > tr:nth-child(1) > td.mtext-right.dtext-center.text-nowrap.green";
      }
      const nameSel =
        "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > h1";
      const priceSel =
        "body > div.wrapper > div.container.mobile > div.shadow > div.flex-content > div:nth-child(1) > div > div.flex.mobile-flex-dir-col.mtop-10.expand-content-box.snapshot-headline > div.dflex-70.desk-pright-30 > div.table-responsive.quotebox > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(1)";

      // send request
      await axios.get(url).then(({ data }) => {
        const $ = cheerio.load(data);
        name = $(nameSel).text().replace("ETF", "").trim();
        price = $(priceSel).text().replace(",", ".").replace("±", "");
        price = parseFloat(price).toFixed(2);
        chgabs = $(chgAbsSel).text().replace(",", ".").replace("EUR", "").replace("±", "");;
        chgrel = $(chgRelSel).text().replace("%", "").replace("±", "");;
        type = type.toUpperCase();

        const now = new Date();
        const fullDate = ("0" + now.getDate()).slice(-2) + "." + (now.getMonth() + 1) + "." + now.getFullYear() + " at " + ("0" + now.getHours()).slice(-2) + ":" + now.getMinutes();

        return Promise.all([name, price, chgabs, chgrel, fullDate]).then(
          portfolio.push({
            name: name,
            price: price,
            chgabs: chgabs,
            chgrel: chgrel,
            quantity: quantity,
            type: type,
            url: url,
            update: fullDate
          }),
          setPromiseState(promiseState++),
          setPortfolioExists(portfolioExists++)
        );
      })
    }
  });
}

export default function Scraper() {
  const [count, setCount] = useState(0);
  const [promiseState, setPromiseState] = useState(0);
  const [marketState, setMarketState] = useState(false);

  let portfolioStatus = false;

  const [portfolioExists, setPortfolioExists] = useState(0);

  let today = new Date()
  let time = today.getHours();

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
    if (8 >= time < 22) {
      setMarketState(true);
    } else {
      setMarketState(false);
    }
    getScrape(count, setCount, promiseState, setPromiseState, portfolioExists, setPortfolioExists);
    if (portfolioExists < 1) {
      portfolioStatus = false;
    } else {
      portfolioStatus = true;
    }
  }, []);

  let completeAbs = 0;
  let completeTodayAbs = 0;
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  
  console.log(formatter.format(2500)); /* $2,500.00 */
  
  portfolio.forEach(element => {
    completeAbs = completeAbs + (element.price * element.quantity);
    completeTodayAbs = completeTodayAbs + (element.chgabs * element.quantity);
  })
  return (
    <>
      <div className="scraper-ct">
        <h1>My data 👋</h1>
        <button onClick={() => getScrape(count, setCount, promiseState, setPromiseState)}>Refresh <Refresh style={{ marginLeft: "10px" }} /></button>
      </div>
      <div className="scraper-return">
        <div className="scraper-header">
          <div className="scraper-header-cat">
            <span>Total</span>
            <h3>{formatter.format(completeAbs.toFixed(2))}</h3>
          </div>
          <div className="scraper-header-cat">
            <span>Today</span>
            <h3>{(completeTodayAbs.toFixed(2) <= 0 ? "" : "+") + formatter.format(completeTodayAbs.toFixed(2))}</h3>
          </div>
          <h3>
            <span className="pill">{marketState ? "MARKET OPEN" : "MARKET CLOSED 😴"}</span>
          </h3>
        </div>
        <div>
          {
            portfolio.map((item, index) => (
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
                    <span></span>
                    <h3>{formatter.format(item.chgabs)}</h3>
                  </div>
                  <div className="scrape-data-tabs-item">
                    <span></span>
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
                    <h3>{formatter.format((item.quantity * item.price).toFixed(2))}</h3>
                  </div>
                  <div className="scrape-data-tabs-item">
                    <span className="tab-item-header">Today</span>
                    <h3>{formatter.format((item.quantity * item.chgabs).toFixed(2))}</h3>
                  </div>
                </div>
                <code>Last updated: {item.update}</code>
              </div>
            ))
          }
          <div className="error-log">
            <h3>
              {portfolioStatus ? "All items loaded" : "Data unavailable 😢"}
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}
