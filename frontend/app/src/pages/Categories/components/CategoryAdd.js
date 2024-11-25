import React, { useState } from 'react';
import { Fab, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { Theme } from '../../../styles/themes/Theme'


const db = getFirestore();

const CategoryAdd = ({ user, fetchCategories }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [catDetails, setCatDetails] = useState({ name: '', monthlyBudget: '', color: '#FFFFFF' });

    const handleAddCategory = () => setShowPopup(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCatDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleSave = async () => {
        if (catDetails.name.trim()) {
            try {
                const categoriesCollectionRef = collection(db, 'users', user.uid, 'categories');
                
                // Normalize the category name to lowercase for comparison
                const normalizedCategoryName = catDetails.name.trim().toLowerCase();

                // Retrieve all categories and perform a case-insensitive check
                const querySnapshot = await getDocs(categoriesCollectionRef);
                const categories = querySnapshot.docs.map(doc => doc.data().name.toLowerCase());

                if (categories.includes(normalizedCategoryName)) {
                    alert('Category with this name already exists');
                    return;
                }

                // Proceed with saving if no duplicate is found
                await addDoc(categoriesCollectionRef, {
                    name: catDetails.name.trim(),  // Save the original case-sensitive name
                    monthlyBudget: catDetails.monthlyBudget || null,  // Optional field
                    color: catDetails.color || '#FFFFFF',  // Optional field
                    createdAt: new Date(),
                });

                // Reset the form after saving
                setCatDetails({ name: '', monthlyBudget: '', color: '#FFFFFF' });
                setShowPopup(false);
                fetchCategories();
            } catch (error) {
                console.error('Error saving category:', error);
                alert('Error saving category');
            }
        } else {
            alert('Category name is required');
        }
    };

    const handleCancel = () => {
        setShowPopup(false);
        setCatDetails({ name: '', monthlyBudget: '', color: '#FFFFFF' });  // Reset form
    };

    // const useStyles = makeStyles(() => ({
    //     styleRed: {
          
    //     },
    //     styleBlue: {
    //       '&:hover': {
    //         color: 'red'
    //       }
    //     }
    //   }));

    //   const classes = useStyles()
    return (
        <div className="category-add">
            {/* Main + button */}
            <Tooltip title="Add Category" placement="left">
                <Fab 
                    sx={{
                        '&:hover': {
                            color: Theme.palette.accent.main
                          }, 
                        backgroundColor: Theme.palette.primary.main, 
                        color: Theme.palette.primary.contrastText
                        
                    }}
                    onClick={handleAddCategory}
                    >
                    <AddIcon   />
                </Fab>
            </Tooltip>

            {/* Dialog for adding category */}
            <Dialog open={showPopup} onClose={handleCancel}>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Category Name"
                        variant="outlined"
                        name="name"
                        value={catDetails.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="dense"
                    />
                    <TextField
                        label="Monthly Budget (Optional)"
                        variant="outlined"
                        name="monthlyBudget"
                        value={catDetails.monthlyBudget}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                        type="number"
                    />
                    <Box mt={2}>
                        <TextField
                            label="Select Color (Optional)"
                            variant="outlined"
                            name="color"
                            value={catDetails.color}
                            onChange={handleChange}
                            fullWidth
                            type="color"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} 
                            sx={{
                                color: Theme.palette.primary.dark, 
                                borderColor: Theme.palette.primary.dark, 
                                '&:hover': {
                                  background: Theme.palette.secondary.light,
                                  color: Theme.palette.accent.main}}} 
                            variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} 
                            sx={{
                                backgroundColor: Theme.palette.primary.dark, 
                                color: Theme.palette.primary.contrastText,
                                '&:hover': {
                                  background: Theme.palette.primary.main,
                                  }
                                }} 
                            variant="outlined">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CategoryAdd;
