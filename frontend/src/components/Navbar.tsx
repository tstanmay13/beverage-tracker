import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LocalBarIcon from '@mui/icons-material/LocalBar';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <LocalBarIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            Beer Tracker
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/add"
          >
            Add Beer
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 