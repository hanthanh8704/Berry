//Bản tiếng việt
// import { useLocation, useParams, Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import React, { useEffect, useState } from "react";
// import { Row, Col, Card, Carousel, Radio, Select, Grid } from "antd";
// import { findByMSAndKC, getAllByIdSP, findFilteredSearchProducts, findAllThuongHieu, findAllMauSac, findAllKichCo } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import FormatCurrency from "../../utilities/FormatCurrency.jsx";
// import '../../client/product/product.css';
// import { Box, Typography } from '@mui/material';
// const { Option } = Select;
// import '../search/Search.css';

// const SearchResults = () => {

//     const location = useLocation();
//     const { product = [], setProduct } = location.state || {}; // Đảm bảo `product` có giá trị mặc định là mảng rỗng và kiểm tra `setProduct`
//     const { key } = useParams(); // Lấy từ khóa tìm kiếm từ URL

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const [thuongHieu, setThuongHieu] = useState([]);
//     const [mauSac, setMauSac] = useState([]);
//     const [kichCo, setKichCo] = useState([]);
//     const [selectedMauSac, setSelectedMauSac] = useState('ALL');
//     const [selectedThuongHieu, setSelectedThuongHieu] = useState('ALL');
//     const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');
//     const [selectedKichCo, setSelectedKichCo] = useState('ALL');
//     const [sort, setSort] = useState('newest');
//     const [filteredProducts, setFilteredProducts] = useState([]);
//     const [selectedAttributes, setSelectedAttributes] = useState({});

//     // Gọi API để lấy sản phẩm đã lọc khi các giá trị thay đổi
//     useEffect(() => {
//         console.log('Fetching products with llllll:', { key, selectedMauSac, selectedThuongHieu, selectedKichCo, selectedPriceRange, sort });
//         fetchFilteredProducts(); // Gọi hàm lọc sản phẩm khi component được mount
//     }, [key, selectedMauSac, selectedThuongHieu, selectedPriceRange, selectedKichCo, sort]); // Thêm `key` vào dependency array nếu muốn gọi lại khi key thay đổi

//     // Cập nhật hàm fetchFilteredProducts để hiển thị loading và xử lý lỗi
//     const fetchFilteredProducts = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await findFilteredSearchProducts(key, selectedMauSac, selectedThuongHieu, selectedKichCo, selectedPriceRange, sort);

//             console.log('Fetched products dddddddddddddddddddddd:', response.data); // Kiểm tra dữ liệu trả về

//             // Lọc sản phẩm dựa trên điều kiện
//             const results = response.data.filter(item => {
//                 return item.listSPCT && item.listSPCT.length > 0; // Kiểm tra listSPCT không rỗng
//             });

//             setFilteredProducts(results); // Cập nhật danh sách sản phẩm đã lọc
//             console.log('Fetched products mmmmmmmmmmm:', results);
//         } catch (error) {
//             console.error('Error fetching products:', error);
//             setError('Lỗi khi lấy sản phẩm. Vui lòng thử lại.');
//         } finally {
//             setLoading(false);
//         }
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
//     }, [key]);

//     const getAllData = () => {
//         getAllThuongHieu();
//         getAllMauSac();
//         getAllKichCo();
//     };
//     const getAllThuongHieu = () => {
//         findAllThuongHieu(key)
//             .then((response) => {
//                 setThuongHieu(response.data);
//                 console.log('product', product);
//             })
//             .catch((error) => {
//                 console.error('Error fetching San Pham CT:', error);
//             });
//     };

//     const getAllMauSac = () => {
//         findAllMauSac(key)
//             .then((response) => {
//                 setMauSac(response.data);
//                 console.log('product', product);
//             })
//             .catch((error) => {
//                 console.error('Error fetching San Pham CT:', error);
//             });
//     };

//     const getAllKichCo = () => {
//         findAllKichCo(key)
//             .then((response) => {
//                 setKichCo(response.data);
//                 console.log('product', product);
//             })
//             .catch((error) => {
//                 console.error('Error fetching San Pham CT:', error);
//             });
//     };





