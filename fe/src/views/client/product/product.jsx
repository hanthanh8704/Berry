//Bản tiếng Việt
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import React, { useEffect, useState } from "react";
// import { Row, Col, Card, Carousel, Radio, Select, Grid } from "antd";
// import { Link, useParams } from 'react-router-dom';
// import { getAllProductsByIdDM, getSearchProductsKCTHMS, findAllThuongHieu, findAllMauSac, findAllKichCo } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import FormatCurrency from "../../utilities/FormatCurrency.jsx";
// import '../../client/product/product.css';
// import { Box, Typography } from '@mui/material';

// const { Option } = Select;

// const Product = () => {
//     const [productDetail, setProductDetail] = useState([]);

//     const [product, setProduct] = useState([]);

//     const [thuongHieu, setThuongHieu] = useState([]);
//     const [mauSac, setMauSac] = useState([]);
//     const [kichCo, setKichCo] = useState([]);
//     const [selectedAttributes, setSelectedAttributes] = useState({});
//     const [selectedMauSac, setSelectedMauSac] = useState('ALL');
//     const [selectedThuongHieu, setSelectedThuongHieu] = useState('ALL');
//     const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');
//     const [selectedKichCo, setSelectedKichCo] = useState('ALL');
//     const [sort, setSort] = useState('newest');

//     const { id } = useParams();

//     useEffect(() => {
//         fetchFilteredProducts();
//     }, [selectedMauSac, selectedThuongHieu, selectedPriceRange, selectedKichCo, sort]);

//     const fetchFilteredProducts = () => {
//         getSearchProductsKCTHMS(selectedMauSac, id, selectedThuongHieu, selectedKichCo, selectedPriceRange, sort)
//             .then(response => {
//                 setProduct(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching products:', error);
//             });
//     };

//     const handleSortChange = (value) => {
//         setSort(value);
//     };

//     const handleThuongHieu = (e) => {
//         setSelectedThuongHieu(e.target.value);
//     };

//     const handleMauSac = (e) => {
//         setSelectedMauSac(e.target.value);
//     };

//     const handlePriceRangeChange = (e) => {
//         setSelectedPriceRange(e.target.value);
//     };

//     const handleKichCo = (e) => {
//         setSelectedKichCo(e.target.value);
//     };

//     useEffect(() => {
//         if (product.length > 0) {
//             const defaultAttributes = {};
//             product.forEach(product => {
//                 product.listSPCT.forEach(spct => {
//                     defaultAttributes[spct.id] = {
//                         selectedColor: spct.idMauSac.id,
//                         selectedSize: spct.idKichCo.id,
//                     };
//                 });
//             });
//             setSelectedAttributes(defaultAttributes);
//         }
//     }, [product]);

//     const handleColorChange = (productId, value) => {
//         setSelectedAttributes((prev) => ({
//             ...prev,
//             [productId]: { ...prev[productId], selectedColor: value }
//         }));
//     };

//     const handleSizeChange = (productId, value) => {
//         setSelectedAttributes((prev) => ({
//             ...prev,
//             [productId]: { ...prev[productId], selectedSize: value }
//         }));
//     };

//     useEffect(() => {
//         getAllData();
//     }, [id]);

//     const getAllData = () => {
//         getAllSanPhamById();
//         // getSP();
//         getAllThuongHieu();
//         getAllMauSac();
//         getAllKichCo();
//     };
//     const getAllThuongHieu = () => {
//         findAllThuongHieu(id)
//             .then((response) => {
//                 setThuongHieu(response.data);
//                 console.log('product', product);
//             })
//             .catch((error) => {
//                 console.error('Error fetching San Pham CT:', error);
//             });
//     };

//     const getAllMauSac = () => {
//         findAllMauSac(id)
//             .then((response) => {
//                 setMauSac(response.data);
//                 console.log('product', product);
//             })
//             .catch((error) => {
//                 console.error('Error fetching San Pham CT:', error);
//             });
//     };

//     const getAllKichCo = () => {
//         findAllKichCo(id)
//             .then((response) => {
//                 setKichCo(response.data);
//                 console.log('product', product);
//             })
//             .catch((error) => {
//                 console.error('Error fetching San Pham CT:', error);
//             });
//     };

