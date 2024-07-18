import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
// index.js or index.jsx
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from 'layout/client/header/Header.jsx';
import MenuCustomer from 'layout/client/menu/Menu.jsx';
import Footer from 'layout/client/footer/Footer.jsx';
import { Menu } from '@mui/material';
import { MenuOpenOutlined } from '@mui/icons-material';

const MainClient = () => {
    const [leftDrawerOpened, setLeftDrawerOpened] = React.useState(true);

    const handleLeftDrawerToggle = () => {
        setLeftDrawerOpened(!leftDrawerOpened);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            {/* Header */}
            <Header Container>
                <Container>
                    <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                </Container>
            </Header>
            {/* Menu */}
            <div>
                {/* <Container> */}
                    <MenuCustomer drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />
                {/* </Container> */}
            </div>
            {/* Main content */}
            <Container>
                <Outlet />
            </Container>

            {/* Footer */}
            <footer className="footer mt-auto py-3 bg-light">
                {/* <Container> */}
                    <Footer />
                {/* </Container> */}
            </footer>
        </div>
    );
};

export default MainClient;
