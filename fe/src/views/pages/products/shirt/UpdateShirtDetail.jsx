import { Button, Col, Form, Input, InputNumber, Modal, QRCode, Row, Select, Space, Tooltip, message } from 'antd'
import { Option } from 'antd/es/mentions';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IconEdit, IconTrash, IconPhoto } from "@tabler/icons-react";

import * as request from "views/utilities/httpRequest";

import AddProperties from "components/Admin/Product/AddProperties";
import debounce from "lodash/debounce";

function UpdateShirtDetail({ props, onSuccess }) {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listImages, setListImages] = useState();

    const [sole, setSole] = useState([]);
    const [size, setSize] = useState([]);
    const [color, setColor] = useState([]);
    const [collar, setCollar] = useState([]);
    const [sleeve, setSleeve] = useState([]);
    const [brand, setBrand] = useState([]);

    const [searchSize, setSearchSize] = useState(null);
    const [searchColor, setSearchColor] = useState(null);
    const [searchSole, setSearchSole] = useState(null);
    const [searchSleeve, setSearchSleeve] = useState(null);
    const [searchCollar, setSearchCollar] = useState(null);
    const [searchBrand, setSearchBrand] = useState(null);

    const [loading, setLoading] = useState(false);

    const loadImages = () => {
        request.get(`/images/${props.id}`).then(response => {
            setListImages(response);
            console.log(response.data);
        }).catch(e => {
            console.log(e);
        })
    }
    useEffect(() => {
        loadImages()
    }, [props])

    const handleDeleteImage = (id) => {
        Modal.confirm({
            title: "Xác nhận",
            maskClosable: true,
            content: `Xác nhận xóa ảnh?`,
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
                await request.remove(`/images/${id}`).then(response => {
                    message.success("Xóa thành công!");
                    onSuccess();
                    loadImages();
                }).catch(e => {
                    console.log(e);
                })
            },
        });
    }

    const handleUploadImage = (event) => {
        const fileList = event.target.files;
        const formData = new FormData();
        let validImages = [];
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            if (file.type.startsWith("image/")) {
                formData.append("images", file);
                validImages.push(file);
            } else {
                message.error(`Tệp ${file.url} không phải là ảnh và sẽ không được thêm.`);
            }
        }
        if (validImages.length > 0) {
            Modal.confirm({
                title: "Xác nhận",
                maskClosable: true,
                content: `Xác nhận thêm ảnh?`,
                okText: "Xác nhận",
                cancelText: "Hủy",
                onOk: async () => {
                    formData.append("folder", 'test');
                    await request.post('/image-gallery', formData, { headers: { "Content-Type": "multipart/form-data", }, }).then(response => {
                        request.get(`/images`, {
                            params: {
                                name: response.data[0],
                                shoeDetail: props.id
                            }
                        }).then(response => {
                            loadImages();
                            message.success("Thêm thành công!");
                        }).catch(e => {
                            console.log(e);
                        })
                    }).catch(e => {
                        console.log(e);
                    })
                },
            });
        } else {
            message.error("Không tìm thấy ảnh hợp lệ!");
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
        form.setFieldsValue({
            size: props.size,
            color: props.color,
            material: props.material,
            sleeve: props.sleeve,
            collar: props.collar,
            brand: props.brand,
            quantity: props.quantity,
            price: props.price,
            weight: props.weight
        })
    };

    const handleOk = (data) => {
        console.log(data);
        data.shirt = props.id
        Modal.confirm({
            title: "Xác nhận",
            maskClosable: true,
            content: `Xác nhận cập nhật?`,
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
                await request.put(`/shirt-detail/${props.id}`, data).then(response => {
                    message.success('Cập nhật thành công!');
                    setIsModalOpen(false);
                    onSuccess();
                }).catch(e => {
                    message.error(e.response.data);
                })
                setIsModalOpen(false);
            },
        });
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const loadSize = () => {
        request.get("/size", { params: { name: searchSize, sizePage: 1_000_000 } }).then((response) => {
            setSize(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }
    const loadColor = () => {
        request.get("/color", { params: { name: searchColor, sizePage: 1_000_000 } }).then((response) => {
            setColor(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }
    const loadSole = () => {
        request.get("/material", { params: { name: searchSole, sizePage: 1_000_000 } }).then((response) => {
            setSole(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }
    const loadSleeve = () => {
        request.get("/sleeve", { params: { name: searchSleeve, sizePage: 1_000_000 } }).then((response) => {
            setSleeve(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }
    const loadCollar = () => {
        request.get("/collar", { params: { name: searchCollar, sizePage: 1_000_000 } }).then((response) => {
            setCollar(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }
    const loadBrand = () => {
        request.get("/brand", { params: { name: searchBrand, sizePage: 1_000_000 } }).then((response) => {
            setBrand(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        loadSize();
    }, [searchSize])
    useEffect(() => {
        loadColor();
    }, [searchColor])
    useEffect(() => {
        loadSole();
    }, [searchSole])
    useEffect(() => {
        loadSleeve();
    }, [searchSleeve])
    useEffect(() => {
        loadCollar();
    }, [searchCollar])
    useEffect(() => {
        loadBrand();
    }, [searchBrand])

    const handleSelectImg = (img) => {
        console.log(img);
    }

    return (
        <>

            <Tooltip placement="top" title="Chỉnh sửa">
                <Button style={{ color: '#5e35b1' }} type="text" onClick={showModal}>
                    <i className="fas fa-edit "><IconEdit /></i>
                </Button>
            </Tooltip>
            <Modal title={props.name} open={isModalOpen} onCancel={handleCancel} footer={
                <>
                    <Button type='primary' htmlType='submit' form='formUpdate' style={{ backgroundColor: '#5e35b1' }}>Cập nhật</Button>
                </>
            } width={800}>
                <Form layout='vertical' form={form} onFinish={handleOk} id='formUpdate'>
                    <Row gutter={24}>
                        <Col xl={8}>
                            <Form.Item label={"Kích cỡ"} name={"size"} rules={[{ required: true, message: "Kích cỡ không được để trống!" }]}>
                                <Select showSearch placeholder="Nhập kích cỡ..." optionFilterProp="children" onSearch={setSearchSize}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Space className="my-2 ms-2">
                                                <AddProperties placeholder={"kích cỡ"} name={"size"} onSuccess={() => loadSize()} />
                                            </Space>
                                        </>
                                    )}
                                >
                                    <Option value="">Chọn kích cỡ</Option>
                                    {size.map((item) => (
                                        <Option key={item.id} value={item.name}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={8}>
                            <Form.Item label={"Màu sắc"} name={"color"} rules={[{ required: true, message: "Màu sắc không được để trống!" }]}>
                                <Select showSearch placeholder="Nhập màu sắc..." optionFilterProp="children" onSearch={setSearchColor}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Space className="my-2 ms-2">
                                                <AddProperties placeholder={"màu sắc"} name={"color"} onSuccess={() => loadColor()} />
                                            </Space>
                                        </>
                                    )}
                                >
                                    <Option value="">Chọn màu sắc</Option>
                                    {color.map((item) => (
                                        <Option key={item.id} value={item.name}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={8}>
                            <Form.Item label={"Chất liệu"} name={"material"} rules={[{ required: true, message: "Chất liệu không được để trống!" }]}>
                                <Select showSearch placeholder="Nhập tên chất liệu..." optionFilterProp="children" onSearch={setSearchSole}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Space className="my-2 ms-2">
                                                <AddProperties placeholder={"chất liệu"} name={"material"} onSuccess={() => loadSole()} />
                                            </Space>
                                        </>
                                    )}
                                >
                                    <Option value="">Chọn chất liệu</Option>
                                    {sole.map((item) => (
                                        <Option key={item.id} value={item.name}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={8}>
                            <Form.Item label={"Thương hiệu"} name={"brand"} rules={[{ required: true, message: "Thương hiệu không được để trống!" }]}>
                                <Select showSearch placeholder="Nhập tên chất liệu..." optionFilterProp="children" onSearch={setSearchSole}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Space className="my-2 ms-2">
                                                <AddProperties placeholder={"thương hiệu"} name={"brand"} onSuccess={() => loadBrand()} />
                                            </Space>
                                        </>
                                    )}
                                >
                                    <Option value="">Chọn thương hiệu</Option>
                                    {brand.map((item) => (
                                        <Option key={item.id} value={item.name}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={8}>
                            <Form.Item label={"Tay áo"} name={"sleeve"} rules={[{ required: true, message: "Tay áo không được để trống!" }]}>
                                <Select showSearch placeholder="Nhập tên tay áo..." optionFilterProp="children" onSearch={setSearchSleeve}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Space className="my-2 ms-2">
                                                <AddProperties placeholder={"tay áo"} name={"sleeve"} onSuccess={() => loadSleeve()} />
                                            </Space>
                                        </>
                                    )}
                                >
                                    <Option value="">Chọn tay áo</Option>
                                    {sleeve.map((item) => (
                                        <Option key={item.id} value={item.name}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={8}>
                            <Form.Item label={"Cổ áo"} name={"collar"} rules={[{ required: true, message: "Cổ áo không được để trống!" }]}>
                                <Select showSearch placeholder="Nhập tên cổ áo..." optionFilterProp="children" onSearch={setSearchCollar}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Space className="my-2 ms-2">
                                                <AddProperties placeholder={"cổ áo"} name={"collar"} onSuccess={() => loadCollar()} />
                                            </Space>
                                        </>
                                    )}
                                >
                                    <Option value="">Chọn cổ áo</Option>
                                    {collar.map((item) => (
                                        <Option key={item.id} value={item.name}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={8}>
                            <Form.Item label={"Đơn giá"} name={"price"} rules={[{ required: true, message: "Đơn giá không được để trống!" }]}>
                                {/* <Input placeholder='Nhập đơn giá...' /> */}
                                <InputNumber
                                    className='w-100'
                                    formatter={(value) =>
                                        ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    }
                                    parser={(value) =>
                                        value !== null && value !== undefined
                                            ? value.replace(/\$\s?|(,*)/g, "")
                                            : ""
                                    }
                                    controls={false}
                                    min={0}
                                    // suffix="VNĐ"
                                    placeholder="Nhập giá trị đơn tối thiểu..."
                                />
                            </Form.Item>
                        </Col>

                        <Col xl={8}>
                            <Form.Item label={"Số lượng"} name={"quantity"} rules={[{ required: true, message: "Đơn giá không được để trống!" }]}>
                                <InputNumber
                                    className='w-100'
                                    formatter={(value) =>
                                        value !== undefined && value !== null
                                            ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            : ""
                                    }
                                    parser={(value) =>
                                        value !== undefined && value !== null
                                            ? value.replace(/[^0-9]/g, "") // Loại bỏ ký tự không phải số
                                            : ""
                                    }
                                    controls={true} // Hiển thị nút tăng giảm
                                    min={1} // Đặt giá trị nhỏ nhất là 1
                                    placeholder="Nhập số lượng..."
                                />

                            </Form.Item>
                        </Col>
                        <Col xl={8}>
                            <Form.Item label={"Cân nặng"} name={"weight"} rules={[{ required: true, message: "Cân nặng không được để trống!" }]}>
                                <InputNumber
                                    className='w-100'
                                    formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    parser={(value) => value ? value.replace(/\$\s?|(,*)/g, "") : ""}
                                    controls={false}
                                    min={0}
                                    placeholder="Nhập cân nặng sản phẩm..."
                                />
                            </Form.Item>
                        </Col>
                        <Col xl={8}>
                            <QRCode value={props.detailCode} />
                        </Col>

                        <Col xl={11}>
                            Hình ảnh sản phẩm:
                            <div className="d-flex flex-wrap">
                                {listImages?.map((image, index) => (
                                    <div className="position-relative me-2 mt-2">
                                        <img src={image.url} alt="images" width={100} height={100} className="object-fit-cover  border border-purple " style={{ borderColor: '#5e35b1', color: '#5e35b1' }} />
                                        <div className="position-absolute end-0 top-0">
                                            <button type="button" class="btn btn-sm border-0 text-danger" onClick={() => handleDeleteImage(image.id)}>
                                                <Tooltip title="Xóa ảnh">
                                                    <i className="fas fa-trash"><IconTrash /></i>
                                                </Tooltip>
                                            </button>

                                        </div>
                                    </div>
                                ))}
                                {listImages?.length < 3 &&
                                    <div style={{ width: "100px", height: "100px" }} className="position-relative rounded-0 border border-purple d-flex align-items-center justify-content-center mt-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="position-absolute opacity-0"
                                            style={{ width: "100%", height: "100%" }}
                                            onChange={(event) => handleUploadImage(event)}

                                        />
                                    </div>}
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Modal>

        </>
    )
}

export default UpdateShirtDetail