//     const getAllSanPhamById = () => {
//         getAllProductsByIdDM(id)
//             .then((response) => {
//                 setProduct(response.data);
//                 console.log('producteeeeeeeeeeeeeeeeee', product);
//             })
//             .catch((error) => {
//                 console.error('Error fetching San Pham CT:', error);
//             });
//     };


//     // const getSP = () => {
//     //     if (id) {
//     //         findAllSPById(id)
//     //             .then((response) => {
//     //                 setProductDetail(response.data);
//     //                 console.log('product dddddddddddddddd', response.data);
//     //             })
//     //             .catch((error) => {
//     //                 console.error('Error fetching San pham:', error);
//     //                 setProductDetail(null);
//     //             });
//     //     } else {
//     //         console.error('ID không hợp lệ:', id);
//     //         setProductDetail(null);
//     //     }
//     // };

//     return (
//         <div className="container mt-4">
//             <Row gutter={[30, 30]}>
//                 <Col xs={24} sm={24} md={8}>
//                     <Box mb={2}>
//                         <Box display="flex" alignItems="center" className='my-3'>
//                             <h5
//                                 component={Link}
//                                 to="/home"
//                                 sx={{ color: 'black', textDecoration: 'none', marginX: 1 }}
//                             >
//                                 Trang chủ
//                             </h5>
//                             <Typography sx={{ color: 'black', marginX: 1 }}>|</Typography>
//                             <h5

//                                 component={Link}
//                                 to={`/products/${id}`}
//                                 sx={{ color: 'black', textDecoration: 'none', marginX: 1 }}
//                             >
//                                 {product[0]?.idDanhMuc?.ten}
//                             </h5>
//                         </Box>
//                         <Typography variant="h3" className='my-4'>
//                             Bộ lọc
//                         </Typography>
//                         <Box className='mt-4'>
//                             <b className='my-3'>Thương hiệu</b>
//                             <Radio.Group
//                                 value={selectedThuongHieu}
//                                 onChange={handleThuongHieu}
//                                 className='my-3'
//                                 buttonStyle="solid"
//                                 style={{ display: 'flex', flexDirection: 'column' }} // Đảm bảo bố cục theo chiều dọc
//                             >
//                                 <Radio value={"ALL"} style={{ marginBottom: 8 }} >
//                                     Tất cả
//                                 </Radio>
//                                 {thuongHieu.map(th => (
//                                     <Radio
//                                         key={th.id}
//                                         value={th.id}
//                                         style={{ marginBottom: 8 }} // Khoảng cách giữa các radio buttons
//                                     >
//                                         {th.ten}
//                                     </Radio>
//                                 ))}
//                             </Radio.Group>
//                         </Box>
//                         <Box className='mt-4'>
//                             <b className='my-3'>Giá</b>
//                             <Radio.Group
//                                 value={selectedPriceRange}
//                                 onChange={handlePriceRangeChange}
//                                 className='my-3'
//                                 buttonStyle="solid"
//                                 style={{ display: 'flex', flexDirection: 'column' }} // Đảm bảo bố cục theo chiều dọc
//                             >
//                                 <Radio value={"ALL"} style={{ marginBottom: 8 }} >
//                                     Tất cả
//                                 </Radio>
//                                 <Radio value="under300" style={{ marginBottom: 8 }}>
//                                     Dưới 300.000đ
//                                 </Radio>
//                                 <Radio value="300to700" style={{ marginBottom: 8 }}>
//                                     Từ 300.000đ - 700.000đ
//                                 </Radio>
//                                 <Radio value="above700" style={{ marginBottom: 8 }}>
//                                     Trên 700.000đ
//                                 </Radio>
//                             </Radio.Group>
//                         </Box>
//                         <Box className='mt-4'>
//                             <b className='my-3'>Kích cỡ</b> <br /><br />
//                             <Radio.Group buttonStyle="solid"
//                                 value={selectedKichCo}
//                                 onChange={handleKichCo}>
//                                 <Radio.Button value="ALL">
//                                     Tất cả
//                                 </Radio.Button>
//                                 {kichCo.map(kc => (
//                                     <Radio.Button key={kc.id} value={kc.id}>
//                                         {kc.ten}
//                                     </Radio.Button>
//                                 ))}
//                             </Radio.Group>
//                         </Box>
//                         <Box className='mt-4'>
//                             <b className='my-3'>Màu sắc</b>
//                             <Radio.Group
//                                 value={selectedMauSac}
//                                 onChange={handleMauSac}
//                                 className='my-3'
//                                 buttonStyle="solid"
//                                 style={{ display: 'flex', flexDirection: 'column' }} // Ensures vertical layout
//                             >
//                                 <Radio value={"ALL"} style={{ marginBottom: 8 }}>
//                                     Tất cả
//                                 </Radio>
//                                 {mauSac.map(color => (
//                                     <Radio
//                                         key={color.id}
//                                         value={color.id}
//                                         style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}
//                                     >
//                                         <span
//                                             style={{
//                                                 display: 'inline-block',
//                                                 width: 20,
//                                                 height: 20,
//                                                 borderRadius: '50%',
//                                                 backgroundColor: color.ma,
//                                                 backgroundImage: color.ma.startsWith('linear') ? color.ma : 'none',
//                                                 marginRight: 8,
//                                                 border: '1px solid #000'
//                                             }}
//                                         />
//                                         {color.ten}
//                                     </Radio>
//                                 ))}
//                             </Radio.Group>
//                         </Box>
//                     </Box>
//                 </Col>

