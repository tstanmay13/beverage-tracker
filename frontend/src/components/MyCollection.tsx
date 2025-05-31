import { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, CardMedia, Box, CircularProgress, 
  Chip, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Checkbox, ToggleButton, ToggleButtonGroup,
  Paper, Divider, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import DeleteIcon from '@mui/icons-material/Delete';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
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
  available_id?: number;
  glassware_id?: number;
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
  beer_id: string;
  collection_id: number;
  rating: number;
  notes: string;
  style_name?: string;
}

interface Style {
  id: number;
  name: string;
  short_name?: string;
  description?: string;
}

const MyCollection = () => {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [beerToDelete, setBeerToDelete] = useState<Beer | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBeers, setSelectedBeers] = useState<Set<number>>(new Set());
  const [multiDeleteDialogOpen, setMultiDeleteDialogOpen] = useState(false);
  const [styles, setStyles] = useState<Style[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
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
          name: item.name_display || item.name,
          name_display: item.name_display,
          description: item.description,
          abv: item.abv,
          ibu: item.ibu,
          srm: item.srm,
          style_id: item.style_id,
          available_id: item.available_id,
          glassware_id: item.glassware_id,
          is_organic: item.is_organic,
          is_retired: item.is_retired,
          labels: item.labels,
          status: item.status,
          status_display: item.status_display,
          create_date: item.beer_create_date,
          update_date: item.beer_update_date,
          rating: parseFloat(item.rating),
          notes: item.notes,
          style_name: item.style_name,
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

  useEffect(() => {
    // Fetch styles from backend
    const fetchStyles = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/styles');
        setStyles(response.data);
      } catch (error) {
        console.error('Error fetching styles:', error);
      }
    };
    fetchStyles();
  }, []);

  const handleDeleteClick = (beer: Beer, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setBeerToDelete(beer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!beerToDelete) return;

    try {
      await axios.delete(`http://localhost:4000/api/user-collections/${beerToDelete.collection_id}`);
      setBeers(beers.filter(b => b.collection_id !== beerToDelete.collection_id));
      setDeleteDialogOpen(false);
      setBeerToDelete(null);
    } catch (error) {
      console.error('Error deleting beer from collection:', error);
      setError('Failed to delete beer from collection. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBeerToDelete(null);
  };

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newMode: 'grid' | 'list') => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleSelectBeer = (collectionId: number) => {
    setSelectedBeers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(collectionId)) {
        newSet.delete(collectionId);
      } else {
        newSet.add(collectionId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedBeers.size === beers.length) {
      setSelectedBeers(new Set());
    } else {
      setSelectedBeers(new Set(beers.map(beer => beer.collection_id)));
    }
  };

  const handleMultiDelete = async () => {
    try {
      const deletePromises = Array.from(selectedBeers).map(id =>
        axios.delete(`http://localhost:4000/api/user-collections/${id}`)
      );
      await Promise.all(deletePromises);
      setBeers(beers.filter(b => !selectedBeers.has(b.collection_id)));
      setSelectedBeers(new Set());
      setMultiDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting beers:', error);
      setError('Failed to delete some beers. Please try again.');
    }
  };

  // Filter beers by selected style
  const filteredBeers = selectedStyle
    ? beers.filter(beer => String(beer.style_id) === selectedStyle)
    : beers;

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

  const renderGridView = (beers: Beer[]) => (
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
              position: 'relative',
              '&:hover': {
                boxShadow: '0 8px 32px 0 rgba(139, 115, 85, 0.22)',
                transform: 'translateY(-8px) scale(1.04)',
                border: '1.5px solid rgba(210,180,140,0.28)',
              },
            }}
          >
            <IconButton
              onClick={(e) => handleDeleteClick(beer, e)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 1)',
                },
              }}
            >
              <DeleteIcon sx={{ color: colors.earthBrown }} />
            </IconButton>
            <CardMedia
              component="img"
              height="200"
              image={beer.labels?.medium || beer.labels?.large || '/default-beer.jpg'}
              alt={beer.name_display || beer.name}
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
              <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
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
                {beer.style_name && (
                  <Chip
                    label={beer.style_name}
                    size="small"
                    sx={{ background: colors.white, color: colors.earthBrown, fontWeight: 700, border: `1px solid ${colors.earthTan}` }}
                  />
                )}
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
  );

  const renderListView = (beers: Beer[]) => (
    <Paper 
      elevation={0}
      sx={{ 
        borderRadius: 4,
        background: 'rgba(210,180,140,0.35)',
        backdropFilter: 'blur(10px)',
        border: '1.5px solid rgba(210,180,140,0.18)',
      }}
    >
      <List>
        {beers.map((beer, index) => (
          <ListItem
            key={beer.id}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                background: 'rgba(210,180,140,0.1)',
              },
            }}
            secondaryAction={
              <IconButton
                edge="end"
                onClick={(e) => handleDeleteClick(beer, e)}
                sx={{ color: colors.earthBrown }}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <Checkbox
              checked={selectedBeers.has(beer.collection_id)}
              onChange={() => handleSelectBeer(beer.collection_id)}
              onClick={(e) => e.stopPropagation()}
              sx={{
                color: colors.earthTan,
                '&.Mui-checked': {
                  color: colors.earthBrown,
                },
              }}
            />
            <ListItemAvatar>
              <Avatar
                src={beer.labels?.medium || beer.labels?.large}
                alt={beer.name}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="h6" sx={{ color: colors.earthBrown, fontWeight: 600 }}>
                  {beer.name}
                </Typography>
              }
              secondary={
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
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
                  {beer.style_name && (
                    <Chip
                      label={beer.style_name}
                      size="small"
                      sx={{ background: colors.white, color: colors.earthBrown, fontWeight: 700, border: `1px solid ${colors.earthTan}` }}
                    />
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <SportsBarIcon sx={{ fontSize: 40, color: colors.earthBrown }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 900, color: colors.earthBrown, letterSpacing: 1 }}>
          My Beer Collection
        </Typography>
      </Box>
      {/* Style Filter */}
      <Box sx={{ mb: 3, maxWidth: 320 }}>
        <FormControl fullWidth>
          <InputLabel sx={{ color: colors.earthBrown }}>Style</InputLabel>
          <Select
            value={selectedStyle}
            label="Style"
            onChange={e => setSelectedStyle(e.target.value)}
            sx={{ borderRadius: 3, background: '#f8f9fa' }}
          >
            <MenuItem value="">All Styles</MenuItem>
            {styles.map(style => (
              <MenuItem key={style.id} value={String(style.id)}>{style.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {selectedBeers.size > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setMultiDeleteDialogOpen(true)}
              sx={{
                background: colors.earthBrown,
                '&:hover': {
                  background: colors.earthTan,
                },
              }}
            >
              Delete Selected ({selectedBeers.size})
            </Button>
          )}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {viewMode === 'grid' ? renderGridView(filteredBeers) : renderListView(filteredBeers)}

      {/* Single Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: colors.white,
            boxShadow: '0 8px 32px 0 rgba(139, 115, 85, 0.22)',
          },
        }}
      >
        <DialogTitle sx={{ color: colors.earthBrown, fontWeight: 600 }}>
          Remove from Collection
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.earthBrown }}>
            Are you sure you want to remove {beerToDelete?.name} from your collection?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{
              color: colors.earthBrown,
              '&:hover': {
                background: 'rgba(210,180,140,0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
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
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Multiple Delete Dialog */}
      <Dialog
        open={multiDeleteDialogOpen}
        onClose={() => setMultiDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: colors.white,
            boxShadow: '0 8px 32px 0 rgba(139, 115, 85, 0.22)',
          },
        }}
      >
        <DialogTitle sx={{ color: colors.earthBrown, fontWeight: 600 }}>
          Remove Multiple Beers
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.earthBrown }}>
            Are you sure you want to remove {selectedBeers.size} beers from your collection?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setMultiDeleteDialogOpen(false)}
            sx={{
              color: colors.earthBrown,
              '&:hover': {
                background: 'rgba(210,180,140,0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleMultiDelete}
            variant="contained"
            color="error"
            sx={{
              background: colors.earthBrown,
              '&:hover': {
                background: colors.earthTan,
              },
            }}
          >
            Remove All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyCollection;