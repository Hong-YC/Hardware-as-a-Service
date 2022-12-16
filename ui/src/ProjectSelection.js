import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import AddProject from './AddProject';

export default function ProjectSelection(props) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          '& > *': {
            m: 3,
          },
        }}
      >
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          {props.joinedProjects.map((proj) => (
              props.selectedProject && proj.projID === props.selectedProject.projID
              ?
              <Button sx={{color: 'text.primary'}} variant="contained" key={proj.projID}>
                {proj.projName}
              </Button>
              :
              <Button sx={{color: 'text.secondary'}} key={proj.projID} onClick={() => props.setSelectedProject(proj)}>
                {proj. projName}
              </Button>
            ))}
          <AddProject
          handleJoinProject={props.handleJoinProject}
          handleCreateProject={props.handleCreateProject}
          user = {props.user}
          />
        </ButtonGroup>
      </Box>
    );
  }