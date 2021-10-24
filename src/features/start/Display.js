import styled from 'styled-components'

const DisplayContainer = styled.div`
    width: 50%;
`

export function Display(props){
    return (
        <DisplayContainer>
            <p>{props.text}</p>
        </DisplayContainer>
    )
}