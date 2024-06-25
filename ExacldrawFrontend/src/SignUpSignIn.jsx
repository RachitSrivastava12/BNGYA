import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from 'axios';
import backendUrl from './config';

const SignUpSignIn = ({ onSignIn, onSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isSignIn, setIsSignIn] = useState(true);

    const handleToggle = () => {
        setIsSignIn(!isSignIn);
        setEmail('');
        setPassword('');
        setUsername('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignIn) {
            await handleSignIn(email, password);
        } else {
            await handleSignUp(email, password, username);
        }
    };

    const handleSignIn = async (email, password) => {
        try {
            const response = await axios.post(`${backendUrl}/api/signin`, { email, password });
            console.log('Sign in successful', response);
            // Perform any additional sign-in logic here
        } catch (error) {
            console.error('Error during sign in', error);
        }
    };

    const handleSignUp = async (email, password, username) => {
        try {
            const response = await axios.post(`${backendUrl}/api/signup`, { email, password, username });
            console.log('Sign up successful', response);
            // Perform any additional sign-up logic here
        } catch (error) {
            console.error('Error during sign up', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 300, margin: 'auto', mt: 4 }}>
            <TextField
                fullWidth
                margin="normal"
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {!isSignIn && (
                <TextField
                    fullWidth
                    margin="normal"
                    label="Username"
                    variant="outlined"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            )}
            <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2 }}
            >
                {isSignIn ? 'Sign In' : 'Sign Up'}
            </Button>
            <Typography
                variant="body2"
                sx={{ mt: 2, cursor: 'pointer', textAlign: 'center' }}
                onClick={handleToggle}
            >
                {isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Typography>
        </Box>
    );
};

export default SignUpSignIn;