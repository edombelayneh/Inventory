'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Box, Button, Container, Typography, TextField, AppBar, Toolbar, CssBaseline, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const lightTheme = createTheme({
    typography: {
        fontFamily: 'Georgia, serif', // Elegant serif font for headings
    },
    palette: {
        mode: 'light',
        primary: {
            main: '#5d9cec', 
        },
        secondary: {
            main: '#f7a7a7', 
        },
        background: {
            default: '#fdfdfd', 
            paper: '#ffffff', 
        },
        text: {
            primary: '#333333', 
            secondary: '#555555', 
        },
    },
});
  
const darkTheme = createTheme({
    typography: {
        fontFamily: 'Georgia, serif', 
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#5d9cec', 
        },
        secondary: {
            main: '#f7a7a7', 
        },
        background: {
            default: '#1f1f1f', 
            paper: '#2c2c2c', 
        },
        text: {
            primary: '#ffffff', 
            secondary: '#cccccc',
        },
    },
});
  

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [themeMode, setThemeMode] = useState('dark'); 

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (password.length <= 5) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/pantry'); // Redirect to pantry page after sign up
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'An account already exists with this email address.';
          break;
        default:
          errorMessage = 'Failed to sign up. Please check your details and try again.';
      }
      setError(errorMessage);
    }
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const appliedTheme = themeMode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit" sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>
            StockUp
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: 'auto', flexGrow: 1 }}>
            <IconButton edge="end" color="inherit" onClick={toggleTheme} aria-label="toggle theme">
              {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xs">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="80vh"
          textAlign="center"
          sx={{
            backgroundColor: appliedTheme.palette.background.default,
            padding: 3
          }}
        >
          <Box
            component="form"
            onSubmit={handleSignUp}
            noValidate
            sx={{
              backgroundColor: appliedTheme.palette.background.paper,
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
              width: '100%',
              maxWidth: '400px',
              border: `2px solid ${appliedTheme.palette.primary.main}`, // Blue border
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: appliedTheme.palette.text.primary }}>
              Sign Up
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: appliedTheme.palette.text.primary } }}
              InputProps={{
                style: { color: appliedTheme.palette.text.primary },
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: appliedTheme.palette.secondary.main,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: appliedTheme.palette.text.primary,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: appliedTheme.palette.text.primary,
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: appliedTheme.palette.text.primary } }}
              InputProps={{
                style: { color: appliedTheme.palette.text.primary },
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: appliedTheme.palette.secondary.main,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: appliedTheme.palette.text.primary,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: appliedTheme.palette.text.primary,
                  },
                },
              }}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Button
              fullWidth
              variant="text"
              color="secondary"
              onClick={handleSignIn}
            >
              Already have an account? Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUpPage;
