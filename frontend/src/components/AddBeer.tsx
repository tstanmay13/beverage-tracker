import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const beerStyles = [
  'IPA',
  'Stout',
  'Porter',
  'Pilsner',
  'Wheat Beer',
  'Sour',
  'Lager',
  'Ale',
  'Other',
];

const AddBeer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brewery: '',
    style: '',
    abv: '',
    rating: 0,
    imageUrl: '',
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
    // TODO: Replace with actual API call
    console.log('Form submitted:', formData);
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Beer
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Beer Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Brewery"
            name="brewery"
            value={formData.brewery}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Style</InputLabel>
            <Select
              name="style"
              value={formData.style}
              label="Style"
              onChange={handleChange}
            >
              {beerStyles.map((style) => (
                <MenuItem key={style} value={style}>
                  {style}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            label="ABV (%)"
            name="abv"
            type="number"
            value={formData.abv}
            onChange={handleChange}
            inputProps={{ step: 0.1 }}
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
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
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
            Add Beer
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddBeer; 