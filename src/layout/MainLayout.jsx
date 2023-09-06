import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Paper,
  styled,
  Button,
  Box,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Import the Link component from react-router-dom
import { withRouter } from '../hooks';
import { getLoginUser } from '../services/apiService';

const HeaderAppBar = styled(AppBar)({
  backgroundColor: (theme) => theme.palette.primary.main,
});

const HeaderToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const HeaderTitle = styled(Typography)({
  flexGrow: 1,
});

const DashboardContent = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const DashboardPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const MainLayout = ({children, router}) => {
  // State to manage user data
  const [user, setUser] = useState(getLoginUser());

  // Function to handle logout
  const handleLogout = () => {
    // Implement your logout logic here
    localStorage.setItem('loginUser', false);
    localStorage.removeItem('token');
    router.navigate('/login')
    // For example, clear user data and navigate to the login page
    setUser(null);
  };

  return (
    <div>
      <HeaderAppBar position="sticky">
        <HeaderToolbar>
          <Typography variant="h6">
            <Link component={RouterLink} to="/todos" style={{marginRight: 20}} color="inherit">
              Todos
            </Link>
            {user.role === 'admin' &&  <Link component={RouterLink} to="/users" color="inherit">
             Users
            </Link>}
           
          </Typography>
          {user ? (
            <Box display="flex" alignItems="center">
              <Typography variant="body1" style={{ marginRight: '1rem' }}>
                Welcome, {user.username}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          ) : null}
        </HeaderToolbar>
      </HeaderAppBar>
      <DashboardContent>
        <Container>
          {/* <DashboardPaper elevation={3}>
            <Typography variant="h5" gutterBottom>
              Welcome to the Dashboard
            </Typography>
          </DashboardPaper> */}
          {children}
        </Container>
      </DashboardContent>
    </div>
  );
};

export default withRouter(MainLayout);
