import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, CircularProgress, Chip, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import colors from '../colors';

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
        <CircularProgress sx={{ color: colors.earthTan }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert 
          severity="error"
          sx={{
            background: colors.white,
            color: colors.earthBrown,
            '& .MuiAlert-icon': {
              color: colors.earthTan,
            },
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (beers.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <SportsBarIcon sx={{ fontSize: 40, color: colors.earthBrown }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 900, color: colors.earthBrown, letterSpacing: 1 }}>
            My Beer Collection
          </Typography>
        </Box>
        <Alert 
          severity="info"
          sx={{
            background: colors.white,
            color: colors.earthBrown,
            '& .MuiAlert-icon': {
              color: colors.earthTan,
            },
          }}
        >
          Your collection is empty. Start adding beers from the home page!
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <SportsBarIcon sx={{ fontSize: 40, color: colors.earthBrown }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 900, color: colors.earthBrown, letterSpacing: 1 }}>
          My Beer Collection
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {beers.map((beer) => (
          <Grid 
            key={beer.id}
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Card
              onClick={() => navigate(`/beer/${beer.beer_id}`)}
              sx={{
                cursor: 'pointer',
                borderRadius: 4,
                background: 'rgba(210,180,140,0.35)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(210,180,140,0.18)',
                boxShadow: '0 4px 24px 0 rgba(139, 115, 85, 0.15)',
                transition: 'all 0.3s cubic-bezier(.4,2,.3,1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: '0 8px 32px 0 rgba(139, 115, 85, 0.22)',
                  transform: 'translateY(-8px) scale(1.04)',
                  border: '1.5px solid rgba(210,180,140,0.28)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={beer.imageUrl || '/default-beer.jpg'}
                alt={beer.name}
                sx={{
                  objectFit: 'cover',
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold', color: colors.earthBrown }}>
                  {beer.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip
                    label={`${beer.abv}% ABV`}
                    size="small"
                    sx={{ background: colors.earthTan, color: colors.earthBrown, fontWeight: 700 }}
                  />
                  <Chip
                    label={`Rating: ${beer.rating ?? 'N/A'}`}
                    size="small"
                    sx={{ background: colors.white, color: colors.earthBrown, fontWeight: 700, border: `1px solid ${colors.earthTan}` }}
                  />
                </Box>
                {beer.notes && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.earthBrown,
                      opacity: 0.8,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {beer.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyCollection;