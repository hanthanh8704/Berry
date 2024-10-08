/* eslint-disable eqeqeq */
import { ChromePicker } from 'react-color';
import namer from 'color-namer';
import { Breadcrumb, Button, Col, Collapse, Modal, Row, Select, Space } from 'antd';
import { Option } from 'antd/es/mentions';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddProperties from 'components/Admin/Product/AddProperties';
import AddColorCode from 'components/Admin/Product/AddColor';
import TableProduct from 'components/Admin/Product/TableProduct';
import AddShirtModal from 'components/Admin/Product/AddShirtModal';
import * as request from 'views/utilities/httpRequest';
import { IconHome } from '@tabler/icons-react';

function AddProduct() {
  const navigate = useNavigate();

  const [material, setMaterial] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [sleeve, setSleeve] = useState([]);
  const [collar, setCollar] = useState([]);
  const [brand, setBrand] = useState([]);

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedSleeves, setSelectedSleeves] = useState([]);
  const [selectedCollars, setSelectedCollars] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const [searchSize, setSearchSize] = useState(null);
  const [searchColor, setSearchColor] = useState(null);
  const [searchMaterial, setSearchMaterial] = useState(null);
  const [searchSleeve, setSearchSleeve] = useState(null);
  const [searchCollar, setSearchCollar] = useState(null);
  const [searchBrand, setSearchBrand] = useState(null);

  const [product, setProduct] = useState([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetail, setProductDetail] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleAddColorSuccess = () => {
    setIsModalVisible(false); // Đóng modal sau khi thêm thành công
    // Có thể cập nhật lại danh sách màu tại đây nếu cần
  };
  useEffect(() => {
    const options = [];
    selectedColors.forEach((colorItem) => {
      selectedSizes.forEach((sizeItem) => {
        const option = {
          sanPham: selectedProduct,
          mauSac: colorItem,
          kichCo: sizeItem,
          chatLieu: selectedMaterial,
          thuongHieu: selectedBrands,
          tayAo: selectedSleeves,
          coAo: selectedCollars,
          giaBan: 100000,
          soLuong: 10,
          trangThai: 'Hoạt động',
          deleted: false
        };
        options.push(option);
      });
    });
    setProductDetail(options);
    console.log(options);
  }, [selectedColors, selectedSizes, selectedProduct, selectedMaterial, selectedBrands, selectedSleeves, selectedCollars]);

  const handleChangeProductDetail = (items) => {
    debugger;
    console.log('--- đã nhảy sang add shoe ---');
    setProductDetail(items);
    console.log(items);
  };

  const loadShoe = () => {
    request
      .get('/shirt', { params: { name: searchSize, status: false, sizePage: 1_000_000 } })
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadSize = () => {
    request
      .get('/size', { params: { name: searchSize, status: false, sizePage: 1_000_000 } })
      .then((response) => {
        setSize(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadMaterial = () => {
    request
      .get('/material', { params: { name: searchMaterial, status: false, sizePage: 1_000_000 } })
      .then((response) => {
        setMaterial(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadBrand = () => {
    request
      .get('/brand', { params: { name: searchBrand, status: false, sizePage: 1_000_000 } })
      .then((response) => {
        setBrand(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadColor = () => {
    request
      .get('/color', { params: { name: searchColor, status: false, sizePage: 1_000_000 } })
      .then((response) => {
        setColor(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadSleeve = () => {
    request
      .get('/sleeve', { params: { name: searchSleeve, status: false, sizePage: 1_000_000 } })
      .then((response) => {
        setSleeve(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadCollar = () => {
    request
      .get('/collar', { params: { name: searchCollar, status: false, sizePage: 1_000_000 } })
      .then((response) => {
        setCollar(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadShoe();
  }, [searchProduct]);

  useEffect(() => {
    loadSize();
  }, [searchSize]);

  useEffect(() => {
    loadColor();
  }, [searchColor]);

  useEffect(() => {
    loadMaterial();
  }, [searchMaterial]);

  useEffect(() => {
    loadBrand();
  }, [searchBrand]);

  useEffect(() => {
    loadSleeve();
  }, [searchSleeve]);

  useEffect(() => {
    loadCollar();
  }, [searchCollar]);

  //Thêm sản phẩm
  const handleCreate = () => {
    const data = [];
    const colorImageErrors = [];
    productDetail.forEach((item) => {
      const x = {
        sanPham: item.sanPham.id,
        mauSac: item.mauSac.id,
        kichCo: item.kichCo.id,
        chatLieu: item.chatLieu.id,
        thuongHieu: item.thuongHieu.id,
        tayAo: item.tayAo.id,
        coAo: item.coAo.id,
        soLuong: item.soLuong,
        giaBan: item.giaBan,
        listImages: item.images
      };

      data.push(x);
      console.log(data);
      if (!item.images || item.images.length === 0) {
        colorImageErrors.push(item.mauSac.ten);
      }
    });
    if (colorImageErrors.length > 0) {
      const uniqueColorErrors = [...new Set(colorImageErrors)];
      toast.error(`Các sản phẩm màu ${uniqueColorErrors.join(', ')} chưa chọn ảnh.`);
      return;
    }

    Modal.confirm({
      title: 'Xác nhận',
      maskClosable: true,
      content: 'Xác nhận thêm sản phẩm?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        request
          .post('/shirt-detail', data)
          .then((response) => {
            if (response.status === 200) {
              toast.success('Thêm thành công!', {
                autoClose: 2000 // Thời gian thông báo sẽ hiển thị trong 2 giây (2000 milliseconds)
              });
              setTimeout(() => {
                navigate('/products');
              }, 2000);
            }
          })
          .catch((e) => {
            toast.error(e.response.data);
          });
        console.log(data);
      }
    });
  };

  return (
    <div className="bg-white rounded-3 p-1">
      <ToastContainer />
      <Breadcrumb
        className="mb-2 ms-2"
        items={[{ href: '/' }, { href: '/admin/products', title: 'Danh sách sản phẩm' }, { title: 'Thêm sản phẩm' }]}
      />
      <Row gutter={24} className="m-3">
        <Col xl={24}>
          <label className="mb-1">Tên sản phẩm</label>
          <div className="d-flex">
            <Select
              className="me-2 w-100"
              size="large"
              showSearch
              onChange={(value) => {
                setSelectedProduct(product.find((item) => item.id === value));
              }}
              placeholder="Nhập tên áo..."
              optionFilterProp="children"
              onSearch={setSearchProduct}
            >
              {product.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.ten}
                </Option>
              ))}
            </Select>
            <AddShirtModal onAddSuccess={() => loadShoe()} />
          </div>
        </Col>

        <Col xl={24} className="my-2 mt-4">
          <Collapse defaultActiveKey={0} className="rounded-0 border-0">
            <Collapse.Panel key={0} header={'Thuộc tính'} className="border-bottom-0">
              <Row gutter={24}>
                <Col xl={12}>
                  <label className="mb-1">Chất liệu</label>
                  <Select
                    className="me-2 w-100 mb-3"
                    size="large"
                    showSearch
                    onChange={(value) => {
                      setSelectedMaterial(material.find((item) => item.id === value));
                    }}
                    placeholder="Nhập tên chất liệu..."
                    optionFilterProp="children"
                    onSearch={setSearchMaterial}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Space className="my-2 ms-2">
                          <AddProperties placeholder={'chất liệu'} name={'material'} onSuccess={() => loadMaterial()} />
                        </Space>
                      </>
                    )}
                  >
                    {material.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.ten}
                      </Option>
                    ))}
                  </Select>
                </Col>

                <Col xl={12}>
                  <label className="mb-1">Thương Hiệu</label>
                  <Select
                    className="me-2 w-100 mb-3"
                    size="large"
                    showSearch
                    onChange={(value) => {
                      setSelectedBrands(brand.find((item) => item.id === value));
                    }}
                    placeholder="Nhập tên thương hiệu..."
                    optionFilterProp="children"
                    onSearch={setSearchBrand}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Space className="my-2 ms-2">
                          <AddProperties placeholder={'thương hiệu'} name={'brand'} onSuccess={() => loadBrand()} />
                        </Space>
                      </>
                    )}
                  >
                    {brand.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.ten}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xl={12}>
                  <label className="mb-1">Tay áo</label>
                  <Select
                    className="me-2 w-100 mb-3"
                    size="large"
                    showSearch
                    onChange={(value) => {
                      setSelectedSleeves(sleeve.find((item) => item.id === value));
                    }}
                    placeholder="Nhập tên tay áo..."
                    optionFilterProp="children"
                    onSearch={setSearchSleeve}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Space className="my-2 ms-2">
                          <AddProperties placeholder={'tay áo'} name={'sleeve'} onSuccess={() => loadSleeve()} />
                        </Space>
                      </>
                    )}
                  >
                    {sleeve.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.ten}
                      </Option>
                    ))}
                  </Select>
                </Col>

                <Col xl={12}>
                  <label className="mb-1">Cổ áo</label>
                  <Select
                    className="me-2 w-100 mb-3"
                    size="large"
                    showSearch
                    onChange={(value) => {
                      setSelectedCollars(collar.find((item) => item.id === value));
                    }}
                    placeholder="Nhập tên cổ áo..."
                    optionFilterProp="children"
                    onSearch={setSearchCollar}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Space className="my-2 ms-2">
                          <AddProperties placeholder={'cổ áo'} name={'collar'} onSuccess={() => loadCollar()} />
                        </Space>
                      </>
                    )}
                  >
                    {collar.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.ten}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Collapse.Panel>
          </Collapse>
        </Col>

        <Col xl={24} className="my-3">
          <Collapse defaultActiveKey={0} className="rounded-0 border-0">
            <Collapse.Panel key={0} header={'Kích cỡ và Màu sắc'} className="border-bottom-0">
              <Row gutter={24}>
                <Col xl={12}>
                  <label className="mb-1">Kích cỡ</label>
                  <Select
                    className="me-2 w-100"
                    size="large"
                    showSearch
                    mode="multiple"
                    onChange={async (selectedValues) => {
                      setSelectedSizes(
                        await Promise.all(
                          selectedValues.map(async (item) => {
                            return await request.get(`/size/${item}`);
                          })
                        )
                      );
                    }}
                    placeholder="Nhập kích cỡ..."
                    optionFilterProp="children"
                    onSearch={setSearchSize}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Space className="my-2 ms-2">
                          <AddProperties placeholder={'kích cỡ'} name={'size'} onSuccess={() => loadSize()} />
                        </Space>
                      </>
                    )}
                  >
                    {size.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.ten}
                      </Option>
                    ))}
                  </Select>
                </Col>

                <Col xl={12}>
                  <label className="mb-1">Màu sắc</label>
                  <Select
                    className="me-2 w-100"
                    size="large"
                    showSearch
                    mode="multiple"
                    onChange={async (selectedValues) => {
                      setSelectedColors(
                        await Promise.all(
                          selectedValues.map(async (item) => {
                            return await request.get(`/color/${item}`);
                          })
                        )
                      );
                    }}
                    placeholder="Nhập màu sắc..."
                    optionFilterProp="children"
                    onSearch={setSearchColor}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Space className="my-2 ms-2">
                          <button className="btn btn-primary" onClick={handleOpenModal}>
                            Thêm màu sắc
                          </button>
                        </Space>
                      </>
                    )}
                  >
                    {color.map((item) => (
                      <Option
                        key={item.id}
                        value={item.id}
                        style={{ backgroundColor: item.code, display: 'inline-block', margin: '5px', padding: '10px', color: '#000' }}
                      >
                        {item.code}
                      </Option>
                    ))}
                  </Select>

                  <AddColorCode
                    visible={isModalVisible}
                    onCancel={handleCloseModal}
                    onSuccess={handleAddColorSuccess}
                    placeholder={'màu sắc'}
                    name={'color'}
                  />
                </Col>
              </Row>
            </Collapse.Panel>
          </Collapse>
        </Col>
      </Row>

      {selectedCollars === null ||
      selectedSleeves === null ||
      selectedMaterial === null ||
      selectedProduct === null ||
      selectedProduct === undefined ||
      selectedSizes.length === 0 ||
      selectedColors.length === 0 ? (
        ''
      ) : (
        <>
          <TableProduct props={productDetail} handleChange={handleChangeProductDetail} />
          <Button type="primary" style={{ backgroundColor: '#5e35b1' }} className=" float-end mt-3" onClick={handleCreate}>
            Thêm sản phẩm
          </Button>
        </>
      )}
    </div>
  );
}

export default AddProduct;
