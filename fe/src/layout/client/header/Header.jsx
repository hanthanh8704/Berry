import React, {useState  ,useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated) {
            const userInfo = {
                role: localStorage.getItem('userRole'),
                email: localStorage.getItem('userEmail'),
                username: localStorage.getItem('username'),
                customerId: localStorage.getItem('customerId'),
                customerName: localStorage.getItem('customerName'),
                customerEmail: localStorage.getItem('customerEmail'),
                customerPhoneNumber: localStorage.getItem('customerPhoneNumber'),
            };
            setUser(userInfo);
        }
    }, []);
    
    
    console.log("User sau khi đăng nhập product detail:", user);
    
    return (
        <AppBar position="static" sx={{ backgroundColor: '#6A0DAD', padding: '0.5rem 0', margin: 0 }}>
            <Toolbar>
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" sx={{ color: 'white' }}>
                            {user ? <p>Xin chào, {user.customerName}!</p> : <p>Bạn chưa đăng nhập?</p>}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Typography component={Link} to="/login" sx={{ color: 'white', textDecoration: 'none', marginX: 1 }}>
                            ĐĂNG NHẬP
                        </Typography>
                        <Typography sx={{ color: 'white', marginX: 1 }}>|</Typography>
                        <Typography component={Link} to="/sign-in" sx={{ color: 'white', textDecoration: 'none', marginX: 1 }}>
                            ĐĂNG KÝ
                        </Typography>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
