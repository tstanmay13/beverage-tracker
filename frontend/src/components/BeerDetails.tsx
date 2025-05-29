import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Rating,
  TextField,
  Button,
  Chip,
  Skeleton,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import colors from '../colors';

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
  collection_id: number;
}

const BeerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [beer, setBeer] = useState<Beer | null>(null);
  const [userCollection, setUserCollection] = useState<UserCollection | null>(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // First try to fetch the beer
        const beerResponse = await fetch(`http://localhost:4000/api/beers/${id}`);
        if (!beerResponse.ok) {
          if (beerResponse.status === 404) {
            setError('Beer not found');
          } else {
            throw new Error('Failed to fetch beer');
          }
          return;
        }
        const beerData = await beerResponse.json();
        setBeer(beerData);

        // Then try to fetch the user collection
        try {
          const collectionResponse = await fetch(`http://localhost:4000/api/user-collections/1`);
          if (collectionResponse.ok) {
            const collectionData = await collectionResponse.json();
            const userBeer = collectionData.find((item: UserCollection) => item.beer_id === parseInt(id!));
            if (userBeer) {
              setUserCollection(userBeer);
              setRating(userBeer.rating);
              setNotes(userBeer.notes);
            }
          }
        } catch (collectionError) {
          console.error('Error fetching user collection:', collectionError);
          // Don't throw here, as we still want to show the beer details
        }
      } catch (error) {
        console.error('Error fetching beer:', error);
        setError('Failed to load beer details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/user-collections' + (userCollection ? `/${userCollection.collection_id}` : ''), {
        method: userCollection ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1,
          beer_id: parseInt(id!),
          rating,
          notes,
        }),
      });
      if (!response.ok) {
        if (response.status === 409) {
          setSnackbar({
            open: true,
            message: 'Beer is already in your collection!',
            severity: 'error'
          });
          return;
        }
        throw new Error('Failed to update user collection');
      }
      setSnackbar({
        open: true,
        message: userCollection ? 'Collection updated successfully!' : 'Beer added to your collection!',
        severity: 'success'
      });
      // If it was an add, refetch collection info
      if (!userCollection) {
        const collectionResponse = await fetch(`http://localhost:4000/api/user-collections/1`);
        if (collectionResponse.ok) {
          const collectionData = await collectionResponse.json();
          const userBeer = collectionData.find((item: UserCollection) => item.beer_id === parseInt(id!));
          if (userBeer) {
            setUserCollection(userBeer);
          }
        }
      }
    } catch (error) {
      console.error('Error updating user collection:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update collection',
        severity: 'error'
      });
    }
  };

  const LoadingSkeleton = () => (
    <Box sx={{ width: '100%' }}>
      <Skeleton variant="rectangular" height={300} sx={{ mb: 2, borderRadius: 4, background: colors.earthTan }} />
      <Skeleton variant="text" height={60} width="60%" sx={{ mb: 2, background: colors.earthTan }} />
      <Skeleton variant="text" height={20} width="40%" sx={{ mb: 1, background: colors.earthTan }} />
      <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1, background: colors.earthTan }} />
      <Skeleton variant="text" height={20} width="70%" sx={{ mb: 1, background: colors.earthTan }} />
      <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 4, background: colors.earthTan }} />
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <LoadingSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          }
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

  if (!beer) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ 
          mb: 2, 
          color: colors.earthBrown, 
          background: 'rgba(210,180,140,0.10)', 
          borderRadius: 2, 
          '&:hover': { 
            background: 'rgba(210,180,140,0.18)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s',
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, md: 6 },
          borderRadius: 6,
          background: colors.gradientHero,
          boxShadow: colors.glassShadow,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box
              component="img"
              src={beer.filepath || 'https://via.placeholder.com/400x600'}
              alt={beer.name}
              sx={{
                width: '100%',
                maxWidth: 340,
                height: 'auto',
                borderRadius: 4,
                boxShadow: colors.cardShadow,
                transition: 'transform 0.3s cubic-bezier(.4,2,.3,1)',
                background: colors.earthTan,
                '&:hover': {
                  transform: 'scale(1.03)',
                },
              }}
            />
          </Box>
          <Box sx={{ flex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <LocalBarIcon sx={{ fontSize: 32, color: colors.earthTan }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 900, color: colors.earthBrown, letterSpacing: 1 }}>
                {beer.name}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              <Chip 
                icon={<InfoIcon sx={{ color: colors.white }} />}
                label={`${beer.abv}% ABV`}
                sx={{ background: colors.earthTan, color: colors.earthBrown, fontWeight: 700 }}
              />
              <Chip 
                icon={<InfoIcon sx={{ color: colors.earthBrown }} />}
                label={`${beer.ibu} IBU`}
                sx={{ background: colors.white, color: colors.earthBrown, fontWeight: 700, border: `1px solid ${colors.earthTan}` }}
              />
              <Chip 
                icon={<InfoIcon sx={{ color: colors.earthTan }} />}
                label={`${beer.srm} SRM`}
                sx={{ background: colors.white, color: colors.earthBrown, fontWeight: 700, border: `1px solid ${colors.earthTan}` }}
              />
            </Box>

            <Typography 
              variant="body1" 
              paragraph
              sx={{ 
                mb: 3,
                lineHeight: 1.7,
                color: colors.earthBrown,
                opacity: 0.85,
                fontWeight: 500,
              }}
            >
              {beer.descript}
            </Typography>

            <Divider sx={{ my: 3, background: colors.earthTan, opacity: 0.3 }} />

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ mb: 3 }}>
                <Typography 
                  component="legend" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    mb: 1,
                    color: colors.earthBrown,
                    fontWeight: 700,
                  }}
                >
                  Your Rating
                  <Tooltip title="Rate this beer from 1 to 5 stars">
                    <InfoIcon fontSize="small" sx={{ color: colors.earthTan }} />
                  </Tooltip>
                </Typography>
                <Rating
                  value={rating}
                  precision={0.5}
                  onChange={(_, newValue) => {
                    setRating(newValue || 0);
                  }}
                  icon={<FavoriteIcon fontSize="inherit" sx={{ color: colors.earthTan }} />}
                  emptyIcon={<FavoriteBorderIcon fontSize="inherit" sx={{ color: colors.white }} />}
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: colors.earthTan,
                    },
                    '& .MuiRating-iconHover': {
                      color: colors.earthBrown,
                    },
                  }}
                />
              </Box>

              <TextField
                margin="normal"
                fullWidth
                label="Tasting Notes"
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: '#f8f9fa',
                    boxShadow: colors.cardShadow,
                  },
                  '& .MuiInputLabel-root': {
                    color: colors.earthBrown,
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  py: 1.5,
                  borderRadius: 9999,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${colors.earthBrown} 0%, ${colors.earthTan} 100%)`,
                  color: colors.white,
                  boxShadow: colors.cardShadow,
                  '&:hover': {
                    background: `linear-gradient(90deg, ${colors.earthTan} 0%, ${colors.earthBrown} 100%)`,
                    color: colors.white,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                {userCollection ? 'Update Rating' : 'Add to Collection'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            background: colors.white,
            color: colors.earthBrown,
            '& .MuiAlert-icon': {
              color: colors.earthTan,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BeerDetails; 