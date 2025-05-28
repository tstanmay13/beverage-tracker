import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Rating,
  Button,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Beer {
  id: number;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  rating: number;
  imageUrl: string;
  notes: string;
}

const BeerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [beer, setBeer] = useState<Beer | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockBeer: Beer = {
      id: Number(id),
      name: 'Sample IPA',
      brewery: 'Test Brewery',
      style: 'IPA',
      abv: 6.5,
      rating: 4.5,
      imageUrl: 'https://via.placeholder.com/400',
      notes: 'A delicious IPA with citrus notes and a smooth finish.',
    };
    setBeer(mockBeer);
  }, [id]);

  if (!beer) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to List
      </Button>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src={beer.imageUrl}
              alt={beer.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {beer.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {beer.brewery}
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="body1" gutterBottom>
                Style: {beer.style}
              </Typography>
              <Typography variant="body1" gutterBottom>
                ABV: {beer.abv}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography component="legend" sx={{ mr: 1 }}>
                  Rating:
                </Typography>
                <Rating value={beer.rating} precision={0.5} readOnly />
              </Box>
            </Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Notes
            </Typography>
            <Typography variant="body1" paragraph>
              {beer.notes}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default BeerDetails; 