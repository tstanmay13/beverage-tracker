import { ThemeProvider } from './components/ThemeProvider';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import Navbar from './components/Navbar';
import BeerIcon from '@mui/icons-material/SportsBar';
import BeerList from './components/BeerList';
import BeerDetails from './components/BeerDetails';
import MyCollection from './components/MyCollection';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        {/* Main Content */}
        <Container maxWidth="lg" className="min-h-screen py-8">
          <Box className="space-y-8">
            {/* Hero Section */}
            <Paper
              sx={{
                p: { xs: 4, md: 8 },
                mb: 8,
                borderRadius: 6,
                background: 'rgba(210,180,140,0.35)',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(210,180,140,0.18)',
                boxShadow: '0 8px 32px 0 rgba(139, 115, 85, 0.18)',
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
                    "url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><circle cx=\'20\' cy=\'20\' r=\'2\' fill=\'#d2b48c\'/><circle cx=\'80\' cy=\'40\' r=\'1.5\' fill=\'#d2b48c\'/><circle cx=\'40\' cy=\'70\' r=\'1\' fill=\'#d2b48c\'/></svg>')",
                  opacity: 0.10,
                  zIndex: 0,
                }}
              />
              <Box sx={{ zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 6 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(210,180,140,0.18)',
                    borderRadius: '50%',
                    width: 100,
                    height: 100,
                    boxShadow: '0 4px 24px 0 rgba(139, 115, 85, 0.15)',
                    mb: { xs: 2, md: 0 },
                    backdropFilter: 'blur(8px)',
                    border: '1.5px solid rgba(210,180,140,0.18)',
                    transition: 'transform 0.4s cubic-bezier(.4,2,.3,1)',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.07)',
                      boxShadow: '0 8px 32px 0 rgba(139, 115, 85, 0.22)',
                    },
                  }}
                >
                  <BeerIcon sx={{ fontSize: 60, color: '#d2b48c' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: '#8b7355',
                      mb: 2,
                      textShadow: '0 2px 4px rgba(210,180,140,0.12)',
                    }}
                  >
                    Welcome to Beverage Tracker
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#8b7355',
                      opacity: 0.85,
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
                      background: 'rgba(210,180,140,0.18)',
                      color: '#8b7355',
                      border: '2px solid rgba(210,180,140,0.25)',
                      borderRadius: 2,
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      boxShadow: '0 4px 24px 0 rgba(139, 115, 85, 0.10)',
                      textTransform: 'none',
                      fontSize: '1.15rem',
                      transition: 'all 0.25s cubic-bezier(.4,2,.3,1)',
                      '&:hover': {
                        background: 'rgba(210,180,140,0.28)',
                        color: '#8b7355',
                        boxShadow: '0 8px 32px 0 rgba(139, 115, 85, 0.18)',
                        transform: 'translateY(-4px) scale(1.04)',
                      },
                    }}
                  >
                    Start Tracking
                  </Button>
                </Box>
              </Box>
            </Paper>
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
