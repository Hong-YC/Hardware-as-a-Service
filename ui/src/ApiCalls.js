
export function createUser(inputs, setUser){
    const data = {userID: inputs.userID,
                  username: inputs.username,
                  passw: inputs.password}
    return fetch(`/api/createUser/`,{
        'method':'POST',
        headers : {
        'Content-Type':'application/json'
    },
    body:JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
            if (response.success){
              setUser({userID: `${inputs.userID}`, username: `${inputs.username}`} )
            }
            else {
              alert(`ERROR: ${response.errorMessage}`)
            }
        })
    .catch(error => console.log(error))
}

export function loginUser(inputs, setUser){
    const data = { userID: inputs.userID,
                   passw: inputs.password};
    // console.log(data)
    return fetch(`/api/loginUser/`,{
        'method':'POST',
        headers : {
        'Content-Type':'application/json'
    },
    body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(response => {
        if (response.success){
            setUser({userID: `${response.userID}`, username: `${response.username}`} )
        }
        else {
            alert(`ERROR: ${response.errorMessage}`)
        }
    })
    .catch(error => console.log(error))
}
    
export function leaveProject(projID, userID, refreshProjects){
  return fetch(`/api/leaveProject/${projID}/${userID}`,{
    'method':'POST',
    headers : {
    'Content-Type':'application/json'
  },
  })
  .then(response => response.json())
  .then(response => {
      if (response.success){
        refreshProjects(null)
      }
      else {
        alert(`ERROR: ${response.errorMessage}`)
      }
  })
  .catch(error => console.log(error))
}

export function joinProject(projID, userID, refreshProjects){
  return fetch(`/api/joinProject/${projID}/${userID}`,{
    'method':'POST',
    headers : {
    'Content-Type':'application/json'
  },
  })
  .then(response => response.json())
  .then(response => {
      if (response.success){
        refreshProjects(projID)
      }
      else {
        alert(`ERROR: ${response.errorMessage}`)
      }
  })
  .catch(error => console.log(error))
}

export function createProject(projID, projName, projDescription, authorizedUsers, userID, refreshProjects){
  return fetch(`/api/createProject/${projID}/${projName}/${projDescription}/${authorizedUsers}/${userID}`,{
    'method':'POST',
    headers : {
    'Content-Type':'application/json'
  },
  })
  .then(response => response.json())
  .then(response => {
      if (response.success){
        refreshProjects(projID)
      }
      else {
        alert(`ERROR: ${response.errorMessage}`)
      }
  })
  .catch(error => console.log(error))
}

export function editProject(projID, projName, projDescription, authorizedUsers, refreshProjects){
  return fetch(`/api/editProject/${projID}/${projName}/${projDescription}/${authorizedUsers}`,{
    'method':'POST',
    headers : {
    'Content-Type':'application/json'
  },
  })
  .then(response => response.json())
  .then(response => {
      if (response.success){
        refreshProjects(projID)
      }
      else {
        alert(`ERROR: ${response.errorMessage}`)
      }
  })
  .catch(error => console.log(error))
}

export function checkIn(projID, setID, qty, userID, refreshProjects){
  return fetch(`/api/checkIn/${projID}/${setID}/${qty}/${userID}`,{
    'method':'POST',
    headers : {
    'Content-Type':'application/json'
  },
  })
  .then(response => response.json())
  .then(response => {
      if (response.success){
        refreshProjects()
      }
      else {
        alert(`ERROR: ${response.errorMessage}`)
      }
  })
  .catch(error => console.log(error))
}

export function checkOut(projID, setID, qty, userID, refreshProjects){
  return fetch(`/api/checkOut/${projID}/${setID}/${qty}/${userID}`,{
    'method':'POST',
    headers : {
    'Content-Type':'application/json'
  },
  })
  .then(response => response.json())
  .then(response => {
      if (response.success){
        refreshProjects()
      }
      else {
        alert(`ERROR: ${response.errorMessage}`)
      }
  })
  .catch(error => console.log(error))
}