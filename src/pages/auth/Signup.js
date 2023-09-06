import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  styled,
} from '@mui/material';
import { createUser } from '../../services/apiService'
import { withRouter  } from '../../hooks';

const RootContainer = styled(Container)({
  marginTop: '2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

const StyledPaper = styled(Paper)({
  padding: '1.5rem',
  width: '300px',
  textAlign: 'center',
});

const FormContainer = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

const SignUp = ({router}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate a signup request (replace with actual signup logic)
    try {
      // Send signup request here and handle the response
      // For example, using axios or fetch
      const response = await createUser(formData);
      console.log('response:::', response)

      // Check if signup was successful
      if (response.status === 201) {
        setSuccessMessage(response.message);
        setErrorMessage('');
        setFormData({
          username: '',
          email: '',
          password: '',
        })
        alert(response.message);
        router.navigate('/login');
      } else {
        setSuccessMessage('');
        setErrorMessage(response.message);
      }
    } catch (error) {
      // Handle any errors that occur during the signup request
      setSuccessMessage('');
      setErrorMessage('An error occurred during signup.');
    }
  };

  return (
    <RootContainer>
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <FormContainer onSubmit={handleSubmit}>
          <TextField
            type="text"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            variant="outlined"
            required
          />
          <TextField
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            required
          />
          <TextField
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Sign Up
          </Button>
        </FormContainer>
        {successMessage && (
          <Typography variant="success" color="success">
            {successMessage}
          </Typography>
        )}
        {errorMessage && (
          <Typography variant="error" color="error">
            {errorMessage}
          </Typography>
        )}
        <Typography variant="body2" style={{ marginTop: '1rem' }}>
          Already have an account? <a href="/login">Login</a>
        </Typography>
      </StyledPaper>
    </RootContainer>
  );
};

export default withRouter(SignUp);
