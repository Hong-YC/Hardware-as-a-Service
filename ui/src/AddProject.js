import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider } from '@mui/material';

export default function AddProject(props) {
  const [open, setOpen] = React.useState(false);

  const [joinProjectID, setJoinProjectID] = React.useState("")

  const [newProjectInputs, setNewProjectInputs] = React.useState({
    projectID:"", 
    projectName:"",
    projectDescription:"",
    authorizedUsers: props.user.userID // current user in the list by default
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

  const handleJoinProject = (e) => {
    e.preventDefault();
    props.handleJoinProject(joinProjectID)
    handleClose()
  }

  const handleNewProject = (e) => {
    e.preventDefault();
    props.handleCreateProject(newProjectInputs)
    handleClose()
  }

  const joinFormRef = React.useRef();
  const createFormRef = React.useRef();

  return (
    <div>
      <Button variant="outlined" sx={{color:"success.main"}} onClick={handleClickOpen}>
        + Add Project
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form ref={joinFormRef} onSubmit={handleJoinProject}>
            <DialogTitle>Join an existing project</DialogTitle>
            <DialogContent>
            <DialogContentText>
                To join an existing project, please provide the project ID of the project
                that you're authorized to join.
            </DialogContentText>
            <TextField required
                autoFocus
                onChange={(e)=>setJoinProjectID(e.target.value)}
                margin="dense"
                id="projectID"
                label="Authorized Project's ID"
                type={'projectID'}
                fullWidth
                variant="standard"
            />
            </DialogContent>
            <DialogActions>
            
            <Button type="submit" onClick={() => joinFormRef.current.reportValidity()}>Join Project</Button>
            </DialogActions>
        </form>
        <Divider light></Divider>
        <form ref={createFormRef} onSubmit={handleNewProject}>
            <DialogTitle>Create a new project</DialogTitle>
            <DialogContent>
            <DialogContentText>
                To create a new project, please provide project ID, project name,
                project description, and comma-separated list of authorized users
            </DialogContentText>
            <TextField required
                onChange={handleNewProjectChange}
                margin="dense"
                id="projectID"
                label="New Project's ID"
                type="{projectID}"
                fullWidth
                variant="standard"
            />
            <TextField required
                onChange={handleNewProjectChange}
                margin="dense"
                id="projectName"
                label="New Project's Name"
                type="{projectName}"
                fullWidth
                variant="standard"
            />
            <TextField required
                onChange={handleNewProjectChange}
                margin="dense"
                id="projectDescription"
                label="New Project's Description"
                type="{projectDescription}"
                fullWidth
                variant="standard"
            />
            <TextField required
                onChange={handleNewProjectChange}
                margin="dense"
                id="authorizedUsers"
                label="Comma-separated list of authorized users"
                type="{autorizedUsers}"
                value={newProjectInputs.authorizedUsers}
                fullWidth
                variant="standard"
            />
            </DialogContent>
            <DialogActions>

            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onClick={() => createFormRef.current.reportValidity()}>Create New Project</Button>
            
            </DialogActions>
        </form>
        
      </Dialog>
    </div>
  );
}
