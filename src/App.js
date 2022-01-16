import styled from 'styled-components'
import {Start} from './features/start/Start.js'
import {Board} from './features/board/Board.js'
import {ExecutiveFunction} from './features/ExecutiveFunction.js'

const AppBody = styled.body`
    background-color: white;
    font-family: Calibri, 'Trebuchet MS', sans-serif;
    box-sizing: border-box;
`

const Header = styled.header`
    font-family: 'Kaushan Script', cursive;
    font-size: 1.3em;
`

const Main = styled.main``

const Footer = styled.footer`
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
