import React, { useState } from 'react';
import {Box, TextField, Typography, Button, inputClasses} from '@mui/material';
import {createUser, loginUser} from './ApiCalls'

const Auth = (props) => {

    const [isSignup, setIsSignup] = useState(false);
    const [inputs, setInputs] = useState({
        username:"", 
        userID:"",
        password:"",
    });
    
    const handleChange = (e) => {
        setInputs((prevState)=>({
            ...prevState, 
            [e.target.name] : e.target.value
        }))
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup){
            createUser(inputs, props.setUser)
        }
        else {
            loginUser(inputs, props.setUser)
        }
        
    }
    const resetState = () => {
        setIsSignup(!isSignup);
        setInputs({username:'',userID:'',password:''})
    }
    return (<div>
        <form onSubmit={handleSubmit}>
            <Box
            display="flex" 
            flexDirection={'column'} 
            maxWidth={400} 
            alignItems="center" 
            justifyContent="center"
                margin="auto"
                marginTop={5} //change later from hardcoded
                padding={3}
                borderRadius={5}
                    boxShadow={'5px 5px 10px #ccc'}
                    sx={{
                        ":hover": {
                        boxShadow:'10px 10px 20px #ccc',
                        },
                    }}
            >
                <Typography variant="h2" padding={3} textAlign="center" color="primary.dark">
                   {isSignup ? "Signup" : "Login"}
                </Typography>
                { isSignup && (<TextField 
                    onChange={handleChange}
                    value={inputs.username}
                    name="username"
                    margin="normal" 
                    type={'username'} 
                    variant="outlined" 
                    placeholder="Username">
                </TextField>
                )}
                <TextField 
                    onChange={handleChange}
                    value={inputs.userID}
                    name="userID"
                    margin="normal" 
                    type={'username'} 
                    variant="outlined" 
                    placeholder="UserID">
                </TextField>
                <TextField 
                    onChange={handleChange}
                    value={inputs.password}
                    name="password"
                    margin="normal" 
                    type={'password'}
                    variant="outlined" 
                    placeholder="Password">
                </TextField>
                <Button 
                    type="submit"
                    sx={{marginTop: 3, borderRadius: 3, backgroundColor: 'red'}}
                    variant="contained" 
                    // color="warning"
                    >
                    {isSignup ? "Signup" : "Login"}
                </Button>
                <Button 
                    onClick={resetState}
                    sx={{marginTop: 3, borderRadius: 3}}>
                    Change To {isSignup ? "Login" : "Signup"}
                </Button>
            </Box>
        </form>
    </div>);
};

export default Auth;