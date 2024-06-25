import React, { useState, useEffect } from 'react';
import backendUrl from './config'; // Ensure this is correctly configured
import DrawingTools from './DrawingTools';
import Whiteboard from './Whiteboard';
import SignUpSignIn from './SignUpSignIn';
import SavedDrawings from './SavedDrawings';
import './App.css';
import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Ensure this matches your backend URL

const App = () => {
    const [selectedTool, setSelectedTool] = useState('pen');
    const [brushSize, setBrushSize] = useState(5);  
    const [penColor, setPenColor] = useState('#000000');
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [showSavedDrawings, setShowSavedDrawings] = useState(false);
    const [drawings, setDrawings] = useState([]);
    const [textSettings, setTextSettings] = useState({
        fontSize: 16,
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        fontFamily: 'Arial',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsSignedIn(true);
            fetchDrawings(); // Fetch drawings if user is signed in
        }
    }, []);

    const handleToolSelect = (tool) => {
        setSelectedTool(tool);
    };

    const handlePenColorChange = (color) => {
        setPenColor(color);
    };

    const handleEraseAll = () => {
        setSelectedTool('eraseAll');
        setTimeout(() => setSelectedTool('pen'), 0);
    };

    const handleSignUp = async (email, password, username) => {
        try {
            const response = await axios.post(`${API_URL}/api/signup`, {
                email,
                password,
                username,
            });

            if (response.status === 201) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                setIsSignedIn(true); // Update sign-in status
                fetchDrawings(); // Fetch drawings after sign-up
            } else {
                console.error('Sign up failed');
                // Handle failed sign-up here (e.g., show error message to user)
            }
        } catch (error) {
            console.error('Sign up error:', error);
            // Handle sign-up error here (e.g., show error message to user)
        }
    };

    const handleSignIn = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/signin`, {
                email,
                password,
            });

            if (response.status === 200) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                setIsSignedIn(true); // Update sign-in status
                fetchDrawings(); // Fetch drawings after sign-in
            } else {
                console.error('Sign in failed');
                // Handle failed sign-in here (e.g., show error message to user)
            }
        } catch (error) {
            console.error('Sign in error:', error);
            // Handle sign-in error here (e.g., show error message to user)
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        setIsSignedIn(false); // Update sign-in status
        setDrawings([]); // Clear drawings on sign-out
    };

    const handleShowSavedDrawings = () => {
        setShowSavedDrawings((prev) => !prev);
        if (!showSavedDrawings) {
            fetchDrawings(); // Fetch drawings when showing saved drawings
        }
    };

    const fetchDrawings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await axios.get(`${API_URL}/api/drawings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.status === 200) {
                setDrawings(response.data); // Update drawings state
            } else {
                console.error('Fetching drawings failed');
                // Handle fetching drawings failure here
            }
        } catch (error) {
            console.error('Fetch drawings error:', error);
            if (error.response && error.response.status === 403) {
                console.error('Authentication failed. Please sign in again.');
                handleSignOut(); // Sign out user if token is invalid
            }
            // Handle other fetch drawings errors here
        }
    };

    const handleSaveDrawing = async (dataUrl) => {
        try {
            const token = localStorage.getItem('token');
            const drawingName = prompt("Enter a name for your drawing:");
            if (!drawingName) return;

            const formData = new FormData();
            formData.append('drawing', dataUrlToBlob(dataUrl), 'drawing.png');
            formData.append('name', drawingName);

            const response = await axios.post(`${API_URL}/api/drawing`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                console.log('Drawing saved successfully');
                fetchDrawings(); // Fetch drawings after saving
            } else {
                console.error('Saving drawing failed');
                // Handle saving drawing failure here
            }
        } catch (error) {
            console.error('Save drawing error:', error);
            // Handle save drawing error here
        }
    };

    const dataUrlToBlob = (dataUrl) => {
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    const handleTextSettingsChange = (settings) => {
        setTextSettings(settings);
    };

    return (
        <div className="app">
            {isSignedIn ? (
                <>
                    <header className="header">
                        <button onClick={handleShowSavedDrawings}>
                            {showSavedDrawings ? 'Back to Drawing' : 'Show Saved Drawings'}
                        </button>
                        <button onClick={handleSignOut}>Sign Out</button>
                    </header>
                    <main className="main">
                        {showSavedDrawings ? (
                            <SavedDrawings drawings={drawings} />
                        ) : (
                            <>
                                <DrawingTools
                                    selectedTool={selectedTool}
                                    onSelectTool={handleToolSelect}
                                    onColorChange={handlePenColorChange}
                                    onEraseAll={handleEraseAll}
                                    onTextSettingsChange={handleTextSettingsChange}
                                    onBrushSizeChange={(size) => setBrushSize(size)}
                                />
                                <Whiteboard
                                    selectedTool={selectedTool}
                                    penColor={penColor}
                                    textSettings={textSettings}
                                    onSave={handleSaveDrawing}
                                    brushSize={brushSize}
                                />
                            </>
                        )}
                    </main>
                </>
            ) : (
                <SignUpSignIn onSignIn={handleSignIn} onSignUp={handleSignUp} />
            )}
        </div>
    );
};

export default App;
