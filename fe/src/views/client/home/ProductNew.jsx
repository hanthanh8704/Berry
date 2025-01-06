
//Bản tiếng Anh
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Carousel, Radio, Select, Grid } from "antd";
import { Link, useParams } from 'react-router-dom';
import { getNewProducts, getAllProductsByIdDM, getSearchProductsKCTHMS, findAllThuongHieu, findAllMauSac, findAllKichCo } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import FormatCurrency from "../../utilities/FormatCurrency.jsx";
import '../../client/product/product.css';
import { Box, Typography } from '@mui/material';
const { Option } = Select;
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import axios from "axios"
const ProductNew = () => {

    const [productDetailNew, setProductDetailNew] = useState([]);
    const [thuongHieu, setThuongHieu] = useState([]);
    const [mauSac, setMauSac] = useState([]);
    const [kichCo, setKichCo] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [selectedMauSac, setSelectedMauSac] = useState('ALL');
    const [selectedThuongHieu, setSelectedThuongHieu] = useState('ALL');
    const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');
    const [selectedKichCo, setSelectedKichCo] = useState('ALL');
    const [sort, setSort] = useState('newest');

    useEffect(() => {
        fetchFilteredProducts();
    }, [selectedMauSac, selectedThuongHieu, selectedPriceRange, selectedKichCo, sort]);

    const fetchFilteredProducts = () => {
        // Kiểm tra nếu 'product' có giá trị hợp lệ
        console.log('product ddddddddddddd con me no ', productDetailNew);
        axios
            .get(`http://localhost:8080/api/client/search/products-new`, {
                params: {
                    idMS: selectedMauSac === 'ALL' ? null : selectedMauSac,
                    idTH: selectedThuongHieu === 'ALL' ? null : selectedThuongHieu,
                    idKC: selectedKichCo === 'ALL' ? null : selectedKichCo,
                    priceRange: selectedPriceRange === 'ALL' ? null : selectedPriceRange,
                    sort: sort
                }
            })
            .then(response => {
                setProductDetailNew(response.data); // Lưu trữ dữ liệu sản phẩm vào state
                console.log('product moiddddddddddddddd', response.data);
            })
            .catch(error => {
                if (error.response) {
                    console.error('API Error:', error.response.data);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error setting up the request:', error.message);
                }
            });
    };

    const handleSortChange = (value) => {
        setSort(value);
    };

    const handleThuongHieu = (e) => {
        setSelectedThuongHieu(e.target.value);
    };

    const handleMauSac = (e) => {
        setSelectedMauSac(e.target.value);
    };

    const handlePriceRangeChange = (e) => {
        setSelectedPriceRange(e.target.value);
    };

    const handleKichCo = (e) => {
        setSelectedKichCo(e.target.value);
    };

    useEffect(() => {
        if (productDetailNew.length > 0) {
            const defaultAttributes = {};
            productDetailNew.forEach(productNew => {
                productNew.listProductDetails.forEach(spct => {
                    defaultAttributes[spct.id] = {
                        selectedColor: spct.color.id,
                        selectedSize: spct.size.id,
                    };
                });
            });
            setSelectedAttributes(defaultAttributes);
        }
    }, [productDetailNew]);

    const handleColorChange = (productId, value) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], selectedColor: value }
        }));
    };

    const handleSizeChange = (productId, value) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], selectedSize: value }
        }));
    };

    useEffect(() => {
        getAllData();
    }, []);

    const getAllData = () => {
        getAllSPCTNew();

        getAllThuongHieu();
        getAllMauSac();
        getAllKichCo();
    };
    const getAllThuongHieu = () => {
        findAllThuongHieu()
            .then((response) => {
                setThuongHieu(response.data);

            })
            .catch((error) => {
                console.error('Error fetching San Pham CT:', error);
            });
    };

    const getAllMauSac = () => {
        findAllMauSac()
            .then((response) => {
                setMauSac(response.data);

            })
            .catch((error) => {
                console.error('Error fetching San Pham CT:', error);
            });
    };

    const getAllKichCo = () => {
        findAllKichCo()
            .then((response) => {
                setKichCo(response.data);

            })
            .catch((error) => {
                console.error('Error fetching San Pham CT:', error);
            });
    };

    const getAllSPCTNew = () => {
        getNewProducts()
            .then((response) => {
                setProductDetailNew(response.data);
                console.log("Product detail new zzzzzzzzzzzzzzzzz", response.data)
            })
            .catch((error) => {
                console.error('Error fetching San Pham CT:', error);
            });
    };

    return (
        <div className="container mt-4">
            <Box display="flex" alignItems="center" className='my-3'>
                <Typography
                    component={Link}
                    to="/home"
                    sx={{ color: 'black', textDecoration: 'none' }}
                >
                    Trang chủ
                </Typography>
                <Typography sx={{ color: 'black', marginX: 1 }}>|</Typography>
                <Typography

                    component={Link}
                    to={`/products/moi-ve`}
                    sx={{ color: 'black', textDecoration: 'none' }}
                >
                    Sản phẩm mới về
                </Typography>
            </Box>
            <h2>Sản phẩm mới về</h2>
            <Row gutter={[30, 30]}>
                <Col xs={24} sm={24} md={8}>
                    <Box mb={2}>
                        <Typography variant="h3" className='my-4'>
                            Bộ lọc
                        </Typography>
                        <Box className='mt-4'>
                            <b className='my-3'>Thương hiệu</b>
                            <Radio.Group
                                value={selectedThuongHieu}
                                onChange={handleThuongHieu}
                                className='my-3'
                                buttonStyle="solid"
                                style={{ display: 'flex', flexDirection: 'column' }} // Đảm bảo bố cục theo chiều dọc
                            >
                                <Radio value={"ALL"} style={{ marginBottom: 8 }} >
                                    Tất cả
                                </Radio>
                                {thuongHieu.map(th => (
                                    <Radio
                                        key={th.id}
                                        value={th.id}
                                        style={{ marginBottom: 8 }} // Khoảng cách giữa các radio buttons
                                    >
                                        {th.name}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </Box>
                        <Box className='mt-4'>
                            <b className='my-3'>Giá</b>
                            <Radio.Group
                                value={selectedPriceRange}
                                onChange={handlePriceRangeChange}
                                className='my-3'
                                buttonStyle="solid"
                                style={{ display: 'flex', flexDirection: 'column' }} // Đảm bảo bố cục theo chiều dọc
                            >
                                <Radio value={"ALL"} style={{ marginBottom: 8 }} >
                                    Tất cả
                                </Radio>
                                <Radio value="under300" style={{ marginBottom: 8 }}>
                                    Dưới 300.000đ
                                </Radio>
                                <Radio value="300to700" style={{ marginBottom: 8 }}>
                                    Từ 300.000đ - 700.000đ
                                </Radio>
                                <Radio value="above700" style={{ marginBottom: 8 }}>
                                    Trên 700.000đ
                                </Radio>
                            </Radio.Group>
                        </Box>
                        <Box className='mt-4'>
                            <b className='my-3'>Kích cỡ</b> <br /><br />
                            <Radio.Group buttonStyle="solid"
                                value={selectedKichCo}
                                onChange={handleKichCo}>
                                <Radio.Button value="ALL">
                                    Tất cả
                                </Radio.Button>
                                {kichCo.map(kc => (
                                    <Radio.Button key={kc.id} value={kc.id}>
                                        {kc.name}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Box>
                        <Box className='mt-4'>
                            <b className='my-3'>Màu sắc</b>
                            <Radio.Group
                                value={selectedMauSac}
                                onChange={handleMauSac}
                                className='my-3'
                                buttonStyle="solid"
                                style={{ display: 'flex', flexDirection: 'column' }} // Ensures vertical layout
                            >
                                <Radio value={"ALL"} style={{ marginBottom: 8 }}>
                                    Tất cả
                                </Radio>
                                {mauSac.map(color => (
                                    <Radio
                                        key={color.id}
                                        value={color.id}
                                        style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}
                                    >
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                backgroundColor: color.hexCode,
                                                backgroundImage: color.hexCode.startsWith('linear') ? color.hexCode : 'none',
                                                marginRight: 8,
                                                border: '1px solid #000'
                                            }}
                                        />
                                        {color.ten}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </Box>
                    </Box>
                </Col>

                <Col xs={24} sm={24} md={16}>
                    <div className="mb-4 text-end">
                        <Select
                            className='rounded'
                            defaultValue="newest"
                            style={{ width: 236, height: 47, border: '1px solid black' }}
                            onChange={handleSortChange}
                        >
                            <Option value="newest">Mới nhất</Option>
                            <Option value="price-asc">Giá từ thấp đến cao</Option>
                            <Option value="price-desc">Giá từ cao đến thấp</Option>
                        </Select>
                    </div>
                    <Row gutter={[30, 30]} className='ml-2 mb-5'>
                        {productDetailNew.length > 0 ? (
                            productDetailNew.map((ct, index) => {
                                const selectedProduct = selectedAttributes[ct.listProductDetails[0].id] || {};
                                const selectedColor = selectedProduct.selectedColor || null;
                                const selectedSize = selectedProduct.selectedSize || null;
                                const selectedSPCT = ct.listProductDetails.find(spct => spct.color.id === selectedColor && spct.size.id === selectedSize);

                                return (
                                    <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
                                        <Card
                                            style={{
                                                width: '260px',
                                                height: '630px',
                                            }}
                                            hoverable
                                            cover={
                                                <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false}>
                                                    {(selectedSPCT?.images?.length > 0
                                                        ? selectedSPCT.images
                                                        : ct.listProductDetails[0].images || []
                                                    ).map((anh, index) => (
                                                        <div key={index} className="image-container">
                                                            <div className="ratio" style={{ '--bs-aspect-ratio': '150%' }}>
                                                                <div className="d-flex justify-content-center">
                                                                    <Link className="nav-link" to={`/product-detail/${selectedSPCT?.id}?color=${selectedColor}&size=${selectedSize}`}>
                                                                        <img
                                                                            src={anh.url}
                                                                            alt="images"
                                                                            className="object-fit-contain mh-100 mw-100 card-image"
                                                                        />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                            {selectedSPCT?.discountPercentage != 0 && selectedSPCT != null ? (
                                                                <p className="discount-badge" style={{
                                                                    position: 'absolute',
                                                                    top: '3px',
                                                                    right: '2px',
                                                                    backgroundColor: 'red',
                                                                    color: 'white',
                                                                    padding: '5px 10px',
                                                                    borderRadius: '50%',
                                                                }}>
                                                                    {-selectedSPCT?.discountPercentage}%
                                                                </p>
                                                            ) : ''}
                                                        </div>
                                                    ))}
                                                </Carousel>
                                            }
                                        >
                                            <div className='' style={{ width: '220px' }}>
                                                {selectedSPCT ? (
                                                    <h5 className="mt-3">
                                                        {`${ct.name} ${selectedSPCT.brand.name}  ${selectedSPCT.sleeve.name} ${selectedSPCT.collar.name}`}
                                                    </h5>
                                                ) : (
                                                    <h5 className="mt-3">Hết hàng</h5>
                                                )}

                                                {/* Hiển thị giá bán */}
                                                <div className='d-flex text-center'>
                                                    {ct.listProductDetails.some(spct => spct.color.id === selectedColor && spct.size.id === selectedSize) ? (
                                                        ct.listProductDetails.map(spct => (
                                                            spct.color.id === selectedColor && spct.size.id === selectedSize && (
                                                                spct.discountPrice !== 0 ? (
                                                                    <React.Fragment key={spct.id}>
                                                                        <p className="text-dark fw-semibold text-decoration-line-through">
                                                                            <FormatCurrency value={spct.price} />
                                                                        </p>
                                                                        <p className="text-danger fw-semibold mx-2">
                                                                            <FormatCurrency value={spct.discountPrice} />
                                                                        </p>
                                                                    </React.Fragment>
                                                                ) : (
                                                                    <p key={spct.id} className="text-dark fw-semibold">
                                                                        <FormatCurrency value={spct.price} />
                                                                    </p>
                                                                )
                                                            )
                                                        ))
                                                    ) : (
                                                        <h5>0 đ</h5>
                                                    )}
                                                </div>

                                                {/* Chọn màu sắc */}
                                                <div className='d-flex'>
                                                    <ToggleButtonGroup
                                                        exclusive
                                                        value={selectedColor}
                                                        onChange={(e, newColor) => {
                                                            if (newColor !== null) {
                                                                handleColorChange(ct.listProductDetails[0].id, newColor);
                                                            }
                                                        }}
                                                        buttonStyle="solid"
                                                    >
                                                        {ct.listProductDetails
                                                            .filter((spct, index, self) =>
                                                                index === self.findIndex((item) => item.color.id === spct.color.id)
                                                            )
                                                            .map((spct) => (
                                                                <ToggleButton
                                                                    key={spct.id}
                                                                    value={spct.color.id}
                                                                    style={{
                                                                        width: 25,
                                                                        height: 25,
                                                                        borderRadius: '50%',
                                                                        backgroundColor: spct.color.hexCode.startsWith('linear') ? 'transparent' : spct.color.hexCode,
                                                                        backgroundImage: spct.color.hexCode.startsWith('linear') ? spct.color.hexCode : 'none',
                                                                        marginRight: 8,
                                                                        boxShadow: selectedColor === spct.color.id ? '0 0 0 3px whitesmoke' : 'none',
                                                                        border: selectedColor === spct.color.id ? '2px solid #000' : '1px solid #ddd',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                />
                                                            ))}
                                                    </ToggleButtonGroup>
                                                </div>

                                                {/* Chọn kích thước */}
                                                <div className='d-flex my-2'>
                                                    <ToggleButtonGroup
                                                        exclusive
                                                        onChange={(e, newSize) => {
                                                            if (newSize !== null) {
                                                                handleSizeChange(ct.listProductDetails[0].id, newSize);
                                                            }
                                                        }}
                                                        style={{ gap: '8px' }}
                                                        buttonStyle="solid"
                                                        value={selectedAttributes[ct.listProductDetails[0].id]?.selectedSize}
                                                    >
                                                        {ct.listProductDetails
                                                            .filter((spct, index, self) =>
                                                                index === self.findIndex((item) => item.size.id === spct.size.id)
                                                            )
                                                            .map((spct) => (
                                                                <ToggleButton
                                                                    key={spct.id}
                                                                    value={spct.size.id}
                                                                    style={{
                                                                        padding: '5px 10px',
                                                                        fontSize: '14px',
                                                                        borderRadius: '8px',
                                                                        color: selectedAttributes[ct.listProductDetails[0].id]?.selectedSize === spct.size.id ? 'white' : '#6A0DAD',
                                                                        backgroundColor: selectedAttributes[ct.listProductDetails[0].id]?.selectedSize === spct.size.id ? '#6A0DAD' : 'white',
                                                                        border: '1px solid #ccc',
                                                                        boxShadow: selectedAttributes[ct.listProductDetails[0].id]?.selectedSize === spct.size.id ? '0 4px 8px rgba(106, 13, 173, 0.3)' : 'none',
                                                                        transition: 'all 0.3s ease',
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        e.target.style.backgroundColor = '#D8BFD8';
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.target.style.backgroundColor = selectedAttributes[ct.listProductDetails[0].id]?.selectedSize === spct.size.id ? '#6A0DAD' : 'white';
                                                                    }}
                                                                >
                                                                    {spct.size.name}
                                                                </ToggleButton>
                                                            ))}
                                                    </ToggleButtonGroup>
                                                </div>

                                            </div>
                                        </Card>
                                    </Col>
                                );
                            })
                        ) : (
                            <p>Không có sản phẩm nào...</p>
                        )}
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default ProductNew;
