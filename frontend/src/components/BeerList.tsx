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

const BeerList = () => {
  const [beers, setBeers] = useState<Beer[]>([]);

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/beers');
        if (!response.ok) {
          throw new Error('Failed to fetch beers');
        }
        const data = await response.json();
        setBeers(data);
      } catch (error) {
        console.error('Error fetching beers:', error);
      }
    };
    fetchBeers();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Beer Catalog
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
                image={beer.filepath || 'https://via.placeholder.com/150'}
                alt={beer.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {beer.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ABV: {beer.abv}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {beer.descript}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BeerList; 