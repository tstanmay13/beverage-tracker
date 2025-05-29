import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Paper,
  InputAdornment,
  Skeleton,
  Chip,
  Fade,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import InfoIcon from '@mui/icons-material/Info';
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

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const BeerList = () => {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [abvRange, setAbvRange] = useState<number[]>([0, 15]);
  const [styleId, setStyleId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchBeers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        minAbv: abvRange[0].toString(),
        maxAbv: abvRange[1].toString(),
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(styleId && { style_id: styleId }),
      });

      const response = await fetch(`http://localhost:4000/api/beers?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch beers');
      }
      const data = await response.json();
      setBeers(data.beers);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching beers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchBeers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, abvRange, styleId, pagination.page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPagination(prev => ({ ...prev, page: value }));
  };

  const LoadingSkeleton = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {[...Array(6)].map((_, index) => (
        <Box key={index} sx={{ flex: '1 1 300px', maxWidth: 'calc(33.333% - 16px)' }}>
          <Card sx={{ height: '100%', background: colors.white, borderRadius: 4, boxShadow: colors.cardShadow }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={40} />
              <Skeleton variant="text" height={20} width="60%" />
              <Skeleton variant="text" height={20} width="80%" />
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Search and Filters */}
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, md: 4 }, 
          mb: 4,
          borderRadius: 4,
          background: showFilters ? colors.white : 'transparent',
          boxShadow: showFilters ? colors.cardShadow : 'none',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: showFilters ? 2 : 0 }}>
          <TextField
            fullWidth
            label="Search Beers"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.earthTan }} />
                </InputAdornment>
              ),
            }}
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
          <Tooltip title="Toggle Filters">
            <IconButton 
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                color: showFilters ? colors.earthTan : colors.earthBrown,
                background: showFilters ? 'rgba(210,180,140,0.12)' : 'transparent',
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'rgba(210,180,140,0.18)',
                  color: colors.earthBrown,
                },
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Fade in={showFilters}>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            mt: 2,
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out'
          }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: colors.earthBrown, fontWeight: 600 }}>
                ABV Range
                <Tooltip title="Alcohol by Volume">
                  <InfoIcon fontSize="small" sx={{ color: colors.earthTan }} />
                </Tooltip>
              </Typography>
              <Slider
                value={abvRange}
                onChange={(_, newValue) => setAbvRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={0}
                max={15}
                step={0.1}
                sx={{
                  color: colors.earthTan,
                  '& .MuiSlider-thumb': {
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    },
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Chip label={`${abvRange[0]}%`} size="small" sx={{ background: colors.earthTan, color: colors.earthBrown, fontWeight: 600 }} />
                <Chip label={`${abvRange[1]}%`} size="small" sx={{ background: colors.earthTan, color: colors.earthBrown, fontWeight: 600 }} />
              </Box>
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: colors.earthBrown }}>Style</InputLabel>
                <Select
                  value={styleId}
                  label="Style"
                  onChange={(e) => setStyleId(e.target.value)}
                  sx={{ borderRadius: 3, background: '#f8f9fa' }}
                >
                  <MenuItem value="">All Styles</MenuItem>
                  <MenuItem value="1">Lager</MenuItem>
                  <MenuItem value="2">Ale</MenuItem>
                  <MenuItem value="3">Stout</MenuItem>
                  <MenuItem value="4">IPA</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Fade>
      </Paper>

      {/* Beer Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {beers.map((beer) => (
            <Box key={beer.id} sx={{ flex: '1 1 300px', maxWidth: 'calc(33.333% - 16px)' }}>
              <Card
                component={RouterLink}
                to={`/beer/${beer.id}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: 'rgba(210,180,140,0.35)',
                  backdropFilter: 'blur(10px)',
                  border: '1.5px solid rgba(210,180,140,0.18)',
                  boxShadow: '0 4px 24px 0 rgba(139, 115, 85, 0.15)',
                  transition: 'all 0.3s cubic-bezier(.4,2,.3,1)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.04)',
                    boxShadow: '0 8px 32px 0 rgba(139, 115, 85, 0.22)',
                    border: '1.5px solid rgba(210,180,140,0.28)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={beer.filepath || 'https://via.placeholder.com/150'}
                  alt={beer.name}
                  sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s cubic-bezier(.4,2,.3,1)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold', color: colors.earthBrown }}>
                    {beer.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip 
                      label={`${beer.abv}% ABV`} 
                      size="small" 
                      sx={{ background: colors.earthTan, color: colors.earthBrown, fontWeight: 700 }}
                    />
                    <Chip 
                      label={`${beer.ibu} IBU`} 
                      size="small" 
                      sx={{ background: colors.white, color: colors.earthBrown, fontWeight: 700, border: `1px solid ${colors.earthTan}` }}
                    />
                  </Box>
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
                    {beer.descript}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: 2,
              background: '#f8f9fa',
              color: colors.earthBrown,
              fontWeight: 600,
              mx: 0.5,
              transition: 'all 0.2s',
              '&.Mui-selected': {
                background: colors.earthTan,
                color: colors.earthBrown,
              },
              '&:hover': {
                background: colors.earthTan,
                color: colors.earthBrown,
              },
            },
          }}
        />
      </Box>
    </Container>
  );
};

export default BeerList; 