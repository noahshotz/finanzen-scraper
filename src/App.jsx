import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Scraper from './components/Scraper'
import './App.css'

function App() {

  return (
    <div className="App">
      <div className="card">
        <h1></h1>
        <Scraper />
      </div>
      <footer>
        <p className="read-the-docs">
          Made possible by <a href="digitalbando.com">digitalbando.com</a>
        </p>
        <img src="https://api.netlify.com/api/v1/badges/dc18a034-295a-4e97-835d-654d416fb645/deploy-status"></img>
      </footer>
    </div>
  )
}

export default App
