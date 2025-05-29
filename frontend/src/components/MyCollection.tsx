import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Beer {
  id: string;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  imageUrl: string;
  beer_id: number;
  collection_id: number;
  rating: number;
  notes: string;
}

const MyCollection = () => {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/api/user-collections/1');
        
        // The response includes both collection and beer data
        const beersData = response.data.map((item: any) => ({
          id: `collection-${item.collection_id}-beer-${item.beer_id}`,
          collection_id: item.collection_id,
          beer_id: item.beer_id,
          name: item.name,
          brewery: item.brewery_id,
          style: item.style_id,
          abv: item.abv,
          rating: parseFloat(item.rating),
          notes: item.notes,
          imageUrl: item.filepath || '/default-beer.jpg'
        }));
        setBeers(beersData);
        setError(null);
      } catch (error) {
        console.error('Error fetching collection:', error);
        setError('Failed to load your beer collection. Please try again later.');
        setBeers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  if (beers.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Beer Collection
        </Typography>
        <Typography variant="body1">
          Your collection is empty. Start adding beers from the home page!
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Beer Collection
      </Typography>
      <Grid container spacing={3}>
        {beers.map((beer) => (
          <Grid 
            key={beer.id}
            sx={{
              width: {
                xs: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.33% - 16px)'
              }
            }}
          >
            <Card
              onClick={() => navigate(`/beer/${beer.beer_id}`)}
              sx={{
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  boxShadow: 6,
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
                <Typography variant="h6" component="h2">
                  {beer.name}
                </Typography>
                <Typography color="textSecondary">
                  {beer.brewery}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    Style: {beer.style}
                  </Typography>
                  <Typography variant="body2">
                    ABV: {beer.abv}%
                  </Typography>
                  <Typography variant="body2">
                    Rating: {beer.rating}
                  </Typography>
                  {beer.notes && (
                    <Typography variant="body2">
                      Notes: {beer.notes}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyCollection; 