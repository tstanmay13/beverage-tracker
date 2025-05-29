import { ThemeProvider } from './components/ThemeProvider';
import { Container } from '@mui/material';
import Navbar from './components/Navbar';
import BeerList from './components/BeerList';
import BeerDetails from './components/BeerDetails';
import MyCollection from './components/MyCollection';
import LandingPage from './components/LandingPage';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Create a wrapper component to handle the conditional Navbar rendering
const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <>
      {!isLandingPage && <Navbar />}
      {/* Main Content */}
      <Container 
        maxWidth={isLandingPage ? false : "lg"} 
        className={isLandingPage ? "p-0" : "min-h-screen py-8"}
        sx={isLandingPage ? { maxWidth: '100% !important', padding: '0 !important' } : {}}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/beers" element={<BeerList />} />
          <Route path="/collection" element={<MyCollection />} />
          <Route path="/beer/:id" element={<BeerDetails />} />
        </Routes>
      </Container>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
