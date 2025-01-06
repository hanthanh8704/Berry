import React, { useEffect, useState } from "react";
import { Outlet } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
// index.js or index.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Header from 'layout/client/header/Header.jsx';
import MenuCustomer from 'layout/client/menu/Menu.jsx';
import Footer from 'layout/client/footer/Footer.jsx';
import { Menu } from '@mui/material';
import { MenuOpenOutlined } from '@mui/icons-material';
import axios from "axios";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "/src/configs/chatbotConfig";
import MessageParser from "/src/chatbot/MessageParser";
import ActionProvider from "/src/chatbot/ActionProvider";

const MainClient = () => {
    const [leftDrawerOpened, setLeftDrawerOpened] = React.useState(true);

    const handleLeftDrawerToggle = () => {
        setLeftDrawerOpened(!leftDrawerOpened);
    };

    const [showChatbot, setShowChatbot] = useState(false);

    // Hàm toggle để hiển thị/ẩn chatbot
    const toggleChatbot = () => {
      setShowChatbot(!showChatbot);
    };

    const [user, setUser] = useState(null);
    const [customerLe, setCustomerLe] = useState(null); // Thêm state cho khách hàng lẻ
    
    const twelveHours = 12 * 60 * 60 * 1000; // 12 tiếng tính bằng mili giây

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');

        if (!isAuthenticated) {
            const createdTime = localStorage.getItem('customerLeCreatedTime');
            const currentTime = Date.now();

            if (!createdTime || currentTime - createdTime > twelveHours) {
                axios.post(`http://localhost:8080/api/gio-hang/auto-create-customerLe`)
                    .then((response) => {
                        setCustomerLe(response.data);
                        console.log("Khách hàng lẻ được tạo:", response.data);

                        localStorage.setItem('customerLeCreatedTime', currentTime);
                        localStorage.setItem('customerId', response.data.id);
                        localStorage.setItem('customerName', response.data.fullName);
                        setUser({
                            customerId: response.data.id,
                            customerName: response.data.fullName,
                        });
                    })
                    .catch((e) => {
                        console.error("Lỗi khi tạo khách hàng lẻ:", e);
                    });
            } else {
                setUser({
                    customerId: localStorage.getItem('customerId'),
                    customerName: localStorage.getItem('customerName'),
                });
                console.log("Using existing customer:", {
                    customerId: localStorage.getItem('customerId'),
                    customerName: localStorage.getItem('customerName')
                });
            }
        }
    }, []);

    return (
        // <UserProvider> {/* Bao bọc toàn bộ ứng dụng với UserProvider */}
        <div className='html' style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            {/* Header */}
            <header style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'white' }}>
                <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
            </header>

            {/* Menu */}
            <div style={{ position: 'sticky', top: '60px', zIndex: 1000, backgroundColor: 'white' }}>
                <MenuCustomer drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />
            </div>

            {/* Main content */}
            <Container>
                <Outlet />
                {showChatbot && (
  <div className="chatbot-container">
    <Chatbot
      config={config}
      messageParser={MessageParser}
      actionProvider={ActionProvider}
    />
  </div>
)}

<button className="chatbot-button" onClick={toggleChatbot}>
  🤖
</button>
            </Container>

            {/* Footer */}
            <footer className="footer mt-auto py-3 bg-light">
                <Container>
                    <Footer />
                </Container>
            </footer>
        </div>
        // </UserProvider>
    );

};

export default MainClient;