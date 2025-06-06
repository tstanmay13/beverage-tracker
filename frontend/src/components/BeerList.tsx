import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
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
import axios from 'axios';
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

interface Style {
  id: number;
  name: string;
  short_name?: string;
  description?: string;
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
  const [styleId, setStyleId] = useState<string>('');
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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

  const fetchBeers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
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
  }, [search, styleId, pagination.page]);

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
              <FormControl fullWidth>
                <InputLabel sx={{ color: colors.earthBrown }}>Style</InputLabel>
                <Select
                  value={styleId}
                  label="Style"
                  onChange={(e) => setStyleId(e.target.value)}
                  sx={{ borderRadius: 3, background: '#f8f9fa' }}
                >
                  <MenuItem value="">All Styles</MenuItem>
                  {styles.map(style => (
                    <MenuItem key={style.id} value={String(style.id)}>{style.name}</MenuItem>
                  ))}
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {beers.map((beer) => (
            <Box key={beer.id} sx={{ flex: '1 1 300px', maxWidth: 'calc(33.333% - 16px)' }}>
              <Card
                component={RouterLink}
                to={`/beer/${beer.id}`}
                sx={{
                  height: '100%',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  background: 'rgba(210,180,140,0.35)',
                  backdropFilter: 'blur(10px)',
                  border: '1.5px solid rgba(210,180,140,0.18)',
                  boxShadow: '0 4px 24px 0 rgba(139, 115, 85, 0.15)',
                  transition: 'all 0.3s cubic-bezier(.4,2,.3,1)',
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
                  image={beer.labels?.medium || beer.labels?.large || '/default-beer.jpg'}
                  alt={beer.name_display || beer.name}
                  sx={{
                    objectFit: 'cover',
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: colors.earthBrown,
                      lineHeight: 1.3,
                      mb: 2,
                    }}
                  >
                    {beer.name_display || beer.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {beer.abv && (
                      <Chip
                        label={`${beer.abv}% ABV`}
                        size="small"
                        sx={{ 
                          background: colors.earthTan, 
                          color: colors.earthBrown, 
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
                    {beer.style_name && (
                      <Chip
                        label={beer.style_name}
                        size="small"
                        sx={{ 
                          background: colors.white, 
                          color: colors.earthBrown, 
                          fontWeight: 700, 
                          border: `1px solid ${colors.earthTan}`,
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
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
                      lineHeight: 1.5,
                      mt: 'auto',
                    }}
                  >
                    {beer.description}
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