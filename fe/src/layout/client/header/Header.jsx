import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#6A0DAD', padding: '0.5rem 0' ,margin: 0 }}>
            <Toolbar>
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" sx={{ color: 'white' }}>
                            ĐIỆN THOẠI: 0939977745
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Typography component={Link} to="/login" sx={{ color: 'white', textDecoration: 'none', marginX: 1 }}>
                            ĐĂNG NHẬP
                        </Typography>
                        <Typography sx={{ color: 'white', marginX: 1 }}>|</Typography>
                        <Typography component={Link} to="/sign-up" sx={{ color: 'white', textDecoration: 'none', marginX: 1 }}>
                            ĐĂNG KÝ
                        </Typography>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
