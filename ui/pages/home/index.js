import React from 'react';
import fetch from 'isomorphic-unfetch'



import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'; 

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import Modal from './Modal';

const DBUG = false


const extendedFetch = (url, params) => new Promise((resolve, reject) => {
  fetch(url, params)
  .then(res => {
        
    if(res.ok) 
      return resolve(res.json())
    res.json().then(d => reject(d.error))
  })
}) 

import io from 'socket.io-client'

const MARKER_LIMIT = 10

class Page extends React.Component {

  state = {
    isOpenModalAdd: false,
    isOpenModalUpdate: false,
    isCollapsedInfo: false,

    teslaId: null,
    error: null,
  }

  componentDidMount(){
    import('./CanvasController').then(m => {
      this.CanvasInstance = new m.default()
      this.CanvasInstance.init({
        markers: this.props.teslas, 
        canvasRef: this.canvasRef, 
        clickHandler: this.handleTeslaClick
      })

      this.forceUpdate()
    })

    import('simple-web-notification')
    .then(r => {
      this.webNotification = r.default
    })


    // #region socket
    this.Socket = io.connect(process.env.SOCKET_URI)

    this.Socket.on('COLOR_CHANGE', list => {
      DBUG && console.log('COLOR_CHANGE') 
      
      list.forEach(l => { 
        if(this.CanvasInstance)
          this.CanvasInstance.updateMarker(l)
      })
      this.forceUpdate()
    })

    this.Socket.on('ADD', tesla => {
      DBUG && console.log('ADD')
      tesla = JSON.parse(tesla)
      this.CanvasInstance.addMarker(tesla)

      if(this.CanvasInstance.getMarkers().length > MARKER_LIMIT) 
        this.webNotification.showNotification('Example Notification', {
          body: `You added too many markers. Keep it closer to ${MARKER_LIMIT}`,
          autoClose: 4000
        }, (error, hide) => {
          if (error)
              return console.log(`Unable to show notification: ${error.message}`);        
          setTimeout(hide, 5000); 
        });
    })
    this.Socket.on('UPDATE', tesla => {
      DBUG && console.log('UPDATE')
      tesla = JSON.parse(tesla)
  
      this.CanvasInstance.updateMarker(tesla)
    })
    this.Socket.on('REMOVE', tesla => {
      DBUG && console.log('REMOVE')
      tesla = JSON.parse(tesla)
 
      this.CanvasInstance.removeMarker(tesla)
    })
    // #endregion 
  }

  handleTeslaClick = teslaId => this.setState({ teslaId })
  

