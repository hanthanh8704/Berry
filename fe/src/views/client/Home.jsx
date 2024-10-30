
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Carousel, Radio } from "antd";
import { Link } from 'react-router-dom';
import { getNewProducts, findByMSAndKC, getSPBanChay } from '../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import FormatCurrency from "../utilities/FormatCurrency.jsx";
import '../client/Home.css';


const HomeClient = () => {
    const [productDetailNew, setProductDetailNew] = useState([]);
    const [productDetailSell, setProductDetailSell] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState({});



    useEffect(() => {
        getAllData();
    }, []);

    const getAllData = () => {
        getAllSPCTNew();
        getAllSPCTSell();
    };

    // Thiết lập màu sắc và kích thước mặc định cho mỗi sản phẩm
    useEffect(() => {
        if (productDetailNew.length > 0) {
            const defaultAttributes = {};
            productDetailNew.forEach(product => {
                if (product.listProductDetails.length > 0) {
                    const firstSPCT = product.listProductDetails[0];
                    defaultAttributes[product.id] = {
                        selectedColor: firstSPCT.color.id,
                        selectedSize: firstSPCT.size.id,

                    };

                }
            });
            setSelectedAttributes(defaultAttributes);
        }
    }, [productDetailNew]);

    const getAllSPCTSell = () => {
        getSPBanChay()
            .then((response) => {
                setProductDetailSell(response.data);
            })
            .catch((error) => {
                console.error('Error fetching San Pham CT:', error);
            });
    };

    const getAllSPCTNew = () => {
        getNewProducts()
            .then((response) => {
                setProductDetailNew(response.data);
                console.log("dddddddd",response.data)
            })
            .catch((error) => {
                console.error('Error fetching San Pham CT:', error);
            });
    };

    const handleColorChange = (productId, colorId) => {
        setSelectedAttributes(prevState => ({
            ...prevState,
            [productId]: {
                ...prevState[productId],
                selectedColor: colorId,
            }
        }));
    };

    const handleSizeChange = (productId, sizeId) => {
        setSelectedAttributes(prevState => ({
            ...prevState,
            [productId]: {
                ...prevState[productId],
                selectedSize: sizeId,
            }
        }));
    };


    return (
        <div className="container mt-5">
            <div id="carouselExample" className="carousel slide mb-5" data-bs-ride="carousel" data-bs-interval="3000">
                <div className="carousel-inner">
                    <div className="carousel-item active" style={{ position: 'relative' }}>
                        <img src="fe/src/assets/images/users/vecteezy_t-shirts-mockup-with-text-space-on-colrful-background-hd-ai_27807333 3.png" className="d-block w-100" alt="Slide 1" style={{ height: '532px' }} />
                    </div>
                    <div className="carousel-item">
                        <img src="http://res.cloudinary.com/dqvs7ak1u/image/upload/v1720510131/Xanh%20d%C6%B0%C6%A1ng/b1ersadfeokk23qt9dtg.jpg" className="d-block w-100" alt="Slide 2" style={{ height: '532px' }} />
                    </div>
                    <div className="carousel-item">
                        <img src="http://res.cloudinary.com/dqvs7ak1u/image/upload/v1720510131/Xanh%20d%C6%B0%C6%A1ng/b1ersadfeokk23qt9dtg.jpg" className="d-block w-100" alt="Slide 3" style={{ height: '532px' }} />
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
                            const selectedProduct = selectedAttributes[ct.id] || {};
                            const selectedColor = selectedProduct.selectedColor || null;
                            const selectedSize = selectedProduct.selectedSize || null;
                            const selectedSPCT = ct.listProductDetails.find(spct => spct.color.id === selectedColor && spct.size.id === selectedSize);
                            return (
                                <Col key={index} span={6}>
                                    <Card
                                        style={{ width: '300px', height: '550px' }}
                                        hoverable
                                        cover={
                                            <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false}>
                                                {selectedSPCT && selectedSPCT.images && selectedSPCT.images.map((anh, index) => (
                                                    <div key={index} className="image-container">
                                                        <div className="ratio" style={{ '--bs-aspect-ratio': '75%' }}>
                                                            <div className="d-flex justify-content-center">
                                                                <Link className="nav-link" to={`/product-detail/${ct.id}?color=${selectedColor}&size=${selectedSize}`}>
                                                                    <img src={anh.url} alt="images" className="object-fit-contain mh-100 mw-100" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        {ct.discountPercentage ? (
                                                            <p className="discount-badge">
                                                                {-ct.discountPercentage}%
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                ))}
                                            </Carousel>
                                        }
                                    >
                                        <div className=''>
                                            {/* Hiển thị tên sản phẩm, thương hiệu và chất liệu */}
                                            {selectedSPCT ? (
                                                <h5 className="mt-3">
                                                    {`${ct.name}  ${selectedSPCT.brand.name}  ${selectedSPCT.collar.name} ${selectedSPCT.sleeve.name}`}
                                                </h5>
                                            ) : (
                                                <h5 className="mt-3">Không có sản phẩm</h5>
                                            )}

                                            {/* Hiển thị giá bán */}
                                            <div className='d-flex text-center'>
                                                {/* Lấy SPCT theo màu và kích thước đã chọn */}
                                                {ct.listProductDetails.some(spct => spct.color.id === selectedColor && spct.size.id === selectedSize) ? (
                                                    ct.listProductDetails.map(spct => (
                                                        spct.color.id === selectedColor && spct.size.id === selectedSize && (
                                                            spct.discountPrice !== 0 ? (
                                                                <React.Fragment key={spct.id}>
                                                                    <h5 className="text-dark fw-semibold text-decoration-line-through">
                                                                        <FormatCurrency value={spct.price} />
                                                                    </h5>
                                                                    <h5 className="text-danger fw-semibold mx-2">
                                                                        <FormatCurrency value={spct.discountPrice} />
                                                                    </h5>
                                                                </React.Fragment>
                                                            ) : (
                                                                <h5 key={spct.id} className="text-dark fw-semibold">
                                                                    <FormatCurrency value={spct.price} />
                                                                </h5>
                                                            )
                                                        )
                                                    ))
                                                ) : (
                                                    <h5>Không có sản phẩm</h5>
                                                )}
                                            </div>


                                            {/* Chọn màu sắc */}
                                            <div className='d-flex'>
                                                <Radio.Group
                                                    buttonStyle="solid"
                                                    onChange={(e) => handleColorChange(ct.id, e.target.value)}
                                                    value={selectedColor}
                                                >
                                                    {ct.listProductDetails
                                                        .filter((spct, index, self) =>
                                                            index === self.findIndex((item) => item.color.id === spct.color.id)
                                                        )
                                                        .map((spct) => (
                                                            <Radio.Button
                                                                key={spct.id}
                                                                value={spct.color.id}
                                                                className='my-1'
                                                                style={{
                                                                    display: 'inline-block',
                                                                    width: 50,
                                                                    height: 35,
                                                                    borderRadius: '2px',
                                                                    backgroundColor: spct.color.hexCode.startsWith('linear') ? 'transparent' : spct.color.hexCode,
                                                                    backgroundImage: spct.color.hexCode.startsWith('linear') ? spct.color.hexCode : 'none',
                                                                    marginRight: 8,
                                                                }}
                                                            />
                                                        ))}
                                                </Radio.Group>
                                            </div>

                                            {/* Chọn kích thước */}
                                            <div className='d-flex my-2'>
                                                <Radio.Group
                                                    buttonStyle="solid"
                                                    onChange={(e) => handleSizeChange(ct.id, e.target.value)}
                                                    value={selectedSize}
                                                >
                                                    {ct.listProductDetails
                                                        .filter((spct, index, self) =>
                                                            index === self.findIndex((item) => item.size.id === spct.size.id)
                                                        )
                                                        .map((spct) => (
                                                            <Radio.Button
                                                                key={spct.id}
                                                                value={spct.size.id}
                                                                className='my-1'
                                                                style={{
                                                                    display: 'inline-block',
                                                                    width: 50,
                                                                    height: 35,
                                                                    marginRight: 8,
                                                                    borderRadius: '2px'
                                                                }}
                                                            >
                                                                {spct.size.name}
                                                            </Radio.Button>
                                                        ))}
                                                </Radio.Group>
                                            </div>
                                            
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })
                    ) : (
                        <p>Loading...</p>
                    )}
                </Row>
            </div>


        </div>
    );
};

export default HomeClient;
