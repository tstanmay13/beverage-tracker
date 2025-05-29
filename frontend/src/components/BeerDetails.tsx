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
  Grid,
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
          const collectionResponse = await fetch(`http://localhost:4000/api/user-collections?userId=1&beerId=${id}`);
          if (collectionResponse.ok) {
            const collectionData = await collectionResponse.json();
            if (collectionData.length > 0) {
              setUserCollection(collectionData[0]);
              setRating(collectionData[0].rating);
              setNotes(collectionData[0].notes);
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
      const response = await fetch('http://localhost:4000/api/user-collections', {
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
        throw new Error('Failed to update user collection');
      }
      setSnackbar({
        open: true,
        message: 'Collection updated successfully!',
        severity: 'success'
      });
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
      <Skeleton variant="rectangular" height={300} sx={{ mb: 2, borderRadius: 2 }} />
      <Skeleton variant="text" height={60} width="60%" sx={{ mb: 2 }} />
      <Skeleton variant="text" height={20} width="40%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="70%" sx={{ mb: 1 }} />
      <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
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
        sx={{ mb: 2 }}
        color="primary"
      >
        <ArrowBackIcon />
      </IconButton>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          borderRadius: 2,
          background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Box
              component="img"
              src={beer.filepath || 'https://via.placeholder.com/400x600'}
              alt={beer.name}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocalBarIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                {beer.name}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              <Chip 
                icon={<InfoIcon />}
                label={`${beer.abv}% ABV`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                icon={<InfoIcon />}
                label={`${beer.ibu} IBU`}
                color="secondary"
                variant="outlined"
              />
              <Chip 
                icon={<InfoIcon />}
                label={`${beer.srm} SRM`}
                color="info"
                variant="outlined"
              />
            </Box>

            <Typography 
              variant="body1" 
              paragraph
              sx={{ 
                mb: 3,
                lineHeight: 1.7,
                color: 'text.secondary'
              }}
            >
              {beer.descript}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ mb: 3 }}>
                <Typography 
                  component="legend" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    mb: 1
                  }}
                >
                  Your Rating
                  <Tooltip title="Rate this beer from 1 to 5 stars">
                    <InfoIcon fontSize="small" color="action" />
                  </Tooltip>
                </Typography>
                <Rating
                  value={rating}
                  precision={0.5}
                  onChange={(_, newValue) => {
                    setRating(newValue || 0);
                  }}
                  icon={<FavoriteIcon fontSize="inherit" />}
                  emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: 'primary.main',
                    },
                    '& .MuiRating-iconHover': {
                      color: 'primary.light',
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
                    borderRadius: 2,
                  }
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
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem'
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BeerDetails; 