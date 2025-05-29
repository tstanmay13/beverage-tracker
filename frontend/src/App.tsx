import { ThemeProvider } from './components/ThemeProvider';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import Navbar from './components/Navbar';
import BeerIcon from '@mui/icons-material/SportsBar';
import BeerList from './components/BeerList';
import BeerDetails from './components/BeerDetails';
import MyCollection from './components/MyCollection';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import colors from './colors';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Container maxWidth="lg" className="min-h-screen py-8">
          <Box className="space-y-8">
            {/* Hero Section */}
            <Paper
              className="glass-card"
              sx={{
                p: { xs: 4, md: 8 },
                mb: 8,
                borderRadius: 6,
                background: colors.gradientHero,
                boxShadow: colors.glassShadow,
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 3, md: 6 },
                flexDirection: { xs: 'column', md: 'row' },
              }}
              elevation={0}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,251,233,0.7)',
                  borderRadius: '50%',
                  width: 100,
                  height: 100,
                  boxShadow: colors.cardShadow,
                }}
              >
                <BeerIcon sx={{ fontSize: 60, color: colors.beerAmber }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    color: colors.beerDeep,
                    mb: 2,
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: 1,
                    textShadow: `0 2px 8px ${colors.beerFoam}`,
                  }}
                >
                  Welcome to Beverage Tracker
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.beerDeep,
                    mb: 4,
                    fontWeight: 500,
                    opacity: 0.85,
                  }}
                >
                  Track your favorite beverages and discover new ones with a modern, beautiful experience.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/"
                  sx={{
                    borderRadius: 9999,
                    px: 5,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    background: colors.gradientButton,
                    color: colors.beerFoam,
                    boxShadow: colors.cardShadow,
                    textTransform: 'none',
                    '&:hover': {
                      background: colors.gradientButtonHover,
                      color: colors.beerDeep,
                    },
                  }}
                >
                  Start Tracking
                </Button>
              </Box>
            </Paper>

            {/* Main Content */}
            <Routes>
              <Route path="/" element={<BeerList />} />
              <Route path="/collection" element={<MyCollection />} />
              <Route path="/beer/:id" element={<BeerDetails />} />
            </Routes>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
