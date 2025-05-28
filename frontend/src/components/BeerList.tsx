import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface Beer {
  id: number;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  rating: number;
  imageUrl: string;
}

const BeerList = () => {
  const [beers, setBeers] = useState<Beer[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockBeers: Beer[] = [
      {
        id: 1,
        name: 'Sample IPA',
        brewery: 'Test Brewery',
        style: 'IPA',
        abv: 6.5,
        rating: 4.5,
        imageUrl: 'https://via.placeholder.com/150',
      },
      // Add more mock beers as needed
    ];
    setBeers(mockBeers);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Beer Collection
      </Typography>
      <Grid container spacing={3}>
        {beers.map((beer) => (
          <Grid item xs={12} sm={6} md={4} key={beer.id}>
            <Card
              component={RouterLink}
              to={`/beer/${beer.id}`}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={beer.imageUrl}
                alt={beer.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {beer.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {beer.brewery}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {beer.style} • {beer.abv}% ABV
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Rating value={beer.rating} precision={0.5} readOnly />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BeerList; 