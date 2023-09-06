import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Link, styled } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getLoginUserByToken, loginUser, createAdminUser } from '../../services/apiService'
import { withRouter } from '../../hooks'

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

const Login = ({router}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Handle login logic here (e.g., sending data to a server)
    console.log(formData);
  
    if (formData.username && formData.password) {
      const token = await loginUser(formData)
      console.log('token:::',token);
      if(token && token.access_token){
        localStorage.setItem('token', token.access_token);
        const user = await getLoginUserByToken()
        console.log('user:::',user);
        localStorage.setItem('loginUser', JSON.stringify(user));
        router.navigate('/todos')
      }else{
        setErrorMessage('Invalid credentials')
      }
      // const user = await getQueryUser(`?username=${formData.username}`) || await getQueryUser(`?email=${formData.username}`);
      // console.log(verifyPassword(formData.password, user[0].password))
      // if (user.length && verifyPassword(formData.password, user[0].password)) {
      //   // Login successfully
      //   localStorage.setItem('loginUser', JSON.stringify(user[0]));
      //   router.navigate('/todos')
      // } else {
      //   setErrorMessage('Invalid credentials')
      // }
    }
   
  };

  useEffect(() => {
    createAdminUser()
  }, [])
  

  return (
    <RootContainer>
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>
          User Login
        </Typography>
        <FormContainer onSubmit={handleSubmit}>
          <TextField
            type="text"
            label="Username or Email"
            inputProps={{ "data-testid": "user-name" }}
            name="username"
            value={formData.username}
            onChange={handleChange}
            variant="outlined"
            required
          />
          <TextField
            type="password"
            label="Password"
            inputProps={{ "data-testid": "user-password" }}
            name="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            required
          />
          <Button data-testid="loginBtn" type="submit" variant="contained" color="primary">
            Login
          </Button>
        </FormContainer>
        {errorMessage && (
          <Typography variant="error" color="error">
            {errorMessage}
          </Typography>
        )}
        <Typography variant="body2" style={{ marginTop: '1rem' }}>
          Don't have an account? <a href="/signup">Signup</a>
        </Typography>
      </StyledPaper>
    </RootContainer>
  );
};

export default withRouter(Login);
