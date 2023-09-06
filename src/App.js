// src/App.js
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Routes all
import { userRoutes, authRoutes } from './routes/allRoutes';

// Import all middleware
import PrivateRoutes from './routes/middleware/privateRoutes';
import AuthRoutes from './routes/middleware/authRoutes';

// project imports
// import NavigationScroll from './layout/NavigationScroll';
// import MinimalLayout from './layout/MinimalLayout';

const theme = createTheme({
  palette:{
    background:{
      default: '#f5f5f5'
    }
  }
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
                {userRoutes.map((route, idx) => (
                  <Route path={route.path} element={route.element} key={idx} />
                ))}
          </Route>
          <Route element={<AuthRoutes />}>
                {authRoutes.map((route, idx) => (
                  <Route path={route.path} element={route.element} key={idx} />
                ))}
          </Route>
        </Routes>
      </Router>
      {/* <TopMenu /> */}
    </ThemeProvider>
  );
};

export default App;
