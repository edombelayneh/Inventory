'use client'
// When you come back to it again just work on finding the modules for AddIcon and RemoveIcon!!
import { Box, Stack, Typography, Button, Modal, TextField, IconButton, Paper, AppBar, Toolbar, Container, Divider, CircularProgress } from "@mui/material";
import { useEffect, useState } from 'react';
import { firestore, auth } from "@/firebase";
import { collection, deleteDoc, doc, query, getDocs, getDoc, setDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
// import withAuth from '../protectedRoute';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  

const headerStyle = {
  bgcolor: "#5d9cec",
  color: "#fff",
  textAlign: "center",
  p: 2,
  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0, 0.1)",
  borderRadius: "10px",
}

const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  bgcolor: "#f0f0f0",
  p: 2,
  borderRadius: "5px",
  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0, 0.1)",
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  borderRadius: "10px",
};

const recipeStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper', 
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    borderRadius: "10px",
}

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [recipeOpen, setRecipeOpen] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(''); 
  const [themeMode, setThemeMode] = useState('dark'); 
  const [userEmail, setUserEmail] = useState(''); 
  const [userUid, setUserUid] = useState(''); 
  const [itemName, setItemName] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('name');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('null');
  const [category, setCategory] = useState('');
  const router = useRouter(); 

  const handleOpen = () => setAddOpen(true);
  const handleClose = () => setAddOpen(false);
  const handleRecipeModalOpen = () => setRecipeOpen(true); 
  const handleRecipeModalClose = () => setRecipeOpen(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setUserUid(user.uid);
      } else {
        setUserEmail('');
        setUserUid('');
      }
    });

    return () => unsubscribe(); 
  }, []);

  const updatePantry = async () => {
    if (userUid){
        const snapshot = query(collection(firestore, `pantry-items-${userUid}`));
        const docs = await getDocs(snapshot);
        const pantryList = [];
        const categorySet = new Set();
        docs.forEach((doc) => {
        const data = doc.data();
        const [itemName, itemCategory] = doc.id.split('-'); 
        pantryList.push({ name: itemName, category: itemCategory, ...data });
        if (itemCategory) {  
            categorySet.add(itemCategory);
        }
        });
        pantryList.sort((a, b) => a.name.localeCompare(b.name));
        setPantry(pantryList);
        setCategories(Array.from(categorySet));
        setSelectedCategory('');  
    }
  };

  useEffect(() => {
    if (userUid) {
      updatePantry();
    }
  }, [userUid]);

  const addItem = async (item, category) => {  
    if (userUid) {
        const docRef = doc(collection(firestore, `pantry-items-${userUid}`), `${item}-${category}`);  
        // Check if item already exists
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()){
        const {count} = docSnap.data();
        await setDoc(docRef, {count: count + 1, category});
        } else{
        await setDoc(docRef, {count: 1, category});
        }
        await updatePantry();
    }
  };

  const removeItem = async (item, category) => {  
    if (userUid) {
        const docRef = doc(collection(firestore, `pantry-items-${userUid}`), `${item}-${category}`);  
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()){
        const {count} = docSnap.data();
        if (count === 1){
            await deleteDoc(docRef);
        } else{
            await setDoc(docRef, {count: count - 1, category});
        }
        }
        await updatePantry();
    }
  };

  const getInventoryItems = async () => {
    if (userUid) {
        const snapshot = query(collection(firestore, `pantry-items-${userUid}`));
        const querySnapshot = await getDocs(snapshot);  // Get the QuerySnapshot object
        const items = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const [itemName] = doc.id.split('-');  // Extracted item name
        return itemName;  // Return item name or modify as needed
        });
        return items;
    }
  };
  
  const handleGetRecipes = async () => {
    setLoading(true);
    const inventory = await getInventoryItems();
  
    const response = await fetch('api/recipe-suggestions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: inventory }),
    });
  
    const data = await response.json();
    setSuggestions(data.recipe);
    handleRecipeModalOpen();
    setLoading(false);
  };

  
  const searchItem = () => {
    const item = pantry.find((item) => item.name.toLowerCase() === searchQuery.toLowerCase());
    if (item) {
      setSearchResult(`${item.name.charAt(0).toUpperCase() + item.name.slice(1)}: ${item.count}`);
    } else {
      setSearchResult('Item not found');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/'); 
  };

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const appliedTheme = themeMode === 'light' ? lightTheme : darkTheme;

  return (
  <ThemeProvider theme={appliedTheme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            StockUp
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: 'auto', flexGrow: 1 }}>
            <IconButton edge="end" color="inherit" onClick={toggleTheme} aria-label="toggle theme">
              {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

    {/* Middle of the page stuff */}
    <Container>
      <Stack direction="column" spacing={2} alignItems='center'>
        {/* From here on down is the entire thing for the Pantry tracker form */}
        <Box
          sx={{
            width: "100vw",
            height: "85vh",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: "2",
            bgcolor: 'background.default',
            color: 'text.primary',
          }}>

          {/* Search Box */}
          <Box sx={{mb: 3}}>
            <Stack direction="row" spacing={4} alignItems="center">
                {/* Done go back to landing page */}
                <Box x={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', width: 'auto' }}>
                    <Button
                        variant="contained"
                        onClick={handleSignOut}>
                        <ArrowBackIcon />
                    </Button>
                </Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 0 }}>
                <TextField
                  label="Search Item"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      searchItem();
                  }}}/>
                <Button
                  variant="contained"
                  onClick={() => searchItem(searchQuery)}
                  sx={{minWidth: "100px"}}>
                    Search
                </Button>
              </Stack>
              {/* Search result */}
                {searchResult && (
                <Paper elevation={3} sx={{mt: 3, p: 2, textAlign: 'center'}}>
                    {searchResult}
                </Paper>
                )}       

              {/* Add Button and Modal for pop up screen */}
              <Modal
                open={addOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description" >
                <Box sx={modalStyle}>
                  <Typography id="modal-modal-title" variant="h6" component="h2" color={themeMode === 'dark' ? 'text.primary' : 'text.secondary'}>
                    Add Item
                  </Typography>
                  <Stack
                    width="100%"
                    direction="row"
                    spacing={2} >
                    <TextField
                      id="outlined-basic"
                      label="Item"
                      variant="outlined"
                      fullWidth
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)} />
                    <TextField
                      id="item-category"
                      label="Category"
                      variant="outlined"
                      fullWidth
                      value={category}
                      onChange={(e) => setCategory(e.target.value)} />
                   
                    <Button variant="contained"
                      gap={2}
                      onClick={() => {
                        addItem(itemName, category)
                        setItemName('')
                        setCategory('')
                        handleClose()
                      }} >
                      Add
                    </Button>
                  </Stack>
                </Box>
              </Modal>
              <Button 
                variant="contained"
                onClick={handleOpen}>
                Add
              </Button>
            </Stack>
            </Box>

          {/* Literally the whole table */}
          {/* Header */}
          <Box
             sx={{
                bgcolor: 'background.default', 
              }}>
            <Paper elevation={3}>
              <Box
                sx={headerStyle}
                width="800px"
                height="90px"
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                mb={2}>
                <Typography
                  variant="h3"
                  textAlign={'center'}>
                  Pantry Items
                </Typography>
              </Box>
            </Paper>
        
            {/* Pantry Items List */}
            <Box sx={{ mb: 3}}>
              <Stack direction="row" spacing={4} alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  {/* Sort by name */}
                  <Button 
                    variant={sortCriteria === 'name' ? 'contained' : 'outlined' }
                    onClick={() => setSortCriteria('name')}>
                    Sort by Name 
                  </Button>
                  {/* Sort by quantity */}
                  <Button 
                    variant={sortCriteria === 'quantity' ? 'contained' : 'outlined' }
                    onClick={() => setSortCriteria('quantity')}> 
                    Sort by Quantity 
                  </Button>
                </Stack>
                {/* Category filter */}
                {/* Something to fix here...when inputting category the same thing when it comes to lowercase and uppercase counts twice */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: 'auto', flexGrow: 1 }}>
                  <TextField
                    select
                    label="Category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    SelectProps={{
                      native: true,
                    }}
                    variant="outlined"
                    sx={{ ml: 'auto', minWidth: '200px', alignContent: 'right' }}
                    InputLabelProps={{
                      shrink: true,
                    }}>
                    <option value="">
                      All
                    </option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </TextField>
                </Box>
              </Stack>
            </Box>
        
            {/* We used stack instead of box becuase we want it to be vertically stacked and wanted a table design*/}
            <Stack
              width="800px"
              height="300px"
              spacing={2}
              overflow={'auto'}>
              {pantry
                .filter(({ name, category }) =>
                  (searchQuery ? name.toLowerCase().includes(searchQuery.toLowerCase()) : true) &&
                  (selectedCategory ? category === selectedCategory : true)
                  
                )
                .sort((a, b) => {
                  if (sortCriteria === 'name') {
                    return a.name.localeCompare(b.name);
                  } else if (sortCriteria === 'quantity'){
                    return b.count - a.count;
                  }
                  return 0;
                })
                .map(({ name: itemName, count, category }) => ( 
                  <Paper elevation={3} key={`${itemName}-${category}`}>
                    <Box
                      key={`${itemName}-${category}`} 
                      sx={itemStyle}
                      width="100%"
                      minHeight="100px" >
                    
                      <Typography 
                        variant={"h4"} 
                        color={'#333'}
                        textAlign = {'center'} >
                  
                        {
                          //Capitalize the first letter of the item
                          itemName.charAt(0).toUpperCase() + itemName.slice(1)
                        }                 
                      </Typography>
  
                      {/* + and - to add and remove */}
                      <Stack direction={'column'} spacing={1} justifyContent={'center'}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <IconButton
                            onClick={() => addItem(itemName, category)}>
                            <AddIcon sx={{color: "#1976d2"}}/>
                          </IconButton>
                          <Typography 
                            variant={"h4"}
                            color={'#333'}
                            textAlign={'center'}>
                            {count}
                          </Typography>
                          <IconButton
                            onClick={() => removeItem(itemName, category)} >
                           <RemoveIcon sx={{color: "#1976d2"}} />
                          </IconButton>
                        </Stack>
                        <Box
                          textAlign={'right'}>
                          <Typography
                            variant="caption"  // Use "caption" for smaller font size
                            align="right"
                            color={"#1976d2"}
                            mt={1}>
                            {category}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Paper>
                ))
              }
            </Stack>
        </Box>
        
          {/* From here on up is the entire thing for the Pantry tracker form */}
          {/* ************************************************************************************************************** */}
          {/* From here on down is the entire thing for the Generate Recipe Suggestion */}
          {/* Recipe Suggestion Section */}
          <Divider orientation="vertical" flexItem />
          {/* Recipe Suggestions Modal */}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Modal
              open={recipeOpen}
              onClose={handleRecipeModalClose}
              aria-labelledby="recipe-modal-title"
              aria-describedby="recipe-modal-description">                
                <Box sx={recipeStyle}>
                  <Typography id="recipe-modal-description" color={themeMode === 'dark' ? 'text.primary' : 'text.secondary'}>
                    {suggestions && ( 
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {suggestions}
                        </ReactMarkdown>
                    )}
                  </Typography>
                </Box>
              </Modal>
              <Button
                variant="contained"
                onClick={handleGetRecipes}
                disabled={loading}
                sx={{minWidth: "200px"}} >
                  {loading ? <CircularProgress size={24} /> : "Find me a recipe"}
              </Button>
            </Box>
            {/* From here on up is the entire thing for the Generate Recipe Suggestion */}          
        </Box>
      </Stack>
    </Container>
   

    <AppBar position="static" >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'center'}}>
          Edom Belayneh @August 2024
        </Typography>
      </Toolbar>
    </AppBar>
  </ThemeProvider>
  );
}
