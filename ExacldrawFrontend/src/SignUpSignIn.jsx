import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from 'axios';
// import backendUrl from './config';

const SignUpSignIn = ({ onSignIn, onSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isSignIn, setIsSignIn] = useState(true);
    const [error, setError] = useState('');

    const handleToggle = () => {
        setIsSignIn(!isSignIn);
        setEmail('');
        setPassword('');
        setUsername('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (isSignIn) {
            await handleSignIn(email, password);
        } else {
            await handleSignUp(email, password, username);
        }
    };

    const handleSignIn = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3001/api/signin', { email, password });
            console.log('Sign in successful', response);
            if (response.status === 200) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                onSignIn(email, password);
            } else {
                setError('Sign in failed');
                console.error('Sign in failed', response);
            }
        } catch (error) {
            setError(error.response ? error.response.data : error.message);
            console.error('Error during sign in', error.response ? error.response.data : error.message);
        }
    };

    const handleSignUp = async (email, password, username) => {
        try {
            const response = await axios.post('http://localhost:3001/api/signup', { email, password, username });
            console.log('Sign up successful', response);
            if (response.status === 201) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                onSignUp(email, password, username);
            } else {
                setError('Sign up failed');
                console.error('Sign up failed', response);
            }
        } catch (error) {
            setError(error.response ? error.response.data : error.message);
            console.error('Error during sign up', error.response ? error.response.data : error.message);
        }
    };

    return (
        <>
            <div style={{ color: "black", fontSize: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                Welcome to your digital Whiteboard<br /><br /><br />
            </div>
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
                {error && (
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
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
        </>
    );
};

export default SignUpSignIn;