//     return (
//         <div className="container mt-4">
//             <Row gutter={[30, 30]}>
//                 {/* Cột bộ lọc */}
//                 <Col xs={24} sm={24} md={8}>
//                     <Box mb={2}>
//                         <Box display="flex" alignItems="center" className='my-3'>
//                             <h5>Kết quả tìm kiếm cho từ khóa: {key}</h5>
//                         </Box>
//                         <Typography variant="h3" className='my-4'>
//                             Bộ lọc
//                         </Typography>
//                         {/* Thương hiệu */}
//                         <Box className='mt-4'>
//                             <b className='my-3'>Thương hiệu</b>
//                             <Radio.Group
//                                 value={selectedThuongHieu}
//                                 onChange={handleThuongHieu}
//                                 className='my-3'
//                                 buttonStyle="solid"
//                                 style={{ display: 'flex', flexDirection: 'column' }}
//                             >
//                                 <Radio value={"ALL"} style={{ marginBottom: 8 }}>
//                                     Tất cả
//                                 </Radio>
//                                 {thuongHieu.map(th => (
//                                     <Radio key={th.id} value={th.id} style={{ marginBottom: 8 }}>
//                                         {th.ten}
//                                     </Radio>
//                                 ))}
//                             </Radio.Group>
//                         </Box>
//                         {/* Giá */}
//                         <Box className='mt-4'>
//                             <b className='my-3'>Giá</b>
//                             <Radio.Group
//                                 value={selectedPriceRange}
//                                 onChange={handlePriceRangeChange}
//                                 className='my-3'
//                                 buttonStyle="solid"
//                                 style={{ display: 'flex', flexDirection: 'column' }}
//                             >
//                                 <Radio value={"ALL"} style={{ marginBottom: 8 }}>
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
//                         {/* Kích cỡ */}
//                         <Box className='mt-4'>
//                             <b className='my-3 '>Kích cỡ</b>
//                             <Radio.Group
//                                 buttonStyle="solid"
//                                 value={selectedKichCo}
//                                 onChange={handleKichCo}
//                                 className='my-3'
//                                 style={{ display: 'flex' }}
//                             >
//                                 <Radio.Button value="ALL">Tất cả</Radio.Button>
//                                 {kichCo.map(kc => (
//                                     <Radio.Button key={kc.id} value={kc.id}>
//                                         {kc.ten}
//                                     </Radio.Button>
//                                 ))}
//                             </Radio.Group>
//                         </Box>
//                         {/* Màu sắc */}
//                         <Box className='mt-4'>
//                             <b className='my-3'>Màu sắc</b>
//                             <Radio.Group
//                                 value={selectedMauSac}
//                                 onChange={handleMauSac}
//                                 className='my-3'
//                                 buttonStyle="solid"
//                                 style={{ display: 'flex', flexDirection: 'column' }}
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

//                 {/* Cột kết quả tìm kiếm */}
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
//                     <Row gutter={[30, 30]}>
//                         {filteredProducts.length > 0 ? (
//                             filteredProducts.map((ct, index) => {
//                                 const selectedProduct = selectedAttributes[ct.listSPCT[0].id] || {};
//                                 const selectedColor = selectedProduct.selectedColor || null;
//                                 const selectedSize = selectedProduct.selectedSize || null;
//                                 const selectedSPCT = ct.listSPCT.find(spct => spct.idMauSac.id === selectedColor && spct.idKichCo.id === selectedSize);

//                                 return (
//                                     <Col xs={24} sm={12} md={8} lg={8} key={`${ct.id}-${index}`}> {/* Sử dụng ct.id kết hợp với index */}
//                                         <Card hoverable style={{ width: '250px', height: '500px' }}>
//                                             <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false}>
//                                                 {selectedSPCT && selectedSPCT.anhList && selectedSPCT.anhList.map((anh, imgIndex) => (
//                                                     <div key={imgIndex} className="image-container">
//                                                         <div className="ratio" style={{ '--bs-aspect-ratio': '75%' }}>
//                                                             <div className="d-flex justify-content-center">
//                                                                 <Link className="nav-link" to={`/product-detail/${ct.id}?color=${selectedColor}&size=${selectedSize}`}>
//                                                                     <img src={anh.anh} alt="images" className="object-fit-contain mh-100 mw-100" />
//                                                                 </Link>
//                                                             </div>
//                                                         </div>
//                                                         {ct.phanTramGiam ? (
//                                                             <p className="discount-badge">
//                                                                 {-ct.phanTramGiam}%
//                                                             </p>
//                                                         ) : null}
//                                                     </div>
//                                                 ))}
//                                             </Carousel>

