import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Scraper from './components/Scraper'
import './App.css'

function App() {

  return (
    <div className="App">
      <div className="card">
        <p>
          Start proxy server: <code>lcp --proxyUrl https://www.finanzen.net</code>
        </p>
        <Scraper />
      </div>
      <p className="read-the-docs">
        Made possible by digitalbando.com
      </p>
    </div>
  )
}

export default App
