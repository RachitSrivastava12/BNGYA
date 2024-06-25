import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import backendUrl from './config';
const SavedDrawings = ({ drawings, onSelect }) => {
    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Saved Drawings
            </Typography>
            {drawings.length === 0 ? (
                <Typography>No saved drawings</Typography>
            ) : (
                <Grid container spacing={3}>
                    {drawings.map((drawing, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card onClick={() => onSelect(drawing)}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={`${backendUrl}/uploads/${drawing.filePath.split('/').pop()}`}
                                    alt={drawing.name}
                                />
                                <CardContent>
                                    <Typography variant="h6">{drawing.name}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default SavedDrawings;
