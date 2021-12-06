import styled from 'styled-components'
import {Start} from './features/start/Start.js'
import {Board} from './features/board/Board.js'
import {ExecutiveFunction} from './features/ExecutiveFunction.js'

const AppBody = styled.body`
  width: 800px;
  background-color: white;
  font-family: Calibri;
  box-sizing: border-box;
`

const Header = styled.header`
  width: 100%;
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
        <Start />
        <Board />
      </Main>
      <Footer>
        <p>Created by Michael Oberst</p>
      </Footer>
      <ExecutiveFunction />
    </AppBody>
  )
}

export default App;
