import { Button, Col, Form, Input, Modal, Row, Select, Slider, Table, Tag, Pagination, InputNumber } from 'antd';
import React, { useState, useEffect } from 'react';
import * as request from 'views/utilities/httpRequest';
import { toast } from 'react-toastify';
import FormatCurrency from 'views/utilities/FormatCurrency';
import { Hidden } from '@mui/material';
const { Option } = Select;

function ShowProductModal({ idBill, onClose }) {
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
  }, [isModalOpen, dataFilter, currentPage, pageSize, priceRange]);

  const loadData = (dataFilter) => {
    request
      .get('/shirt-detail', {
        params: {
          name: dataFilter.name,
          size: dataFilter.size,
          color: dataFilter.color,
          material: dataFilter.material,
          brand: dataFilter.brand,
          sleeve: dataFilter.sleeve,
          collar: dataFilter.collar,
          // price: priceRange[0],
          // maxPrice: priceRange[1],
          page: currentPage,
          sizePage: pageSize
        }
      })
      .then((response) => {
        setProductList(response.data);
        console.log(response.data);
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
      newPrice: chiTietSanPham.discountPrice !== null ? chiTietSanPham.discountPrice : chiTietSanPham.price,
      oldPrice: chiTietSanPham.price
    });
    setIsSelectModalOpen(true);
  };

  const handleConfirm = () => {
    const data = {
      detailCode: selectedProduct?.detailCode,
      idBill: idBill,
      price: selectedProduct?.newPrice,
      quantity: quantity
    };
    console.log(data);
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
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Cổ áo',
      dataIndex: 'collar',
      key: 'collar'
    },
    {
      title: 'Tay Áo',
      dataIndex: 'sleeve',
      key: 'sleeve'
    },
    {
      title: 'Chất liệu',
      dataIndex: 'material',
      key: 'material'
    },
    {
      title: 'Số Lượng',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price, record) => (
        <>
          {/* {record.discountPrice !== null ? (
            <>
              <span className="text-decoration-line-through">
                <FormatCurrency value={record.price} />
              </span>
              <br />
              <span className="text-danger">
                <FormatCurrency value={record.newPrice} />
              </span>
            </>
          ) : (
            <span className="text-danger">
              <FormatCurrency value={record.price} />
            </span>
          )} */}
                      <span className="text-danger">
              <FormatCurrency value={record.price} />
            </span>
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
        width={900}
      >
        <Form layout="vertical" form={formFilter}>
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item label="Tên sản phẩm" name="name">
                <Input
                  placeholder="Tìm kiếm sản phẩm theo tên..."
                  onChange={(e) => setDataFilter({ ...dataFilter, name: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>
            {/* Kích cỡ */}
            <Col span={8}>
              <Form.Item label="Kích cỡ" name="size">
                <Select placeholder="Chọn kích cỡ" allowClear onChange={(value) => setDataFilter({ ...dataFilter, size: value })}>
                  {listKichCo.map((size) => (
                    <Option key={size.id} value={size.name}>
                      {size.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* Màu sắc */}
            <Col span={8}>
              <Form.Item label="Màu sắc" name="color">
                <Select placeholder="Chọn màu sắc" allowClear onChange={(value) => setDataFilter({ ...dataFilter, color: value })}>
                  {listMauSac.map((color) => (
                    <Option key={color.id} value={color.name}>
                      {color.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* Chất liệu */}
            <Col span={8}>
              <Form.Item label="Chất liệu" name="material">
                <Select placeholder="Chọn chất liệu" allowClear onChange={(value) => setDataFilter({ ...dataFilter, material: value })}>
                  {listChatLieu.map((material) => (
                    <Option key={material.id} value={material.name}>
                      {material.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="Thương hiệu" name="brand">
                <Select placeholder="Chọn thương hiệu" allowClear onChange={(value) => setDataFilter({ ...dataFilter, brand: value })}>
                  {listThuongHieu.map((brand) => (
                    <Option key={brand.id} value={brand.name}>
                      {brand.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Tay áo" name="sleeve">
                <Select placeholder="Chọn tay áo" allowClear onChange={(value) => setDataFilter({ ...dataFilter, sleeve: value })}>
                  {listTayAo.map((sleeve) => (
                    <Option key={sleeve.id} value={sleeve.name}>
                      {sleeve.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Cổ áo" name="collar">
                <Select placeholder="Chọn cổ áo" allowClear onChange={(value) => setDataFilter({ ...dataFilter, collar: value })}>
                  {listCoAo.map((collar) => (
                    <Option key={collar.id} value={collar.name}>
                      {collar.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
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
        {selectedProduct ? (
          <>
            <Row gutter={16}>
              <Col span={8}>
                <img src={selectedProduct.images.split(',')[0]} alt="" width="100%" />
              </Col>
              <Col span={16}>
                <h3>{selectedProduct.name}</h3>
                <p>
                  Giá:
                  {selectedProduct.discountPercentage ? (
                    <>
                      <span className="text-danger ms-2">
                        <FormatCurrency value={selectedProduct.newPrice} />
                      </span>
                      {selectedProduct.newPrice !== selectedProduct.price && (
                        <span className="text-decoration-line-through ms-2">
                          <FormatCurrency value={selectedProduct.oldPrice} />
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="ms-2">
                      <FormatCurrency value={selectedProduct.price} />
                    </span>
                  )}
                </p>

                <Form.Item label="Số lượng">
                  <InputNumber min={1} value={quantity} onChange={setQuantity} style={{ width: '50%' }} />
                </Form.Item>
              </Col>
            </Row>
          </>
        ) : (
          <p>Không có thông tin sản phẩm.</p>
        )}
      </Modal>
    </>
  );
}

export default ShowProductModal;
