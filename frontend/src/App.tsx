import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';
import BeerList from './components/BeerList';
import AddBeer from './components/AddBeer';
import BeerDetails from './components/BeerDetails';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<BeerList />} />
          <Route path="/add" element={<AddBeer />} />
          <Route path="/beer/:id" element={<BeerDetails />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
