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
                position: 'relative',
                overflow: 'hidden',
              }}
              elevation={0}
            >
              {/* Dot Pattern Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    "url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><circle cx=\'20\' cy=\'20\' r=\'2\' fill=\'white\'/><circle cx=\'80\' cy=\'40\' r=\'1.5\' fill=\'white\'/><circle cx=\'40\' cy=\'70\' r=\'1\' fill=\'white\'/></svg>')",
                  opacity: 0.08,
                  zIndex: 0,
                }}
              />
              <Box sx={{ zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 6 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: 100,
                    height: 100,
                    boxShadow: colors.cardShadow,
                    mb: { xs: 2, md: 0 },
                  }}
                >
                  <BeerIcon sx={{ fontSize: 60, color: colors.white }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: colors.white,
                      mb: 2,
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    Welcome to Beverage Tracker
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      mb: 4,
                      fontWeight: 400,
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
                      background: 'rgba(255,255,255,0.2)',
                      color: colors.white,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderRadius: 2,
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      backdropFilter: 'blur(10px)',
                      boxShadow: colors.cardShadow,
                      textTransform: 'none',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.3)',
                      },
                    }}
                  >
                    Start Tracking
                  </Button>
                </Box>
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
