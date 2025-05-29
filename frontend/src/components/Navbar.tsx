import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import CollectionsIcon from '@mui/icons-material/Collections';
import colors from '../colors';

const navLinks = [
  {
    label: 'Beer Tracker',
    to: '/',
    icon: <LocalBarIcon />,
  },
  {
    label: 'My Collection',
    to: '/collection',
    icon: <CollectionsIcon />,
  },
];

const Navbar = () => {
  const location = useLocation();
  return (
    <Box className="w-full flex justify-center mt-6 mb-10">
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: colors.gradientHero,
          borderRadius: 9999,
          boxShadow: colors.glassShadow,
          width: { xs: '95%', sm: '80%', md: '70%' },
          maxWidth: 900,
          mx: 'auto',
          py: 1,
          px: 2,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
          <Box className="flex items-center gap-3">
            <LocalBarIcon sx={{ fontSize: 32, color: colors.beerDeep }} />
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 800,
                letterSpacing: 1,
                color: colors.beerDeep,
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                textShadow: `0 2px 8px ${colors.beerFoam}`,
              }}
            >
              Beverage Tracker
            </Typography>
          </Box>
          <Box className="flex gap-2">
            {navLinks.slice(1).map((link) => (
              <Button
                key={link.to}
                component={RouterLink}
                to={link.to}
                startIcon={link.icon}
                sx={{
                  borderRadius: 9999,
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: location.pathname === link.to ? colors.beerFoam : colors.beerDeep,
                  background: location.pathname === link.to
                    ? 'rgba(255,251,233,0.25)'
                    : 'transparent',
                  boxShadow: location.pathname === link.to
                    ? colors.cardShadow
                    : 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: 'rgba(255,251,233,0.35)',
                    color: colors.beerDeep,
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar; 