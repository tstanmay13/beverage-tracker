import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import CollectionsIcon from '@mui/icons-material/Collections';
import colors from '../colors';

const navLinks = [
  {
    label: 'Beer Tracker',
    to: '/',
    icon: <SportsBarIcon />,
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
          background: 'rgba(210,180,140,0.35)',
          backdropFilter: 'blur(12px)',
          borderRadius: 9999,
          boxShadow: '0 8px 32px 0 rgba(139, 115, 85, 0.18)',
          border: '1.5px solid rgba(210,180,140,0.18)',
          width: { xs: '98%', sm: '90%', md: '80%' },
          maxWidth: 1100,
          mx: 'auto',
          py: 1,
          px: 2,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
          <Box className="flex items-center gap-3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <SportsBarIcon sx={{ 
              fontSize: 32, 
              color: colors.earthBrown, 
              display: 'flex', 
              alignItems: 'center',
              mt: -0.5
            }} />
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 800,
                letterSpacing: 1,
                color: colors.earthBrown,
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                textShadow: `0 2px 8px ${colors.earthTan}`,
                display: 'flex',
                alignItems: 'center',
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
                  color: location.pathname === link.to ? colors.earthTan : colors.earthBrown,
                  background: location.pathname === link.to
                    ? 'rgba(210,180,140,0.12)'
                    : 'transparent',
                  boxShadow: location.pathname === link.to
                    ? '0 0 12px 2px rgba(210,180,140,0.18)'
                    : 'none',
                  transition: 'all 0.25s cubic-bezier(.4,2,.3,1)',
                  '&:hover': {
                    background: 'rgba(210,180,140,0.18)',
                    color: colors.earthBrown,
                    boxShadow: '0 0 16px 4px rgba(210,180,140,0.25)',
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