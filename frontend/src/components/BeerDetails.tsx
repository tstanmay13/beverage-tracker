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
import SportsBarIcon from '@mui/icons-material/SportsBar';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import colors from '../colors';

interface Beer {
  id: string;
  name: string;
  name_display?: string;
  description?: string;
  abv?: number;
  ibu?: number;
  srm?: number;
  style_id?: number;
  style_name?: string;
  available_id?: number;
  availability_name?: string;
  glassware_id?: number;
  glassware_name?: string;
  is_organic?: boolean;
  is_retired?: boolean;
  labels?: {
    icon?: string;
    medium?: string;
    large?: string;
    contentAwareIcon?: string;
    contentAwareMedium?: string;
    contentAwareLarge?: string;
  };
  status?: string;
  status_display?: string;
  create_date?: string;
  update_date?: string;
}

interface UserCollection {
  collection_id: number;
  beer_id: string;
  rating: number;
  notes: string;
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
            const userBeer = collectionData.find((item: UserCollection) => item.beer_id === id);
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

    fetchData();
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/user-collections', {
        method: userCollection ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // Hardcoded for demo; replace with actual user ID
          beer_id: id,
          rating,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to collection');
      }

      setSnackbar({
        open: true,
        message: 'Successfully saved to your collection!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error saving to collection:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save to collection. Please try again.',
        severity: 'error',
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
      <Box sx={{ mb: 4 }}>
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{ 
            color: colors.earthBrown,
            '&:hover': {
              background: 'rgba(210,180,140,0.12)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 3, md: 6 },
          borderRadius: 4,
          background: 'rgba(210,180,140,0.35)',
          backdropFilter: 'blur(10px)',
          border: '1.5px solid rgba(210,180,140,0.18)',
          boxShadow: '0 4px 24px 0 rgba(139, 115, 85, 0.15)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box
              component="img"
              src={beer.labels?.large || beer.labels?.medium || 'https://via.placeholder.com/400x600'}
              alt={beer.name_display || beer.name}
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
              <SportsBarIcon sx={{ fontSize: 32, color: colors.earthTan }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 900, color: colors.earthBrown, letterSpacing: 1 }}>
                {beer.name_display || beer.name}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              {beer.abv && (
                <Chip 
                  icon={<InfoIcon sx={{ color: colors.white }} />}
                  label={`${beer.abv}% ABV`}
                  sx={{ background: colors.earthTan, color: colors.earthBrown, fontWeight: 700 }}
                />
              )}
              {beer.ibu && (
                <Chip 
                  icon={<InfoIcon sx={{ color: colors.earthBrown }} />}
                  label={`${beer.ibu} IBU`}
                  sx={{ background: colors.white, color: colors.earthBrown, fontWeight: 700, border: `1px solid ${colors.earthTan}` }}
                />
              )}
              {beer.srm && (
                <Chip 
                  icon={<InfoIcon sx={{ color: colors.earthTan }} />}
                  label={`${beer.srm} SRM`}
                  sx={{ background: colors.white, color: colors.earthBrown, fontWeight: 700, border: `1px solid ${colors.earthTan}` }}
                />
              )}
              {beer.style_name && (
                <Chip 
                  icon={<InfoIcon sx={{ color: colors.earthBrown }} />}
                  label={beer.style_name}
                  sx={{ background: colors.white, color: colors.earthBrown, fontWeight: 700, border: `1px solid ${colors.earthTan}` }}
                />
              )}
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
              {beer.description}
            </Typography>

            <Divider sx={{ my: 3, background: colors.earthTan, opacity: 0.3 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: colors.earthBrown, fontWeight: 600 }}>
                Add to Your Collection
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography component="legend" sx={{ mb: 1, color: colors.earthBrown }}>Rating</Typography>
                <Rating
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue || 0)}
                  precision={0.5}
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: colors.earthTan,
                    },
                    '& .MuiRating-iconHover': {
                      color: colors.earthTan,
                    },
                  }}
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: colors.white,
                    '& fieldset': {
                      borderColor: colors.earthTan,
                    },
                    '&:hover fieldset': {
                      borderColor: colors.earthBrown,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.earthBrown,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: colors.earthBrown,
                  },
                }}
              />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  background: colors.earthTan,
                  color: colors.earthBrown,
                  fontWeight: 600,
                  '&:hover': {
                    background: colors.earthBrown,
                    color: colors.earthTan,
                  },
                }}
              >
                {userCollection ? 'Update Collection' : 'Add to Collection'}
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