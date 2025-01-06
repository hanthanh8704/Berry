import React, { useEffect, useState } from 'react';
import { Layout, Input, Button, Row, Col, Modal, Typography } from 'antd';
import { SearchOutlined, BarcodeOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import axios from "axios";
const { Content } = Layout;
const { Title } = Typography;

const TraHang = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [maHoaDon, setMaHoaDon] = useState('');

  const handleSearch = async () => {
    if (!maHoaDon) {
      toast.error('Vui lòng nhập mã hóa đơn');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/return-order/information`, {
        params: { codeBill: maHoaDon },
      });

      if (response.status === 200) {
        console.log('Đơn hàng:', response.data);
        toast.success('Tìm kiếm thành công đơn hàng muốn trả!');
        setTimeout(() => {
          navigate(`/return-order/${response.data.data.codeBill}`);
        }, 2000);
      } else {
        toast.error('Không tìm thấy hóa đơn');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.data || 'Lỗi khi tìm kiếm hóa đơn';
      toast.error(errorMessage);
    }
  };

  const handleQRCodeScan = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    let html5QrCode;

    if (isModalVisible) {
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      html5QrCode = new Html5Qrcode("reader");

      html5QrCode.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          setMaHoaDon(decodedText);
          html5QrCode.stop().catch((err) => console.warn("Lỗi khi dừng camera", err));
          setIsModalVisible(false);

          try {
            const response = await axios.get(`http://localhost:8080/api/return-order/information`, {
              params: { codeBill: decodedText },
            });

            if (response.status === 200) {
              console.log('Đơn hàng:', response.data);
              toast.success('Tìm kiếm thành công đơn hàng muốn trả!');
              setTimeout(() => {
                navigate(`/return-order/${response.data.data.codeBill}`);
              }, 2000);
            } else {
              toast.error('Không tìm thấy hóa đơn');
            }
          } catch (error) {
            const errorMessage = error.response?.data?.data || 'Lỗi khi tìm kiếm hóa đơn';
            toast.error(errorMessage);
          }
        },
        (errorMessage) => {
          console.log("Lỗi khi quét mã QR", errorMessage);
        }
      ).catch((err) => {
        console.error("Lỗi khi mở camera", err);
        toast.error("Không thể mở camera. Hãy kiểm tra quyền truy cập và thiết bị có camera.");
      });
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch((err) => console.warn("Lỗi khi dừng camera", err));
      }
    };
  }, [isModalVisible]);

  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Title level={5} className="mx-4 my-4 text-dark text-uppercase">
        Trả hàng
      </Title>
      <Content style={{ padding: '20px', textAlign: 'center' }}>
        <Row justify="center" style={{ marginBottom: '20px' }}>
          <label className='mt-2 mx-2'><b>Mã hóa đơn:</b></label>
          <Col span={8}>
            <Input
              size="large"
              placeholder="Nhập mã hóa đơn cần trả hàng..."
              value={maHoaDon}
              onChange={(e) => setMaHoaDon(e.target.value)}
            />
          </Col>
          <Button
            icon={<SearchOutlined />}
            className='mx-2'
            style={{ height: '38px', backgroundColor: '#6A0DAD', color: 'white' }}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
          <Button
            icon={<BarcodeOutlined />}
            style={{ height: '38px', backgroundColor: 'blue', color: 'white' }}
            onClick={handleQRCodeScan}
          >
            QR CODE
          </Button>
        </Row>
      </Content>
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={300}
      >
        <div id="reader" style={{ width: '100%', height: '300px' }}></div>
      </Modal>

      <ToastContainer />
    </Layout>
  );
};

export default TraHang;
