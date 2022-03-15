import {Provider} from 'react-redux'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import App from './App'
import {store} from './features/Store'

test('renders app and starts game properly, then clicks on dice', () => {
    render(
        <Provider store={store}>
            <App />
        </Provider>
    )

    expect(screen.getByText('Mensch ärgere dich nicht!')).toBeInTheDocument()
    expect(screen.getByTestId('select-Yellow')).toHaveFormValues({'Yellow': true, 'radio-Yellow': 'human'})

    userEvent.click(screen.getByTestId('Yellow-computer'))
    userEvent.click(screen.getByLabelText('Yellow'))
    userEvent.click(screen.getByLabelText('Red'))
    userEvent.click(screen.getByLabelText('Green'))

    expect(screen.getByTestId('Yellow-computer')).toBeDisabled()
    expect(screen.getByTestId('start-button')).toBeDisabled()

    userEvent.click(screen.getByLabelText('Green'))

    expect(screen.getByTestId('select-Yellow')).toHaveFormValues({'Yellow': false, 'radio-Yellow': 'computer'})
    expect(screen.getByTestId('start-button')).toBeEnabled()

    userEvent.click(screen.getByTestId('start-button'))
    userEvent.click(screen.getByTestId('dice'))

    expect(screen.getByTestId('dice')).toHaveStyle(`background-color: lightgrey;`)  
})
