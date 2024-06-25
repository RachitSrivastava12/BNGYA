import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignIn) {
            onSignIn(email, password);
        } else {
                      onSignUp(email, password, username);
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