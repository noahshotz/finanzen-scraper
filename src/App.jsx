import Scraper from './components/Scraper'
import './App.css'

function App() {

  return (
    <div className="App">
      <div className="card">
        <Scraper />
      </div>
      <footer>
        <p className="read-the-docs">
          Made possible by <a href="https://digitalbando.com">digitalbando.com</a>
        </p>
        <img
          src="https://api.netlify.com/api/v1/badges/dc18a034-295a-4e97-835d-654d416fb645/deploy-status"
          width={135}
          height={20}
          alt="Netlify deploy status"
        ></img>
      </footer>
    </div>
  )
}

export default App
