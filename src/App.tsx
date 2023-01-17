import styled from 'styled-components'
import {Start} from './features/start/Start'
import {Board} from './features/board/Board'
import {ExecutiveFunction} from './features/ExecutiveFunction'
import KaushanScriptWoff from './assets/fonts/kaushan-script-v14-latin-regular.woff'
import KaushanScriptWoff2 from './assets/fonts/kaushan-script-v14-latin-regular.woff2'

const AppBody = styled.div`
    background-color: white;
    font-family: Calibri, 'Trebuchet MS', sans-serif;
    box-sizing: border-box;
`
// TO DO: Find a way to avoid the flickering (reloading of the font?) of the heading.
// Update: This problem does not occur in production.
const Header = styled.header`

    /* kaushan-script-regular - latin */
    @font-face {
        font-family: 'Kaushan Script';
        font-style: normal;
        font-weight: 400;
        src:
            local(''),
            url(${KaushanScriptWoff2}) format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
            url(${KaushanScriptWoff}) format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
        font-display: fallback;
    }

    font-family: 'Kaushan Script', cursive;
    font-size: 1.3em;
    display: flex;
    justify-content: center;
`

const Main = styled.main`
    @media only screen and (min-width: 601px) {
        display: flex;
        justify-content: center;
    }
`

const Footer = styled.footer`
    font-size: 0.8em;
    text-align: center;
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
