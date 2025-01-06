

import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Carousel, Radio } from "antd";
import { Link } from 'react-router-dom';
import { getNewProducts, findByMSAndKC } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import FormatCurrency from "../../utilities/FormatCurrency.jsx";
import '../home/Home.css';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS
import axios from "axios"

const HomeClient = () => {
    const [productDetailNew, setProductDetailNew] = useState([]);
    const [productDetailSell, setProductDetailSell] = useState([]);

    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [selectedAttributesSell, setSelectedAttributesSell] = useState({});

    const [selectedSize, setSelectedSize] = useState(null); // Để lưu kích cỡ đã chọn
    const [selectedSizeSell, setSelectedSizeSell] = useState(null); // Để lưu kích cỡ đã chọn

    useEffect(() => {
        getAllData();
    }, []);

    const getAllData = () => {
        getAllSPCTNew();
        getAllProductDetailSell();
    };

    // Thiết lập màu sắc và kích thước mặc định cho mỗi sản phẩm
    useEffect(() => {
        if (productDetailNew.length > 0) {
            const defaultAttributes = {};
            productDetailNew.forEach(product => {
                product.listProductDetails.forEach(spct => {
                    defaultAttributes[spct.id] = {
                        selectedColor: spct.color.id,
                        selectedSize: spct.size.id,
                    };
                });
            });
            setSelectedAttributes(defaultAttributes);
        }
    }, [productDetailNew]);

    // Thiết lập màu sắc và kích thước mặc định cho mỗi sản phẩm

    useEffect(() => {
        if (productDetailSell.length > 0) {
            const defaultAttributes = {};
            productDetailSell.forEach(product => {
                product.listProductDetails.forEach(spct => {
                    defaultAttributes[spct.id] = {
                        selectedColorSell: spct.color.id,
                        selectedSizeSell: spct.size.id,
                    };
                });
            });
            setSelectedAttributesSell(defaultAttributes);
        }
    }, [productDetailSell]);

    // const getAllProductDetailSell = () => {
    //     axios
    //         .get(`http://localhost:8080/api/client/best-selling-product`)
    //         .then((response) => {
    //             setProductDetailSell(response.data);
    //             console.log("Product ProductSell llllllllllllllllllllllll", response.data)
    //             console.log("Hí ddddddddddddddddddddddddtooooooo", productDetailSell)
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // };

    // const getAllSPCTNew = () => {
    //     getNewProducts()
    //         .then((response) => {
    //             setProductDetailNew(response.data);
    //             console.log("Product detail new zzzzzzzzzzzzzzzzz", response.data)
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching San Pham CT:', error);
    //         });
    // };

    const getAllProductDetailSell = () => {
        axios
            .get(`http://localhost:8080/api/client/best-selling-product`)
            .then((response) => {
                const firstFourRecords = response.data.slice(0, 4); // Lấy 4 bản ghi đầu tiên
                setProductDetailSell(firstFourRecords); // Set vào state
                console.log("Product ProductSell llllllllllllllllllllllll", firstFourRecords);
                console.log("Hí ddddddddddddddddddddddddtooooooo", firstFourRecords);
            })
            .catch((error) => {
                console.error(error);
            });
    };



    const getAllSPCTNew = () => {
        getNewProducts()
            .then((response) => {
                const firstFourRecords = response.data.slice(0, 4); // Lấy 4 bản ghi đầu tiên
                setProductDetailNew(firstFourRecords); // Set vào state
                console.log("Product detail new zzzzzzzzzzzzzzzzz", firstFourRecords);
            })
            .catch((error) => {
                console.error('Error fetching San Pham CT:', error);
            });
    };


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

    const handleColorSellChange = (productId, value) => {
        setSelectedAttributesSell((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], selectedColorSell: value }
        }));
    };

    const handleSizeSellChange = (productId, value) => {
        setSelectedAttributesSell((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], selectedSizeSell: value }
        }));
    };


    useEffect(() => {
        // Kiểm tra xem bootstrap có được load đúng không
        if (window.bootstrap) {
            const carousel = new window.bootstrap.Carousel(document.querySelector('#carouselExample'), {
                ride: 'carousel',
                interval: 3000,
            });
        } else {
            3
            console.error('Bootstrap JS is not loaded');
        }
    }, []);

    return (
        <div className="container mt-5">

            <div id="carouselExample" className="carousel slide mb-5" data-bs-ride="carousel" data-bs-interval="1000">
                <div className="carousel-inner">
                    <div className="carousel-item active" style={{ position: 'relative' }}>
                        <Link
                            className="nav-link"
                            to={`/products/tri-an`}
                        >
                            <img src="src/assets/images/m3jgqrvy0sj708bnz2a1800x833.webp" className="d-block w-100" alt="Slide 1" style={{ height: '532px' }} />
                        </Link>
                    </div>
                    <div className="carousel-item">
                        <Link
                            className="nav-link"
                            to={`/products/black-friday`}
                        >
                            <img src="src/assets/images/m39i6blt1gn28jb86zhero-banner-black-friday (2).webp" className="d-block w-100" alt="Slide 3" style={{ height: '532px' }} />
                        </Link>
                    </div>
                    <div className="carousel-item">
                        <Link
                            className="nav-link"
                            to={`/products/ao-nam-dep`}
                        >
                            <img src="/src/assets/images/banner-thoi-trang-nam-dep.jpg" className="d-block w-100" alt="Slide 3" style={{ height: '532px' }} />
                        </Link>
                    </div>
                    <div className="carousel-item">
                        <Link
                            className="nav-link"
                            to={`/products/ao-nu-dep`}
                        >
                            <img src="/src/assets/images/banner-thoi-trang-nu.jpg" className="d-block w-100" alt="Slide 3" style={{ height: '532px' }} />
                        </Link>
                    </div>
                </div>
                <button style={{ backgroundColor: '#6A0DAD', position: 'absolute', top: '50%', left: '5%', height: '40px', width: '40px', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(-50%)' }} className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button style={{ backgroundColor: '#6A0DAD', position: 'absolute', top: '50%', right: '5%', height: '40px', width: '40px', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(-50%)' }} className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <div className='my-5'>
                <h1 className='text-center mb-5'> Sản phẩm mới về</h1>
                <Row gutter={[16, 16]}>
                    {productDetailNew.length > 0 ? (
                        productDetailNew.map((ct, index) => {
                            const selectedProduct = selectedAttributes[ct.listProductDetails[0].id] || {};
                            const selectedColor = selectedProduct.selectedColor || null;
                            const selectedSize = selectedProduct.selectedSize || null;
                            const selectedSPCT = ct.listProductDetails.find(spct => spct.color.id === selectedColor && spct.size.id === selectedSize);

                            return (
                                <Col key={index} span={6}>
                                    <Card
                                        style={{
                                            width: '260px',
                                            height: '640px',
                                            border: '2px solid whitesmoke',
                                            borderRadius: '8px',
                                            transition: 'all 0.3s ease',
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
                        <p>Không có sản phẩm mới về</p>
                    )}
                </Row>
                <div className="my-4 text-center">
                    <Button
                        type="default"
                        href="/products/moi-ve"
                        style={{
                            borderRadius: '8px',
                            border: '1px solid #d9d9d9',
                            backgroundColor: '#f6f8fa',
                            color: '#1d1d1f',
                            width: '300px',
                            padding: '5px 20px',
                            fontSize: '14px',
                            fontWeight: '500',
                            textAlign: 'center',
                            textDecorationLine:'none',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        }}
                        onClick={() => console.log('Xem thêm')}
                    >
                        Xem thêm
                    </Button>
                </div>
            </div >


            <div className='my-5'>
                <h1 className='text-center mb-5'> Sản phẩm bán chạy</h1>
                <Row gutter={[16, 16]}>
                    {productDetailSell.length > 0 ? (
                        productDetailSell.map((ct, index) => {

                            const selectedProductSell = selectedAttributesSell[ct.listProductDetails[0].id] || {};
                            const selectedColorSell = selectedProductSell.selectedColorSell || null;
                            const selectedSizeSell = selectedProductSell.selectedSizeSell || null;
                            const selectedSPCTSell = ct.listProductDetails.find(spct => spct.color.id === selectedColorSell && spct.size.id === selectedSizeSell);

                            return (
                                <Col key={index} span={6}>
                                    <Card
                                        style={{
                                            width: '260px',
                                            height: '640px',
                                            border: '2px solid whitesmoke',
                                            borderRadius: '8px',
                                            transition: 'all 0.3s ease',
                                        }}
                                        hoverable
                                        cover={
                                            <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false}>
                                                {(selectedSPCTSell?.images?.length > 0
                                                    ? selectedSPCTSell.images
                                                    : ct.listProductDetails[0].images || []
                                                ).map((anh, index) => (
                                                    <div key={index} className="image-container">
                                                        <div className="ratio" style={{ '--bs-aspect-ratio': '150%' }}>
                                                            <div className="d-flex justify-content-center">
                                                                <Link className="nav-link" to={`/product-detail/${selectedSPCTSell?.id}?color=${selectedColorSell}&size=${selectedSizeSell}`}>
                                                                    <img
                                                                        src={anh.url}
                                                                        alt="images"
                                                                        className="object-fit-contain mh-100 mw-100 card-image"
                                                                    />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        {selectedSPCTSell?.discountPercentage != 0 && selectedSPCTSell != null ? (
                                                            <p className="discount-badge" style={{
                                                                position: 'absolute',
                                                                top: '3px',
                                                                right: '2px',
                                                                backgroundColor: 'red',
                                                                color: 'white',
                                                                padding: '5px 10px',
                                                                borderRadius: '50%',
                                                            }}>
                                                                {-selectedSPCTSell?.discountPercentage}%
                                                            </p>
                                                        ) : ''}
                                                    </div>
                                                ))}
                                            </Carousel>

                                        }
                                    >
                                        <div className='' style={{ width: '220px' }}>
                                            {selectedSPCTSell ? (
                                                <h5 className="mt-3">
                                                    {`${ct.name} ${selectedSPCTSell.brand.name}  ${selectedSPCTSell.sleeve.name} ${selectedSPCTSell.collar.name}`}
                                                </h5>
                                            ) : (
                                                <h5 className="mt-3">Hết hàng</h5>
                                            )}


                                            {/* Hiển thị giá bán */}
                                            <div className='d-flex text-center'>
                                                {ct.listProductDetails.some(spct => spct.color.id === selectedColorSell && spct.size.id === selectedSizeSell) ? (
                                                    ct.listProductDetails.map(spct => (
                                                        spct.color.id === selectedColorSell && spct.size.id === selectedSizeSell && (
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
                                                    value={selectedColorSell}
                                                    onChange={(e, newColor) => {
                                                        if (newColor !== null) {
                                                            handleColorSellChange(ct.listProductDetails[0].id, newColor);
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
                                                                    boxShadow: selectedColorSell === spct.color.id ? '0 0 0 3px whitesmoke' : 'none',
                                                                    border: selectedColorSell === spct.color.id ? '2px solid #000' : '1px solid #ddd',
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
                                                            handleSizeSellChange(ct.listProductDetails[0].id, newSize);
                                                        }
                                                    }}
                                                    style={{ gap: '8px' }}
                                                    buttonStyle="solid"
                                                    value={selectedAttributesSell[ct.listProductDetails[0].id]?.selectedSizeSell}
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
                                                                    color: selectedAttributesSell[ct.listProductDetails[0].id]?.selectedSizeSell === spct.size.id ? 'white' : '#6A0DAD',
                                                                    backgroundColor: selectedAttributesSell[ct.listProductDetails[0].id]?.selectedSizeSell === spct.size.id ? '#6A0DAD' : 'white',
                                                                    border: '1px solid #ccc',
                                                                    boxShadow: selectedAttributesSell[ct.listProductDetails[0].id]?.selectedSizeSell === spct.size.id ? '0 4px 8px rgba(106, 13, 173, 0.3)' : 'none',
                                                                    transition: 'all 0.3s ease',
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.backgroundColor = '#D8BFD8';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.backgroundColor = selectedAttributesSell[ct.listProductDetails[0].id]?.selectedSizeSell === spct.size.id ? '#6A0DAD' : 'white';
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
                        <p>Không có sản phẩm bán chạy</p>
                    )}
                </Row>

                <div className="my-4 text-center">
                    <Button
                        type="default"
                        href="/products/ban-chay-nhat"
                        style={{
                            borderRadius: '8px',
                            border: '1px solid #d9d9d9',
                            backgroundColor: '#f6f8fa',
                            color: '#1d1d1f',
                            width: '300px',
                            padding: '5px 20px',
                            fontSize: '14px',
                            fontWeight: '500',
                            textDecorationLine:'none',
                            textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        }}
                        onClick={() => console.log('Xem thêm')}
                    >
                        Xem thêm
                    </Button>
                </div>
            </div >

        </div >
    );
};

export default HomeClient;