//                 <Col xs={24} sm={24} md={16}>
//                     <div className="mb-4 text-end">
//                         <Select
//                             className='rounded'
//                             defaultValue="newest"
//                             style={{ width: 236, height: 47, border: '1px solid black' }}
//                             onChange={handleSortChange}
//                         >
//                             <Option value="newest">Mới nhất</Option>
//                             <Option value="price-asc">Giá từ thấp đến cao</Option>
//                             <Option value="price-desc">Giá từ cao đến thấp</Option>
//                         </Select>
//                     </div>
//                     <Row gutter={[30, 30]} className='ml-2 '>
//                         {product.length > 0 ? (
//                             product.map((ct, index) => {                   
//                                 const selectedProduct = selectedAttributes[ct.listSPCT[0].id] || {};
//                                 const selectedColor = selectedProduct.selectedColor || null;
//                                 const selectedSize = selectedProduct.selectedSize || null;
//                                 const selectedSPCT = ct.listSPCT.find(spct => spct.idMauSac.id === selectedColor && spct.idKichCo.id === selectedSize);
//                                 return (
//                                     <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
//                                         <Card
//                                             style={{ width: '250px', height: '500px' }}
//                                             hoverable
//                                             cover={
//                                                 <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false}>
//                                                     {selectedSPCT && selectedSPCT.anhList && selectedSPCT.anhList.map((anh, index) => (
//                                                         <div key={index} className="image-container">
//                                                             <div className="ratio" style={{ '--bs-aspect-ratio': '75%' }}>
//                                                                 <div className="d-flex justify-content-center">
//                                                                     <Link className="nav-link" to={`/product-detail/${ct.id}?color=${selectedColor}&size=${selectedSize}`}>
//                                                                         <img src={anh.anh} alt="images" className="object-fit-contain mh-100 mw-100" />
//                                                                     </Link>
//                                                                 </div>
//                                                             </div>
//                                                             {ct.phanTramGiam ? (
//                                                                 <p className="discount-badge">
//                                                                     {-ct.phanTramGiam}%
//                                                                 </p>
//                                                             ) : null}
//                                                         </div>
//                                                     ))}
//                                                 </Carousel>
//                                             }
//                                         >
//                                             <div className=''>
//                                                 {selectedSPCT ? (
//                                                     <h5 className="mt-3">
//                                                         {`${ct.ten}- ${selectedSPCT.idThuongHieu.ten} - ${selectedSPCT.idChatLieu.ten}`}
//                                                     </h5>
//                                                 ) : (
//                                                     <h5 className="mt-3">Không có sản phẩm</h5>
//                                                 )}

//                                                 {/* Hiển thị giá bán */}
//                                                 <div className='d-flex text-center'>
//                                                     {ct.listSPCT.some(spct => spct.idMauSac.id === selectedColor && spct.idKichCo.id === selectedSize) ? (
//                                                         ct.listSPCT.map(spct => (
//                                                             spct.idMauSac.id === selectedColor && spct.idKichCo.id === selectedSize && (
//                                                                 spct.giaMoi !== 0 ? (
//                                                                     <React.Fragment key={spct.id}>
//                                                                         <h5 className="text-dark fw-semibold text-decoration-line-through">
//                                                                             <FormatCurrency value={spct.giaBan} />
//                                                                         </h5>
//                                                                         <h5 className="text-danger fw-semibold mx-2">
//                                                                             <FormatCurrency value={spct.giaMoi} />
//                                                                         </h5>
//                                                                     </React.Fragment>
//                                                                 ) : (
//                                                                     <h5 key={spct.id} className="text-dark fw-semibold">
//                                                                         <FormatCurrency value={spct.giaBan} />
//                                                                     </h5>
//                                                                 )
//                                                             )
//                                                         ))
//                                                     ) : (
//                                                         <h5>Không có sản phẩm</h5>
//                                                     )}
//                                                 </div>

