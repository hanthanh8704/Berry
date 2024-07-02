/* eslint-disable eqeqeq */
import { Breadcrumb, Button, Col, Collapse, Modal, Row, Select, Space } from "antd";
import { Option } from "antd/es/mentions";
import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddProperties from "components/Admin/Product/AddProperties";
import TableProduct from "components/Admin/Product/TableProduct";
import AddShirtModal from "components/Admin/Product/AddShirtModal";
import * as request from "views/utilities/httpRequest";

function AddProduct() {
  const navigate = useNavigate();

  const [material, setMaterial] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [searchSize, setSearchSize] = useState(null);
  const [searchColor, setSearchColor] = useState(null);
  const [searchMaterial, setSearchMaterial] = useState(null);

  const [product, setProduct] = useState([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [productDetail, setProductDetail] = useState([]);

  useEffect(() => {
    const options = [];
    selectedColors.forEach((colorItem) => {
      selectedSizes.forEach((sizeItem) => {
        const option = {
          shoe: selectedProduct,
          color: colorItem,
          size: sizeItem,
          material: selectedMaterial,
          price: 100000,
          quantity: 10,
          deleted: false,
          weight: 2000,
        };
        options.push(option);
      });
    });
    setProductDetail(options);
    console.log(options);
  }, [selectedColors, selectedSizes, selectedProduct, selectedMaterial]);

  const handleChangeProductDetail = (items) => {
    console.log("--- đã nhảy sang add shoe ---");
    setProductDetail(items);
    console.log(items);
  };

  const loadShoe = () => {
    request.get("/shirt", { params: { name: searchProduct } }).then((response) => {
      setProduct(response.data);
    }).catch((error) => {
      console.log(error);
    });
  };

  const loadSize = () => {
    request.get("/size", { params: { name: searchSize, status: false, sizePage: 1_000_000 } }).then((response) => {
      setSize(response.data);
    }).catch((error) => {
      console.log(error);
    });
  };

  const loadMaterial = () => {
    request.get("/material", { params: { name: searchMaterial, status: false, sizePage: 1_000_000 } }).then((response) => {
      setMaterial(response.data);
    }).catch((error) => {
      console.log(error);
    });
  };

  const loadColor = () => {
    request.get("/color", { params: { name: searchColor, status: false, sizePage: 1_000_000 } }).then((response) => {
      setColor(response.data);
    }).catch((error) => {
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

  const handleCreate = () => {
    const data = [];
    const colorImageErrors = [];
    productDetail.forEach((item) => {
      const x = {
        shoe: item.shoe.id,
        color: item.color.id,
        size: item.size.id,
        material: item.material.id,
        quantity: item.quantity,
        price: item.price,
        weight: item.weight,
        listImages: item.images,
      };
      data.push(x);
      if (!item.images || item.images.length === 0) {
        colorImageErrors.push(item.color.name);
      }
    });
    if (colorImageErrors.length > 0) {
      const uniqueColorErrors = [...new Set(colorImageErrors)];
      toast.error(`Các sản phẩm màu ${uniqueColorErrors.join(', ')} chưa chọn ảnh.`);
      return;
    }

    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm sản phẩm?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        await request.post('/shoe-detail', data).then((response) => {
          toast.success("Thêm thành công!");
          navigate("/admin/product");
        }).catch((e) => {
          console.log(e);
        });
      },
    });
  };

  return (
    <div className="">
      <Breadcrumb
        className="mb-2"
        items={[
          { href: "/", title: <FaHome /> },
          { href: "/free/products", title: "Danh sách sản phẩm" },
          { title: "Thêm sản phẩm" },
        ]}
      />
      <Row gutter={24}>
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
              placeholder="Nhập tên giày..."
              optionFilterProp="children"
              onSearch={setSearchProduct}
            >
              <Option value="">Chọn giày</Option>
              {product.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.ten}
                </Option>
              ))}
            </Select>
            <AddShirtModal onAddSuccess={() => loadShoe()} />
          </div>
        </Col>
        <Col xl={24} className="my-3">
          <Collapse defaultActiveKey={0} className="rounded-0 border-0">
            <Collapse.Panel key={0} header={"Thuộc tính"} className="border-bottom-0">
              <Row gutter={24}>
                <Col xl={24}>
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
                          <AddProperties
                            placeholder={"chất liệu"}
                            name={"material"}
                            onSuccess={() => loadMaterial()}
                          />
                        </Space>
                      </>
                    )}
                  >
                    <Option value="">Chọn chất liệu</Option>
                    {material.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.ten}
                      </Option>
                    ))}
                  </Select>
                </Col>
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
                          <AddProperties
                            placeholder={"kích cỡ"}
                            name={"size"}
                            onSuccess={() => loadSize()}
                          />
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
                          <AddProperties
                            placeholder={"màu sắc"}
                            name={"color"}
                            onSuccess={() => loadColor()}
                          />
                        </Space>
                      </>
                    )}
                  >
                    {color.map((item) => (
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
      </Row>
      {selectedProduct === null || selectedProduct === undefined || selectedSizes.length === 0 || selectedColors.length === 0 ? (
        ""
      ) : (
        <>
          <TableProduct props={productDetail} handleChange={handleChangeProductDetail} />
          <Button type="primary" className="bg-primary float-end mt-3" onClick={handleCreate}>
            Thêm sản phẩm
          </Button>
        </>
      )}
    </div>
  );
}

export default AddProduct;
