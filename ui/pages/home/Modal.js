import React from 'react';

import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

export default class extends React.Component {
    
    state = {
        title: ``,
        latitude: 0,
        longitude: 0,
    }

    componentWillReceiveProps(newProps){
        const data = newProps.data || {}
        const newId = data.id
        const oldId = (this.props.data || {}).id
        
        if(newId !== oldId)
            this.setState({
                title: data.title || '',
                latitude: data.latitude || 0,
                longitude: data.longitude || 0,
            })
    }

    render(){

        return (

            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.isOpen}
                // onClose={handleClose}
                style={{
                    margin: `auto`,
                    maxWidth: `40vw`,
                    minHeight: `10vw`,
                    maxHeight: `80vh`,
                }}
            >
                <StyledPaper>
                    <form noValidate autoComplete="off">
                        <TextField
                            id="title"
                            label="Title"
                            value={this.state.title}
                            onChange={e => this.setState({ title: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            id="position-x"
                            label="Latitude"
                            value={this.state.latitude}
                            onChange={e => this.setState({ latitude: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            id="position-y"
                            label="Longitude"
                            value={this.state.longitude}
                            onChange={e => this.setState({ longitude: e.target.value })}
                            margin="normal"
                        />

                        <Divider component="div"/>

                        <Buttons>
                            <Button onClick={this.props.handleClose}>Cancel</Button>
                            <Button onClick={e => this.props.handleSubmit(this.state)}>Save</Button>
                        </Buttons>
                    </form>
                </StyledPaper>
            </Modal>
        )
    }
}

import styled from 'styled-components'

const StyledPaper = styled(Paper)`
    padding: .5rem;
    form {

        display: flex;
        flex-direction: column;
    }
`
const Buttons = styled.div`
    display: flex;
`