//                                             {/* Hiển thị tên sản phẩm, thương hiệu và chất liệu */}
//                                             {selectedSPCT ? (
//                                                 <h5 className="mt-3">
//                                                     {`${ct.ten} , ${selectedSPCT.idThuongHieu.ten}  , ${selectedSPCT.idCoAo.ten} , ${selectedSPCT.idTayAo.ten}`}
//                                                 </h5>
//                                             ) : (
//                                                 <h5 className="mt-3">Không có sản phẩm</h5>
//                                             )}

//                                             {/* Hiển thị giá bán */}
//                                             <div className='d-flex text-center'>
//                                                 {ct.listSPCT.some(spct => spct.idMauSac.id === selectedColor && spct.idKichCo.id === selectedSize) ? (
//                                                     ct.listSPCT.map(spct => (
//                                                         spct.idMauSac.id === selectedColor && spct.idKichCo.id === selectedSize && (
//                                                             spct.giaMoi !== 0 ? (
//                                                                 <React.Fragment key={spct.id}>
//                                                                     <h5 className="text-dark fw-semibold text-decoration-line-through">
//                                                                         <FormatCurrency value={spct.giaBan} />
//                                                                     </h5>
//                                                                     <h5 className="text-danger fw-semibold mx-2">
//                                                                         <FormatCurrency value={spct.giaMoi} />
//                                                                     </h5>
//                                                                 </React.Fragment>
//                                                             ) : (
//                                                                 <h5 key={spct.id} className="text-dark fw-semibold">
//                                                                     <FormatCurrency value={spct.giaBan} />
//                                                                 </h5>
//                                                             )
//                                                         )
//                                                     ))
//                                                 ) : (
//                                                     <h5>Không có sản phẩm</h5>
//                                                 )}
//                                             </div>

//                                             {/* Chọn màu sắc */}
//                                             <div className='d-flex'>
//                                                 <Radio.Group
//                                                     buttonStyle="solid"
//                                                     onChange={(e) => handleColorChange(ct.listSPCT[0].id, e.target.value)}
//                                                     value={selectedColor}
//                                                 >
//                                                     {ct.listSPCT
//                                                         .filter((spct, index, self) =>
//                                                             index === self.findIndex((item) => item.idMauSac.id === spct.idMauSac.id)
//                                                         )
//                                                         .map((spct) => (
//                                                             <Radio.Button
//                                                                 key={spct.id}
//                                                                 value={spct.idMauSac.id}
//                                                                 className='my-1'
//                                                                 style={{
//                                                                     display: 'inline-block',
//                                                                     width: 50,
//                                                                     height: 35,
//                                                                     borderRadius: '2px',
//                                                                     backgroundColor: spct.idMauSac.ma.startsWith('linear') ? 'transparent' : spct.idMauSac.ma,
//                                                                     backgroundImage: spct.idMauSac.ma.startsWith('linear') ? spct.idMauSac.ma : 'none',
//                                                                     marginRight: 8,
//                                                                 }}
//                                                             />
//                                                         ))}
//                                                 </Radio.Group>
//                                             </div>
//                                             {/* Chọn kích thước */}
//                                             <div className='d-flex my-2'>
//                                                 <Radio.Group
//                                                     buttonStyle="solid"
//                                                     onChange={(e) => handleSizeChange(ct.listSPCT[0].id, e.target.value)}
//                                                     value={selectedSize}
//                                                 >
//                                                     {ct.listSPCT
//                                                         .filter((spct, index, self) =>
//                                                             index === self.findIndex((item) => item.idKichCo.id === spct.idKichCo.id)
//                                                         )
//                                                         .map((spct) => (
//                                                             <Radio.Button
//                                                                 key={spct.id}
//                                                                 value={spct.idKichCo.id}
//                                                                 className='my-1'
//                                                                 style={{ marginRight: 8 }}
//                                                             >
//                                                                 {spct.idKichCo.ten}
//                                                             </Radio.Button>
//                                                         ))}
//                                                 </Radio.Group>
//                                             </div>

