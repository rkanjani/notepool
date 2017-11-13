import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Container, Grid, Modal } from 'semantic-ui-react'

import * as actions from '../../redux/actions'
import { getNoteById } from '../../redux/reducers'

import { Loading, Note } from '../presentation'
import EditNote from './EditNote'
import styles from '../../styles'

class Notes extends Component {
  constructor(props){
    super(props);

    this.state = {
      open: false
    }
  }

  componentDidMount(){
    this.props.fetchNotes(this.props.user.id);
  }

  addNote(){
    const note = {title: '', body: '', colour: '', collaborators: []};
    this.show(note);
  }

  updateNote(updatedNote){
    this.props.updateNote(updatedNote);
  }

  deleteNote(id){
    this.props.deleteNote(id);
  }

  addCollaborator(params){
    this.props.addCollaborator(params);
  }

  removeCollaborator(params){
    this.props.removeCollaborator(params);
  }

  show = (note) => {
    this.props.setCurrentNote(note);
    this.setState({ open: true });
  }

  close = (note) => {
    this.setState({ open: false });
    if (note.id) { // if this note already exists
      this.props.updateNote(note);
    } else { // if this is a new note it won't have an id
      this.props.addNote({note: note, id: this.props.user.id});
    }
  }



  render(){
    const noteButton = <Button circular icon='plus' size='big' color='teal' className='right-aligned-button' onClick={this.addNote.bind(this)}></Button>

    const listItems = this.props.notes.map((note, i) => {
      return(
        <Grid.Column key={note.id}>
          <Note show={this.show.bind(this)} currentNote={note} deleteNote={this.deleteNote.bind(this)} updateNote={this.updateNote.bind(this)} addCollaborator={this.addCollaborator.bind(this)} removeCollaborator={this.removeCollaborator.bind(this)} />
        </Grid.Column>
      )
    })

    return(
      <div>
        {this.props.loading ?
          <Loading />
          :
          <Container style={{marginTop: '50px'}}>
            <Grid columns={3} stackable>
              <Grid.Row>
                {listItems}
              </Grid.Row>
              <Grid.Row>
                {noteButton}
              </Grid.Row>
            </Grid>
          </Container>
        }
        <EditNote item={this.props.currentNote} open={this.state.open} close={this.close.bind(this)} deleteNote={this.deleteNote.bind(this)} />
      </div>
    )
  }
}

const stateToProps = (state) => ({
  notes: state.note.notes,
  currentNote: state.note.currentNote,
  user: state.user,
  loading: state.note.loading
})

const dispatchToProps = (dispatch) => ({
  fetchNotes: (params) => dispatch(actions.fetchNotes(params)),
  addNote: (params) => dispatch(actions.addNote(params)),
  updateNote: (params) => dispatch(actions.updateNote(params)),
  deleteNote: (params) => dispatch(actions.deleteNote(params)),
  addCollaborator: (params) => dispatch(actions.addCollaborator(params)),
  removeCollaborator: (params) => dispatch(actions.removeCollaborator(params)),
  setCurrentNote: (params) => dispatch(actions.setCurrentNote(params))
})

export default connect(stateToProps, dispatchToProps)(Notes)
