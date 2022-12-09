# finanzen-scraper ✨

finanzen-scraper is React-based web scraper for German financial platform Finanzen.net using Axios (https://axios-http.com/) and cheerio (https://cheerio.js.org/). The backend implements Rob Wu's NodeJS reverse proxy, forked from https://github.com/Rob--W/cors-anywhere. 💖

🔨 WIP Demo: [finance.digitalbando.com](https://finance.digitalbando.com/)

### Build status
[![Netlify Status](https://api.netlify.com/api/v1/badges/dc18a034-295a-4e97-835d-654d416fb645/deploy-status)](https://app.netlify.com/sites/lucky-toffee-34af45/deploys)

---

### Get started 💫

```
git clone https://github.com/noahshotz/finanzen-scraper.git
```
```
cd finanzen-scraper
```
```
npm install
```
```
npm run dev
```

---
### Good to know 🙀

To prevent CORS-related issues, a reverse proxy is needed. This project uses https://github.com/Rob--W/cors-anywhere which is currently hosted on Railway, to prevent malicious a whitelist only accepts requests of certain URLs. If you want to use this package for yourself i recommend to either host cors-anywhere yourself of use a local reverse proxy like https://www.npmjs.com/package/local-cors-proxy. 

I am not affiliated with any of the named external resources.

---

### Something to say about it? 🗣

Open a pull request or message me at info@digitalbando.com

### License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



