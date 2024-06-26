mport React, { useState, useEffect } from 'react';
// import backendUrl from './config';
import DrawingTools from './DrawingTools';
import Whiteboard from './Whiteboard';
import SignUpSignIn from './SignUpSignIn';
import SavedDrawings from './SavedDrawings';
import './App.css';
import axios from 'axios';

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
            fetchDrawings();
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
            const response = await axios.post('http://localhost:3001/api/signup', {
                email,
                password,
                username,
            });

            if (response.status === 201) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                setIsSignedIn(true);
                fetchDrawings();
            } else {
                console.error('Sign up failed');
            }
        } catch (error) {
            console.error('Sign up error:', error);
        }
    };

    const handleSignIn = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3001/api/signin', {
                email,
                password,
            });

            if (response.status === 200) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                setIsSignedIn(true);
                fetchDrawings();
            } else {
                console.error('Sign in failed');
            }
        } catch (error) {
            console.error('Sign in error:', error);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        setIsSignedIn(false);
        setDrawings([]);
    };

    const handleShowSavedDrawings = () => {
        setShowSavedDrawings((prev) => !prev);
        if (!showSavedDrawings) {
            fetchDrawings();
        }
    };

    const fetchDrawings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await axios.get('http://localhost:3001/api/drawings', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setDrawings(response.data);
            } else {
                console.error('Fetching drawings failed');
            }
        } catch (error) {
            console.error('Fetch drawings error:', error);
            if (error.response && error.response.status === 403) {
                console.error('Authentication failed. Please sign in again.');
                handleSignOut();
            }
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

            const response = await axios.post('http://localhost:3001/api/drawing', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                console.log('Drawing saved successfully');
                fetchDrawings();
            } else {
                console.error('Saving drawing failed');
            }
        } catch (error) {
            console.error('Save drawing error:', error);
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