//                                                 {/* Chọn màu sắc */}
//                                                 <div className='d-flex'>
//                                                     <Radio.Group
//                                                         buttonStyle="solid"
//                                                         onChange={(e) => handleColorChange(ct.listSPCT[0].id, e.target.value)}
//                                                         value={selectedColor}
//                                                     >
//                                                         {ct.listSPCT
//                                                             .filter((spct, index, self) =>
//                                                                 index === self.findIndex((item) => item.idMauSac.id === spct.idMauSac.id)
//                                                             )
//                                                             .map((spct) => (
//                                                                 <Radio.Button
//                                                                     key={spct.id}
//                                                                     value={spct.idMauSac.id}
//                                                                     className='my-1'
//                                                                     style={{
//                                                                         display: 'inline-block',
//                                                                         width: 50,
//                                                                         height: 35,
//                                                                         borderRadius: '2px',
//                                                                         backgroundColor: spct.idMauSac.ma.startsWith('linear') ? 'transparent' : spct.idMauSac.ma,
//                                                                         backgroundImage: spct.idMauSac.ma.startsWith('linear') ? spct.idMauSac.ma : 'none',
//                                                                         marginRight: 8,
//                                                                     }}
//                                                                 />
//                                                             ))}
//                                                     </Radio.Group>
//                                                 </div>
//                                                 {/* Chọn kích thước */}
//                                                 <div className='d-flex my-2'>
//                                                     <Radio.Group
//                                                         buttonStyle="solid"
//                                                         onChange={(e) => handleSizeChange(ct.listSPCT[0].id, e.target.value)}
//                                                         value={selectedSize}
//                                                     >
//                                                         {ct.listSPCT
//                                                             .filter((spct, index, self) =>
//                                                                 index === self.findIndex((item) => item.idKichCo.id === spct.idKichCo.id)
//                                                             )
//                                                             .map((spct) => (
//                                                                 <Radio.Button
//                                                                     key={spct.id}
//                                                                     value={spct.idKichCo.id}
//                                                                     className='my-1'
//                                                                     style={{ marginRight: 8 }}
//                                                                 >
//                                                                     {spct.idKichCo.ten}
//                                                                 </Radio.Button>
//                                                             ))}
//                                                     </Radio.Group>
//                                                 </div>
                                                
//                                             </div>
//                                         </Card>
//                                     </Col>
//                                 );
//                             })
//                         ) : (
//                             <p>Loading...</p>
//                         )}
//                     </Row>
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default Product;



//Bản tiếng Anh
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Carousel, Radio, Select, Grid } from "antd";
import { Link, useParams } from 'react-router-dom';
import { getAllProductsByIdDM, getSearchProductsKCTHMS, findAllThuongHieu, findAllMauSac, findAllKichCo } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import FormatCurrency from "../../utilities/FormatCurrency.jsx";
import '../../client/product/product.css';
import { Box, Typography } from '@mui/material';

const { Option } = Select;