//                                         </Card>
//                                     </Col>
//                                 );
//                             })
//                         ) : (
//                             <p>Chúng tôi không tìm thấy sản phẩm nào cho từ khóa: {key}</p>
//                         )}

//                     </Row>

//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default SearchResults;


//Bản tiếng anh 
import { useLocation, useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Carousel, Radio, Select, Grid } from "antd";
import { findByMSAndKC, getAllByIdSP, findFilteredSearchProducts, findAllThuongHieu, findAllMauSac, findAllKichCo } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import FormatCurrency from "../../utilities/FormatCurrency.jsx";
import '../../client/product/product.css';
import { Box, Typography } from '@mui/material';
const { Option } = Select;
import '../search/Search.css';

const SearchResults = () => {

    const location = useLocation();
    const { product = [], setProduct } = location.state || {}; // Đảm bảo `product` có giá trị mặc định là mảng rỗng và kiểm tra `setProduct`
    const { key } = useParams(); // Lấy từ khóa tìm kiếm từ URL

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [thuongHieu, setThuongHieu] = useState([]);
    const [mauSac, setMauSac] = useState([]);
    const [kichCo, setKichCo] = useState([]);
    const [selectedMauSac, setSelectedMauSac] = useState('ALL');
    const [selectedThuongHieu, setSelectedThuongHieu] = useState('ALL');
    const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');
    const [selectedKichCo, setSelectedKichCo] = useState('ALL');
    const [sort, setSort] = useState('newest');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState({});

    // Gọi API để lấy sản phẩm đã lọc khi các giá trị thay đổi
    useEffect(() => {
        console.log('Fetching products with llllll:', { key, selectedMauSac, selectedThuongHieu, selectedKichCo, selectedPriceRange, sort });
        fetchFilteredProducts(); // Gọi hàm lọc sản phẩm khi component được mount
    }, [key, selectedMauSac, selectedThuongHieu, selectedPriceRange, selectedKichCo, sort]); // Thêm `key` vào dependency array nếu muốn gọi lại khi key thay đổi

    // Cập nhật hàm fetchFilteredProducts để hiển thị loading và xử lý lỗi
    const fetchFilteredProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await findFilteredSearchProducts(key, selectedMauSac, selectedThuongHieu, selectedKichCo, selectedPriceRange, sort);

            console.log('Fetched products dddddddddddddddddddddd:', response.data); // Kiểm tra dữ liệu trả về

            // Lọc sản phẩm dựa trên điều kiện
            const results = response.data.filter(item => {
                return item.listProductDetails && item.listProductDetails.length > 0; // Kiểm tra listSPCT không rỗng
            });

            setFilteredProducts(results); // Cập nhật danh sách sản phẩm đã lọc
            console.log('Fetched products mmmmmmmmmmm:', results);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Lỗi khi lấy sản phẩm. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
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
    }, [key]);

    const getAllData = () => {
        getAllThuongHieu();
        getAllMauSac();
        getAllKichCo();
    };
    const getAllThuongHieu = () => {
        findAllThuongHieu(key)
            .then((response) => {
                setThuongHieu(response.data);
                console.log('product', product);
            })
            .catch((error) => {
                console.error('Error fetching San Pham CT:', error);
            });
    };

    const getAllMauSac = () => {
        findAllMauSac(key)
            .then((response) => {
                setMauSac(response.data);
                console.log('product', product);
            })
            .catch((error) => {
                console.error('Error fetching San Pham CT:', error);
            });
    };

    const getAllKichCo = () => {
        findAllKichCo(key)
            .then((response) => {
                setKichCo(response.data);
                console.log('product', product);
            })
            .catch((error) => {
                console.error('Error fetching San Pham CT:', error);
            });
    };





    return (
        <div className="container mt-4">
            <Row gutter={[30, 30]}>
                {/* Cột bộ lọc */}
                <Col xs={24} sm={24} md={8}>
                    <Box mb={2}>
                        <Box display="flex" alignItems="center" className='my-3'>
                            <h5>Kết quả tìm kiếm cho từ khóa: {key}</h5>
                        </Box>
                        <Typography variant="h3" className='my-4'>
                            Bộ lọc
                        </Typography>
                        {/* Thương hiệu */}
                        <Box className='mt-4'>
                            <b className='my-3'>Thương hiệu</b>
                            <Radio.Group
                                value={selectedThuongHieu}
                                onChange={handleThuongHieu}
                                className='my-3'
                                buttonStyle="solid"
                                style={{ display: 'flex', flexDirection: 'column' }}
                            >
                                <Radio value={"ALL"} style={{ marginBottom: 8 }}>
                                    Tất cả
                                </Radio>
                                {thuongHieu.map(th => (
                                    <Radio key={th.id} value={th.id} style={{ marginBottom: 8 }}>
                                        {th.name}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </Box>
                        {/* Giá */}
                        <Box className='mt-4'>
                            <b className='my-3'>Giá</b>
                            <Radio.Group
                                value={selectedPriceRange}
                                onChange={handlePriceRangeChange}
                                className='my-3'
                                buttonStyle="solid"
                                style={{ display: 'flex', flexDirection: 'column' }}
                            >
                                <Radio value={"ALL"} style={{ marginBottom: 8 }}>
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
                        {/* Kích cỡ */}
                        <Box className='mt-4'>
                            <b className='my-3 '>Kích cỡ</b>
                            <Radio.Group
                                buttonStyle="solid"
                                value={selectedKichCo}
                                onChange={handleKichCo}
                                className='my-3'
                                style={{ display: 'flex' }}
                            >
                                <Radio.Button value="ALL">Tất cả</Radio.Button>
                                {kichCo.map(kc => (
                                    <Radio.Button key={kc.id} value={kc.id}>
                                        {kc.name}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Box>
                        {/* Màu sắc */}
                        <Box className='mt-4'>
                            <b className='my-3'>Màu sắc</b>
                            <Radio.Group
                                value={selectedMauSac}
                                onChange={handleMauSac}
                                className='my-3'
                                buttonStyle="solid"
                                style={{ display: 'flex', flexDirection: 'column' }}
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

                {/* Cột kết quả tìm kiếm */}
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
                    <Row gutter={[30, 30]}>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((ct, index) => {
                                const selectedProduct = selectedAttributes[ct.listProductDetails[0].id] || {};
                                const selectedColor = selectedProduct.selectedColor || null;
                                const selectedSize = selectedProduct.selectedSize || null;
                                const selectedSPCT = ct.listProductDetails.find(spct => spct.color.id === selectedColor && spct.size.id === selectedSize);

                                return (
                                    <Col xs={24} sm={12} md={8} lg={8} key={`${ct.id}-${index}`}> {/* Sử dụng ct.id kết hợp với index */}
                                        <Card hoverable style={{ width: '250px', height: '500px' }}>
                                            <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false}>
                                                {selectedSPCT && selectedSPCT.images && selectedSPCT.images.map((anh, imgIndex) => (
                                                    <div key={imgIndex} className="image-container">
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

                                            {/* Hiển thị tên sản phẩm, thương hiệu và chất liệu */}
                                            {selectedSPCT ? (
                                                <h5 className="mt-3">
                                                    {`${ct.name} , ${selectedSPCT.brand.name}  , ${selectedSPCT.collar.name} , ${selectedSPCT.sleeve.name}`}
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

                                        </Card>
                                    </Col>
                                );
                            })
                        ) : (
                            <p>Chúng tôi không tìm thấy sản phẩm nào cho từ khóa: {key}</p>
                        )}

                    </Row>

                </Col>
            </Row>
        </div>
    );
};

export default SearchResults;
