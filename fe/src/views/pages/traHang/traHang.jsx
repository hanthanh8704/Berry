import React, { useState } from 'react';
import { Layout, Input, Button, Row, Col } from 'antd';
import { SearchOutlined, BarcodeOutlined } from '@ant-design/icons';
import { search ,findAllSPCTByIdHd , createTH } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
const { Content } = Layout;

const TraHang = () => {
  const navigate = useNavigate();

  const [maHoaDon, setMaHoaDon] = useState('');
 

  const handleSearch = async () => {
    if (!maHoaDon) {
      toast.error('Vui lòng nhập mã hóa đơn');
      return;
    }
    try {
      const response = await search(maHoaDon);
      if (response.status === 200) {

        toast.success('Tìm kiếm thành công!');
        setTimeout(() => {
          navigate(`/tra-hang/hoa-don/${response.data.id}`);
        }, 2000);
        console.log(response.data);
         // Handle the response data as needed
      } else {
        toast.error('Không tìm thấy hóa đơn');
      }
    } catch (error) {
      toast.error('Lỗi khi tìm kiếm hóa đơn');
    }
  };

  return (
    <Layout style={{ backgroundColor: 'white' }}>
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
          <Button icon={<BarcodeOutlined />} style={{ height: '38px', backgroundColor: 'blue', color: 'white' }}>
            Quét mã
          </Button>
        </Row>
      </Content>
      <ToastContainer />
    </Layout>
  );
};

export default TraHang;
