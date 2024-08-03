'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Typography, AppBar, Toolbar, CssBaseline, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
      
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
  
const LandingPage = () => {
    const [theme, setTheme] = useState('dark');
    const router = useRouter();
  
    const handleSignIn = () => {
      router.push('/signin');
    };
  
    const toggleTheme = () => {
      setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };
  
    const appliedTheme = theme === 'light' ? lightTheme : darkTheme;
  
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
                        {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
        <Container
          maxWidth="md"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            background: appliedTheme.palette.background.default,
          }}
        >
          <Box
            sx={{
              backgroundColor: appliedTheme.palette.background.paper,
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
              width: '100%',
              maxWidth: '600px',
              border: `2px solid ${appliedTheme.palette.primary.main}`, 
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', color: appliedTheme.palette.primary.main }}>
                StockUp
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: appliedTheme.palette.secondary.main }}>
              Reduce waste, save time, and make smarter meal decisions!
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontFamily: 'Roboto, sans-serif', color: appliedTheme.palette.text.primary, margin: '0 20px' }}>
              Streamline your kitchen management with a <strong>user-friendly platform</strong> that helps you <em>organize</em> and <em>plan</em> your meals efficiently.
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleSignIn} 
              sx={{ 
                mt: 4, 
                padding: '12px 24px', 
                fontWeight: 'bold', 
                backgroundColor: appliedTheme.palette.secondary.main,
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: appliedTheme.palette.secondary.dark, 
                },
              }}
            >
              Ready to StockUp
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    );
};

export default LandingPage;
