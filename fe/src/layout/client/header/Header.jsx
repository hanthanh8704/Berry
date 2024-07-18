import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { AppBar, Toolbar, Box, Typography, Button } from '@mui/material';

const Header = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#6A0DAD', padding: '0.5rem 0' }}>
            <Toolbar>
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" sx={{ color: 'white' }}>
                            ĐIỆN THOẠI: 0939977745
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Button color="inherit" sx={{ color: 'white' }}>ĐĂNG NHẬP</Button>
                        <Typography sx={{ color: 'white', marginX: 1 }}>|</Typography>
                        <Button color="inherit" sx={{ color: 'white' }}>ĐĂNG KÝ</Button>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
