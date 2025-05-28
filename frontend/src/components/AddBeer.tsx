import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Rating,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddBeer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    beer_id: '',
    rating: 0,
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/user-collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // Hardcoded for demo; replace with actual user ID
          beer_id: parseInt(formData.beer_id),
          rating: formData.rating,
          notes: formData.notes,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add beer to collection');
      }
      navigate('/');
    } catch (error) {
      console.error('Error adding beer to collection:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Beer to Collection
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Beer ID"
            name="beer_id"
            value={formData.beer_id}
            onChange={handleChange}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="rating"
              value={formData.rating}
              precision={0.5}
              onChange={(_, newValue) => {
                setFormData((prev) => ({ ...prev, rating: newValue || 0 }));
              }}
            />
          </Box>
          <TextField
            margin="normal"
            fullWidth
            label="Notes"
            name="notes"
            multiline
            rows={4}
            value={formData.notes}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add to Collection
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddBeer; 