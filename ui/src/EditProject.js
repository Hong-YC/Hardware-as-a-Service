import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function EditProject(props) {

  const [open, setOpen] = React.useState(false);

  const [newProjectInputs, setNewProjectInputs] = React.useState({
    projectName: props.selectedProject.projName,
    projectDescription: props.selectedProject.projDescription,
    authorizedUsers: props.selectedProject.authorizedUsers
    });


    const handleNewProjectChange = (e) => {
        setNewProjectInputs((prevState)=>({
            ...prevState, 
            [e.target.id] : e.target.value
        }))
    }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditProject = (e) => {
    e.preventDefault();
    props.handleEditProject(newProjectInputs)
  }


  return (
    
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Edit Project
      </Button>
      <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleEditProject}>
            <DialogTitle>Edit Project #{props.selectedProject.projID}</DialogTitle>
            <DialogContent>
            <DialogContentText>
                You can 
                enter new project name, project description, and list of 
                authorized users. 
            </DialogContentText>
            <TextField
                onChange={handleNewProjectChange}
                margin="dense"
                id="projectName"
                label="New Project Name"
                type="{projectName}"
                value={newProjectInputs.projectName}
                fullWidth
                variant="standard"
            />
            <TextField
                onChange={handleNewProjectChange}
                margin="dense"
                id="projectDescription"
                label="New Project Description"
                type="{projectDescription}"
                value={newProjectInputs.projectDescription}
                fullWidth
                variant="standard"
            />
            <TextField
                onChange={handleNewProjectChange}
                margin="dense"
                id="authorizedUsers"
                label="Comma-separated list of authorized users"
                type="{authorizedUsers}"
                value={newProjectInputs.authorizedUsers}
                fullWidth
                variant="standard"
            />
            </DialogContent>
            <DialogActions>

            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onClick={handleClose}>Edit Project #{props.selectedProject.projID}</Button>
            
            </DialogActions>
        </form>
        
      </Dialog>
    </div>
  );
}
