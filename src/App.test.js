import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import App from './App.js'
import {Provider} from 'react-redux'
import {store} from './Store.js'

test('renders app and starts game properly, then clicks on dice', () => {
    render(
        <Provider store={store}>
            <App />
        </Provider>
    )

    expect(screen.getByText('Mensch ärgere dich nicht!')).toBeInTheDocument()
    expect(screen.getByTestId('select-yellow')).toHaveFormValues({'yellow': true, 'radio-yellow': 'human'})

    userEvent.click(screen.getByTestId('yellow-computer'))
    userEvent.click(screen.getByLabelText('Yellow'))
    userEvent.click(screen.getByLabelText('Red'))
    userEvent.click(screen.getByLabelText('Green'))

    expect(screen.getByTestId('yellow-computer')).toBeDisabled()
    expect(screen.getByTestId('start-button')).toBeDisabled()

    userEvent.click(screen.getByLabelText('Green'))

    expect(screen.getByTestId('select-yellow')).toHaveFormValues({'yellow': false, 'radio-yellow': 'computer'})
    expect(screen.getByTestId('start-button')).toBeEnabled()

    userEvent.click(screen.getByTestId('start-button'))
    userEvent.click(screen.getByTestId('dice'))

    expect(screen.getByTestId('dice')).toHaveStyle(`background-color: white;`)  
})
