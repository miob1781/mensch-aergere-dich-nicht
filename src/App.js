// import './App.css';
import styled from 'styled-components'

const AppBody = styled.body`
  width: 800px;
  background-color: white;
  font-family: Calibri;
`

const Header = styled.header`
  width: 100%;
  font-size: 1.5em;
`

const Main = styled.main`
  width: 100%;
`

const Footer = styled.footer`
  width: 100%;
  font-size: 0.8em;
`

function App() {
  return (
    <AppBody>
      <Header>
        <h1>Mensch ärgere dich nicht!</h1>
      </Header>
      <Main>

      </Main>
      <Footer>

      </Footer>
    </AppBody>
  )
}

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

export default App;
