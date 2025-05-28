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
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Beer Catalog
      </Typography>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 300px' }}>
            <TextField
              fullWidth
              label="Search Beers"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 300px' }}>
            <Typography gutterBottom>ABV Range</Typography>
            <Slider
              value={abvRange}
              onChange={(_, newValue) => setAbvRange(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={15}
              step={0.1}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">{abvRange[0]}%</Typography>
              <Typography variant="body2">{abvRange[1]}%</Typography>
            </Box>
          </Box>
          <Box sx={{ flex: '1 1 300px' }}>
            <FormControl fullWidth>
              <InputLabel>Style</InputLabel>
              <Select
                value={styleId}
                label="Style"
                onChange={(e) => setStyleId(e.target.value)}
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
      </Paper>

      {/* Beer Grid */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
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
                <Typography variant="body2" color="text.secondary" noWrap>
                  {beer.descript}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </Container>
  );
};

export default BeerList; 