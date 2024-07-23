import { Button, Col, Form, Input, Modal, Row, Select, Slider, Table, Tag, Pagination, InputNumber } from 'antd';
import React, { useState, useEffect } from 'react';
import * as request from 'views/utilities/httpRequest';
import { toast } from 'react-toastify';
import FormatCurrency from 'views/utilities/FormatCurrency';
const { Option } = Select;

function ShowProductModal({ idHoaDon, onClose }) {
  const [formFilter] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  const [listKichCo, setListKichCo] = useState([]);
  const [searchKichCo, setSearchKichCo] = useState('');
  const [listMauSac, setListMauSac] = useState([]);
  const [listChatLieu, setListChatLieu] = useState([]);
  const [listThuongHieu, setListThuongHieu] = useState([]);
  const [listTayAo, setListTayAo] = useState([]);
  const [listCoAo, setListCoAo] = useState([]);
  const [dataFilter, setDataFilter] = useState({});
  const [priceRange, setPriceRange] = useState([100000, 1000000]);

  useEffect(() => {
    loadData(dataFilter);
  }, [isModalOpen, dataFilter, currentPage, pageSize,priceRange]);

  const loadData = (dataFilter) => {
    request
      .get('/shirt-detail', {
        params: {
          ten: dataFilter.ten,
          kichCo: dataFilter.kichCo,
          mauSac: dataFilter.mauSac,
          chatLieu: dataFilter.chatLieu,
          thuongHieu: dataFilter.thuongHieu,
          tayAo: dataFilter.tayAo,
          coAo: dataFilter.coAo,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          page: currentPage,
          sizePage: pageSize
        }
      })
      .then((response) => {
        setProductList(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    request
      .get('/size', { params: { name: searchKichCo } })
      .then((response) => {
        setListKichCo(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    request
      .get('/color', { params: { name: searchKichCo } })
      .then((response) => {
        setListMauSac(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    request
      .get('/material', { params: { name: searchKichCo } })
      .then((response) => {
        setListChatLieu(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    request
      .get('/brand', { params: { name: searchKichCo } })
      .then((response) => {
        setListThuongHieu(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    request
      .get('/sleeve', { params: { name: searchKichCo } })
      .then((response) => {
        setListTayAo(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    request
      .get('/collar', { params: { name: searchKichCo } })
      .then((response) => {
        setListCoAo(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [isModalOpen, searchKichCo]);

  const handleChoose = (chiTietSanPham) => {
    setSelectedProduct({
      ...chiTietSanPham,
      newPrice: chiTietSanPham.giaTriDaGiam !== null ? chiTietSanPham.giaTriDaGiam : chiTietSanPham.giaBan,
      oldPrice: chiTietSanPham.giaBan
    });
    setIsSelectModalOpen(true);
  };

  const handleConfirm = () => {
    const data = {
      chiTietSanPham: selectedProduct?.maSPCT,
      hoaDon: idHoaDon,
      giaBan: selectedProduct?.newPrice,
      soLuong: quantity
    };
    request
      .post('/bill-detail', data)
      .then((response) => {
        toast.success('Thêm thành công!');
        loadData(dataFilter);
        setIsSelectModalOpen(false);
        setQuantity(1);
      })
      .catch((e) => {
        toast.error(e.response.data);
      });
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index'
    },
    {
      title: 'Ảnh',
      dataIndex: 'images',
      key: 'images',
      render: (images) => <img src={images.split(',')[0]} alt="" width={50} height={50} />
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      key: 'ten'
    },
    {
      title: 'Cổ áo',
      dataIndex: 'coAo',
      key: 'coAo'
    },
    {
      title: 'Tay Áo',
      dataIndex: 'tayAo',
      key: 'tayAo'
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'thuongHieu',
      key: 'thuongHieu'
    },
    {
      title: 'Màu sắc',
      dataIndex: 'mauSac',
      key: 'mauSac'
    },
    {
      title: 'Chất liệu',
      dataIndex: 'chatLieu',
      key: 'chatLieu'
    },
    {
      title: 'Size',
      dataIndex: 'kichCo',
      key: 'kichCo'
    },
    {
      title: 'Số Lượng',
      dataIndex: 'soLuong',
      key: 'soLuong'
    },
    {
      title: 'Giá',
      dataIndex: 'giaBan',
      key: 'giaBan',
      render: (giaBan, record) => (
        <>
          {record.giaTriDaGiam !== null ? (
            <>
              <span className="text-decoration-line-through">
                <FormatCurrency value={record.giaBan} />
              </span>
              <br />
              <span className="text-danger">
                <FormatCurrency value={record.giaTriDaGiam} />
              </span>
            </>
          ) : (
            <span className="text-danger">
              <FormatCurrency value={record.giaBan} />
            </span>
          )}
        </>
      )
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => handleChoose(record)}>
          Chọn
        </Button>
      )
    }
  ];

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Thêm sản phẩm
      </Button>
      <Modal
        title="Danh sách sản phẩm"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          onClose();
        }}
        footer={null}
        width={1200}
      >
        <Form layout="vertical" onFinish={(data) => setDataFilter(data)} form={formFilter}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Tên sản phẩm" name="ten">
                <Input placeholder="Tìm kiếm sản phẩm theo tên..." />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Kích cỡ" name="kichCo">
                <Select
                  showSearch
                  placeholder="Chọn kích cỡ..."
                  optionFilterProp="children"
                  onSearch={setSearchKichCo}
                >
                  <Option value="">Tất cả</Option>
                  {listKichCo.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.ten}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Màu sắc" name="mauSac">
                <Select
                  showSearch
                  placeholder="Chọn màu sắc..."
                  optionFilterProp="children"
                  onSearch={setSearchKichCo}
                >
                  <Option value="">Tất cả</Option>
                  {listMauSac.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.ten}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Chất liệu" name="chatLieu">
                <Select
                  showSearch
                  placeholder="Chọn chất liệu..."
                  optionFilterProp="children"
                  onSearch={setSearchKichCo}
                >
                  <Option value="">Tất cả</Option>
                  {listChatLieu.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.ten}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Thương hiệu" name="thuongHieu">
                <Select
                  showSearch
                  placeholder="Chọn thương hiệu..."
                  optionFilterProp="children"
                  onSearch={setSearchKichCo}
                >
                  <Option value="">Tất cả</Option>
                  {listThuongHieu.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.ten}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Tay áo" name="tayAo">
                <Select
                  showSearch
                  placeholder="Chọn kiểu tay áo..."
                  optionFilterProp="children"
                  onSearch={setSearchKichCo}
                >
                  <Option value="">Tất cả</Option>
                  {listTayAo.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.ten}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Cổ áo" name="coAo">
                <Select
                  showSearch
                  placeholder="Chọn kiểu cổ áo..."
                  optionFilterProp="children"
                  onSearch={setSearchKichCo}
                >
                  <Option value="">Tất cả</Option>
                  {listCoAo.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.ten}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Khoảng giá">
                <Slider
                  min={100000}
                  max={1000000}
                  range
                  value={priceRange}
                  step={10000}
                  tooltipVisible
                  tipFormatter={(value) => `${value.toLocaleString()} VND`}
                  onChange={(value) => setPriceRange(value)}
                  onAfterChange={() => loadData(dataFilter)} // Tải lại dữ liệu khi khoảng giá thay đổi
                />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit" style={{marginBottom: 10,marginTop: 16, textAlign: 'right' }}>
            Lọc
          </Button>
        </Form>
        <Table columns={columns} dataSource={productList} pagination={false} />
        <Pagination
          current={currentPage}
          total={totalPages * pageSize}
          onChange={(page) => setCurrentPage(page)}
          pageSize={pageSize}
          style={{ marginTop: 16, textAlign: 'right' }}
        />
      </Modal>
      <Modal
        title="Chi tiết sản phẩm"
        visible={isSelectModalOpen}
        onOk={handleConfirm}
        onCancel={() => setIsSelectModalOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        {selectedProduct && (
          <>
            <Row gutter={16}>
              <Col span={8}>
                <img src={selectedProduct?.images.split(',')[0]} alt="" width="100%" />
              </Col>
              <Col span={16}>
                <h3>{selectedProduct?.ten}</h3>
                <p>
                  Giá: <span className="text-danger"><FormatCurrency value={selectedProduct?.newPrice} /></span> {selectedProduct?.newPrice !== selectedProduct?.oldPrice && <span className="text-decoration-line-through"><FormatCurrency value={selectedProduct?.oldPrice} /></span>}
                </p>
                <InputNumber min={1} value={quantity} onChange={setQuantity} />
              </Col>
            </Row>
          </>
        )}
      </Modal>
    </>
  );
}

export default ShowProductModal;
