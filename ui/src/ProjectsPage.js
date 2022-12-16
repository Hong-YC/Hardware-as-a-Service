import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Typography, Divider, Grid} from '@mui/material';
import HardwareSetsTable from './HwSetTable'
import CircularProgress from '@mui/material/CircularProgress';
import ProjectSelection from './ProjectSelection';
import {leaveProject, joinProject, createProject, checkIn, checkOut, editProject} from './ApiCalls'
import EditProject from './EditProject';

export default function ProjectsPage(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [joinedProjects, setJoinedProjects] = useState([{}])
  const [hardwareSets, setHardwareSets] = useState([{}])
  const [selectedProject, setSelectedProject] = useState(null)

  const refreshProjects = (selectProjectID) => {
    setIsLoaded(false)
    fetch(`api/getProjects/${props.user.userID}`).then(
      res => res.json())
        .then((result) => {
          setIsLoaded(true);
          setJoinedProjects(result.joinedProjects)
          setHardwareSets(result.sets)
          // update selected project if selectProjectID parameter is specified
          if (selectProjectID !== undefined){
            if (selectProjectID == null) {
              setSelectedProject(null)
            } else {
              for (const proj of result.joinedProjects){
                if (proj.projID === selectProjectID){
                  setSelectedProject(proj)
                }
              }
            }
          }
          // if we have some project selected, update that project's info
          else if (selectedProject != null) {
            for (const proj of result.joinedProjects){
              if (proj.projID === selectedProject.projID){
                setSelectedProject(proj)
              }
            }
          }
      },
    )
  }

  useEffect(() => {
    refreshProjects()
  }, [] )




  const handleJoinProject = (projectID) => {
    joinProject(projectID, props.user.userID, refreshProjects)
  }

  const handleLeaveProject = () => {
    leaveProject(selectedProject.projID, props.user.userID, refreshProjects)
  }

  const handleCreateProject = (newProjectInputs) => {
    createProject(newProjectInputs.projectID, newProjectInputs.projectName,
      newProjectInputs.projectDescription, newProjectInputs.authorizedUsers, props.user.userID, refreshProjects)
  }

  const handleEditProject = (newProjectInputs) => {
    editProject(selectedProject.projID, newProjectInputs.projectName,
      newProjectInputs.projectDescription, newProjectInputs.authorizedUsers, refreshProjects)
  }
  
  const handleSubmitQty = (submit_type, qty, setID) => {
    if (qty < 0) {
      qty = 0
    }
    if (submit_type === 'checkIn'){
      checkIn(selectedProject.projID, setID, qty, props.user.userID, refreshProjects)
    }
    else{
      checkOut(selectedProject.projID, setID, qty, props.user.userID, refreshProjects)
    }
  }

  

  if (!isLoaded){
    return (
      <CircularProgress size={70}  sx={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        marginLeft:"50%",
        minHeight:"100vh"}}/>
    )
  }
  else return (
    <div>
      <Typography color="gray" sx={{mb:-2.5, mt:2.5, ml:3}}>Your Projects:</Typography>
      <ProjectSelection 
        joinedProjects={joinedProjects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        handleJoinProject={handleJoinProject}
        handleCreateProject={handleCreateProject}
        user = {props.user}
        />

      {(() => {
      if (!selectedProject && joinedProjects.length > 0){
        return (
          <div>
            <Typography variant="h5" sx={{color: 'white', fontWeight: 600, letterSpacing: '.05rem', textAlign: "center", m: 20}}>
            No project selected.
            </Typography>
            <br></br>
            <Typography  sx={{color: 'white', fontWeight: 300, letterSpacing: '.05rem', textAlign: "center", mt: -20}}>
              Please select a project from <i>Your Projects</i>
            </Typography>
          </div>
        )
      }
      else if (!selectedProject) {
        return (
          <div>
            <Typography variant="h5" sx={{color: 'white', fontWeight: 600, letterSpacing: '.05rem', textAlign: "center", m: 20}}>
              You don't have any projects!
            </Typography>
            <br></br>
            <Typography  sx={{color: 'white', fontWeight: 300, letterSpacing: '.05rem', textAlign: "center", mt: -20}}>
              Create a new project or join an existing
              project by selecting <i>+ Add Project</i> 
            </Typography>
          </div>
        )
      }
      else {
        return (
      <div>
        <Typography variant="h4" 
            sx={{
              ml: 6,
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'white',
              textDecoration: 'none',
            }}>
          Project {selectedProject.projName}
        </Typography>  
        <Divider sx={{mt: 2}}></Divider>
        <Grid container>
          <Grid item>
            <Box sx={{m: 3, ml: 6 }}>
              <Typography color="text.secondary"> <Box component="span" sx={{color:'primary.dark', fontWeight:"bold"}}>Project ID:</Box> {selectedProject.projID}</Typography>
              <Typography color="text.secondary"> <Box component="span" sx={{color:'primary.dark', fontWeight:"bold"}}>Description:</Box> {selectedProject.projDescription}</Typography>
              <Typography color="text.secondary"> <Box component="span" sx={{color:'primary.dark', fontWeight:"bold"}}>Authorized Users:</Box> {selectedProject.authorizedUsers.join(", ")}</Typography>

            </Box>
          </Grid>                          
          <Grid item xs>                                 
            <Grid container direction="row-reverse"> 
              <Grid item sx={{m:3}}>
                <EditProject
                  selectedProject={selectedProject}
                  handleEditProject={handleEditProject}
                />
              </Grid>     
              <Grid item sx={{m:3}}>
                <Button variant="contained" onClick={handleLeaveProject}>Leave Project</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider></Divider>
        

        <HardwareSetsTable 
          hardwareSets = {hardwareSets}
          set1CheckedOutUnits = {selectedProject.set1CheckedOutUnits}
          set2CheckedOutUnits = {selectedProject.set2CheckedOutUnits}
          handleSubmitQty = {handleSubmitQty}
        />

        
      </div>
      )
      }})()}
    </div>
  )
}