const Product = () => {
    const [productDetail, setProductDetail] = useState([]);

    const [product, setProduct] = useState([]);

    const [thuongHieu, setThuongHieu] = useState([]);
    const [mauSac, setMauSac] = useState([]);
    const [kichCo, setKichCo] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [selectedMauSac, setSelectedMauSac] = useState('ALL');
    const [selectedThuongHieu, setSelectedThuongHieu] = useState('ALL');
    const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');
    const [selectedKichCo, setSelectedKichCo] = useState('ALL');
    const [sort, setSort] = useState('newest');

    const { id } = useParams();

    useEffect(() => {
        fetchFilteredProducts();
    }, [selectedMauSac, selectedThuongHieu, selectedPriceRange, selectedKichCo, sort]);

    const fetchFilteredProducts = () => {
        getSearchProductsKCTHMS(selectedMauSac, id, selectedThuongHieu, selectedKichCo, selectedPriceRange, sort)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
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
        if (product.length > 0) {
            const defaultAttributes = {};
            product.forEach(product => {
                product.listProductDetails.forEach(spct => {
                    defaultAttributes[spct.id] = {
                        selectedColor: spct.color.id,
                        selectedSize: spct.size.id,
                    };
                });
            });
            setSelectedAttributes(defaultAttributes);
        }
    }, [product]);

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
    }, [id]);

    const getAllData = () => {
        getAllSanPhamById();
        // getSP();
        getAllThuongHieu();
        getAllMauSac();
        getAllKichCo();
    };
    const getAllThuongHieu = () => {
        findAllThuongHieu(id)
            .then((response) => {
                setThuongHieu(response.data);
                console.log('product', product);
            })
            .catch((error) => {
                console.error('Error fetching San Pham CT:', error);
            });
    };

    const getAllMauSac = () => {
        findAllMauSac(id)
            .then((response) => {
                setMauSac(response.data);
                console.log('product', product);
            })
            .catch((error) => {
                console.error('Error fetching San Pham CT:', error);
            });
    };

    const getAllKichCo = () => {
        findAllKichCo(id)
            .then((response) => {
                setKichCo(response.data);
                console.log('product', product);
            })
            .catch((error) => {
                console.error('Error fetching San Pham CT:', error);
            });
    };

    const getAllSanPhamById = () => {
        getAllProductsByIdDM(id)
            .then((response) => {
                setProduct(response.data);
                console.log('producteeeeeeeeeeeeeeeeee', product);
            })
            .catch((error) => {
                console.error('Error fetching San Pham CT:', error);
            });
    };


    // const getSP = () => {
    //     if (id) {
    //         findAllSPById(id)
    //             .then((response) => {
    //                 setProductDetail(response.data);
    //                 console.log('product dddddddddddddddd', response.data);
    //             })
    //             .catch((error) => {
    //                 console.error('Error fetching San pham:', error);
    //                 setProductDetail(null);
    //             });
    //     } else {
    //         console.error('ID không hợp lệ:', id);
    //         setProductDetail(null);
    //     }
    // };

    return (
        <div className="container mt-4">
            <Row gutter={[30, 30]}>
                <Col xs={24} sm={24} md={8}>
                    <Box mb={2}>
                        <Box display="flex" alignItems="center" className='my-3'>
                            <h5
                                component={Link}
                                to="/home"
                                sx={{ color: 'black', textDecoration: 'none', marginX: 1 }}
                            >
                                Trang chủ
                            </h5>
                            <Typography sx={{ color: 'black', marginX: 1 }}>|</Typography>
                            <h5

                                component={Link}
                                to={`/products/${id}`}
                                sx={{ color: 'black', textDecoration: 'none', marginX: 1 }}
                            >
                                {product[0]?.category?.name}
                            </h5>
                        </Box>
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
                    <Row gutter={[30, 30]} className='ml-2 '>
                        {product.length > 0 ? (
                            product.map((ct, index) => {                   
                                const selectedProduct = selectedAttributes[ct.listProductDetails[0].id] || {};
                                const selectedColor = selectedProduct.selectedColor || null;
                                const selectedSize = selectedProduct.selectedSize || null;
                                const selectedSPCT = ct.listProductDetails.find(spct => spct.color.id === selectedColor && spct.size.id === selectedSize);
                                return (
                                    <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
                                        <Card
                                            style={{ width: '250px', height: '500px' }}
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
                                                {selectedSPCT ? (
                                                    <h5 className="mt-3">
                                                        {`${ct.name}- ${selectedSPCT.brand.name} - ${selectedSPCT.material.name}`}
                                                    </h5>
                                                ) : (
                                                    <h5 className="mt-3">Không có sản phẩm</h5>
                                                )}

                                                {/* Hiển thị giá bán */}
                                                <div className='d-flex text-center'>
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
                                                        onChange={(e) => handleColorChange(ct.listProductDetails[0].id, e.target.value)}
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
                                                        onChange={(e) => handleSizeChange(ct.listProductDetails[0].id, e.target.value)}
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
                                                                    style={{ marginRight: 8 }}
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
                            <p>Không có sản phẩm nào...</p>
                        )}
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default Product;
