import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Rating,
  TextField,
  Button,
} from '@mui/material';

interface Beer {
  id: number;
  brewery_id: number;
  name: string;
  cat_id: number;
  style_id: number;
  abv: number;
  ibu: number;
  srm: number;
  upc: number;
  filepath: string;
  descript: string;
  add_user: number;
  last_mod: string;
}

interface UserCollection {
  id: number;
  user_id: number;
  beer_id: number;
  rating: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

const BeerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [beer, setBeer] = useState<Beer | null>(null);
  const [userCollection, setUserCollection] = useState<UserCollection | null>(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/beers/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch beer details');
        }
        const data = await response.json();
        setBeer(data);
      } catch (error) {
        console.error('Error fetching beer details:', error);
      }
    };

    const fetchUserCollection = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/user-collections?userId=1&beerId=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user collection');
        }
        const data = await response.json();
        if (data.length > 0) {
          setUserCollection(data[0]);
          setRating(data[0].rating);
          setNotes(data[0].notes);
        }
      } catch (error) {
        console.error('Error fetching user collection:', error);
      }
    };

    fetchBeerDetails();
    fetchUserCollection();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/user-collections', {
        method: userCollection ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // Hardcoded for demo; replace with actual user ID
          beer_id: parseInt(id!),
          rating,
          notes,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update user collection');
      }
      alert('Collection updated successfully!');
    } catch (error) {
      console.error('Error updating user collection:', error);
    }
  };

  if (!beer) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {beer.name}
        </Typography>
        <Typography variant="body1" paragraph>
          ABV: {beer.abv}%
        </Typography>
        <Typography variant="body1" paragraph>
          {beer.descript}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={rating}
              precision={0.5}
              onChange={(_, newValue) => {
                setRating(newValue || 0);
              }}
            />
          </Box>
          <TextField
            margin="normal"
            fullWidth
            label="Notes"
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {userCollection ? 'Update Collection' : 'Add to Collection'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BeerDetails; 