  // #region crud
  handleRemove = () => {
    this.setState({ 
      error: null, 
    })
    extendedFetch(`${process.env.API_URI}/api/teslas/${this.state.teslaId}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      }
    }) 
    .catch(error => this.setState({ error }))
    .finally(() => {
      this.setState({ teslaId: null })
      this.handleCloseModal()
    })
  }

  handleUpdate = data => {
    this.setState({ 
      error: null, 
    }) 
    extendedFetch(`${process.env.API_URI}/api/teslas/${this.state.teslaId}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }) 
    .catch(error => this.setState({ error }))
    .finally(() => {
      this.setState({ teslaId: null })
      this.handleCloseModal()
    })
  }

  handleAdd = data => {
    this.setState({ 
      error: null, 
    })
    extendedFetch(`${process.env.API_URI}/api/teslas`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }) 
    .catch(error => this.setState({ error }))
    .finally(this.handleCloseModal)
  }
  // #endregion

  // #region modals
  handleOpenUpdateModal = () => {
    this.setState({ isOpenModalUpdate: true })
    this.CanvasInstance.disableCamera()
  }
  handleOpenAddModal = () => {
    this.setState({ isOpenModalAdd: true })
    this.CanvasInstance.disableCamera()
  }
  handleCloseModal = () => {
    this.setState({ 
      isOpenModalAdd: false, 
      isOpenModalUpdate: false,
    })
    this.CanvasInstance.enableCamera()
  }
  // #endregion

  render() {
    const { isOpenModalAdd, isOpenModalUpdate, isCollapsedInfo, teslaId, error } = this.state;
    const { CanvasInstance } = this

    let tesla = CanvasInstance && CanvasInstance.findMarker(i => i.params.id === teslaId)
        tesla = tesla && tesla.params 
    
    return (
      <div>

        <style jsx global>{`
          
          html {
            height: 100%;
            min-width: 800px;
            margin: 0;
            padding: 0;
            font-size: 16px;
          }
          body { 
            height: inherit;
            font-size: inherit;
            margin: 0 !important;
            padding: 0 !important;
            background: white;
          }
          body > div{ 
            height: 100%;
          }
        
        
        `}</style>

        <Toolbar>
          <Typography variant="h6">
            Teslas on Mars
          </Typography>
        </Toolbar> 
        
        <Main> 
          
          <Canvas ref={e => this.canvasRef = e}/> 

          <StyledPaper> 

            <Buttons>
              <Button onClick={e => this.setState({ isCollapsedInfo: !isCollapsedInfo })}>
                { isCollapsedInfo ? `Expand` : `Hide` }
              </Button>

              <Button edge="end" aria-label="edit" onClick={this.handleOpenAddModal}>
                <AddIcon />
                add
              </Button>

              {
                tesla && 
                <>
                  <Button edge="end" aria-label="edit" onClick={this.handleOpenUpdateModal}>
                    <EditIcon />
                    edit
                  </Button>
                  <Button edge="end" aria-label="edit" onClick={this.handleRemove}>
                    <DeleteIcon />
                    remove
                  </Button>
                </>
              }

            </Buttons>

            { 
              error &&  
              <SnackbarContent
                aria-describedby="client-snackbar"
                message={
                  <span id="client-snackbar">
                    <ErrorIcon/>
                    {error}
                  </span>
                }
                action={[
                  <IconButton key="close" aria-label="close" color="inherit" onClick={e => this.setState({ error: null })}>
                    <CloseIcon />
                  </IconButton>
                ]}
              />
            }

            {
              !isCollapsedInfo && 
              <>

                { !tesla && <Message>No tesla selected. Pick one from Mars</Message> }

                {
                  tesla && 
                  <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Tesla info
                      </ListSubheader>
                    }
                  >
                    <ListItem>
                      <ListItemIcon>
                        <SendIcon />
                      </ListItemIcon>
                      <ListItemText primary={tesla.title} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DraftsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Latitude" secondary={tesla.latitude} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DraftsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Longitude" secondary={tesla.longitude} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DraftsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Color" secondary={tesla.color} />
                    </ListItem>
                  </List>
                }
              </>
            }

          </StyledPaper> 
        </Main>

        <Modal 
          isOpen={isOpenModalAdd}
          handleClose={this.handleCloseModal} 
          handleSubmit={this.handleAdd}
        />
        <Modal 
          data={tesla}
          isOpen={isOpenModalUpdate}
          handleClose={this.handleCloseModal} 
          handleSubmit={this.handleUpdate}
        />
      </div>
    );
  }
}

Page.getInitialProps = async (req, res) => {

  const d = await fetch(`${process.env.API_URI_INTERNAL}/api/teslas`)
  const teslas = await d.json() || []
  return { teslas }
}


export default Page;


import styled from 'styled-components';

const Main = styled.main`
  height: 100%;
  display: flex;
  position: relative;

  canvas{ 
    position: absolute; 
    z-index: 1;
  }
`
const StyledPaper = styled(Paper)`
  position: absolute;
  z-index: 10; 
  top: 1rem;
  right: 1rem;
  width: 20rem;
  max-height: 24rem;
`

const Buttons = styled.div`
  display: flex;
`
const Message = styled.div`
  padding: 1rem;
`
const Canvas = styled.div`
  width: 100%;
  height: 100%;
`