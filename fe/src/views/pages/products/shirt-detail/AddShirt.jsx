import React, { useState } from 'react';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import { Modal, Button, Form } from 'react-bootstrap'; // Import components from React Bootstrap

function AddShirt() {
    const [productName, setProductName] = useState('KAPPA GIÀY SNEAKERS 123');
    const [description, setDescription] = useState('Giày Sneakers thời trang');
    const [brand, setBrand] = useState('KAPPA');
    const [status, setStatus] = useState('Kinh Doanh');
    const [material, setMaterial] = useState('Da');
    const [sole, setSole] = useState('Cao su');
    const [gender, setGender] = useState('Nam');
    const [category, setCategory] = useState('Giày Sneakers');

    const [sizes, setSizes] = useState(['39', '40', '41']);
    const [colors, setColors] = useState(['Đen', 'Trắng', 'Đỏ']);
    const [products, setProducts] = useState([
        { size: '39', color: 'Đen', quantity: 10, price: 1000000, image: '' },
        { size: '40', color: 'Trắng', quantity: 15, price: 1000000, image: '' }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [newAttribute, setNewAttribute] = useState('');

    const handleShowModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewAttribute('');
    };

    const handleAddAttribute = () => {
        if (modalType === 'brand') {
            // Logic to add new brand
            // Example: setBrands([...brands, newAttribute]);
        } else if (modalType === 'material') {
            // Logic to add new material
            // Example: setMaterials([...materials, newAttribute]);
        }
        handleCloseModal();
    };

    const handleProductNameChange = (e) => {
        setProductName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleBrandChange = (e) => {
        setBrand(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleMaterialChange = (e) => {
        setMaterial(e.target.value);
    };

    const handleSoleChange = (e) => {
        setSole(e.target.value);
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleAddSize = () => {
        const newSize = prompt('Enter new size:');
        if (newSize && !sizes.includes(newSize)) {
            setSizes([...sizes, newSize]);
        }
    };

    const handleRemoveSize = (sizeToRemove) => {
        setSizes(sizes.filter(size => size !== sizeToRemove));
    };

    const handleAddColor = () => {
        const newColor = prompt('Enter new color:');
        if (newColor && !colors.includes(newColor)) {
            setColors([...colors, newColor]);
        }
    };

    const handleRemoveColor = (colorToRemove) => {
        setColors(colors.filter(color => color !== colorToRemove));
    };

    const handleAddProduct = () => {
        setProducts([...products, { size: '', color: '', quantity: 1, price: 1000000, image: '' }]);
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = products.map((product, i) => {
            if (i === index) {
                return { ...product, [field]: value };
            }
            return product;
        });
        setProducts(updatedProducts);
    };

    const handleRemoveProduct = (index) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({
            productName,
            description,
            brand,
            status,
            material,
            sole,
            gender,
            category,
            sizes,
            colors,
            products,
        });
    };

    return (
        <div className="container">
            <div className="bg-white p-4 mt-3">
                <h1 style={{ textAlign: 'center' }}>THÊM SẢN PHẨM</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mt-3">
                        <label htmlFor="productName" className='fw-bold'>* Tên sản phẩm:</label>
                        <input
                            type="text"
                            id="productName"
                            className="form-control"
                            value={productName}
                            onChange={handleProductNameChange}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="description" className='fw-bold'>* Mô tả:</label>
                        <textarea
                            id="description"
                            className="form-control"
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="brand" className='fw-bold'>* Thương hiệu:</label>
                                <div className="input-group">
                                    <select
                                        id="brand"
                                        className="form-control"
                                        value={brand}
                                        onChange={handleBrandChange}
                                    >
                                        <option value="">Chọn thương hiệu</option>
                                        {/* Add more options here */}
                                    </select>
                                    <div className="input-group-append">
                                        <Button className="btn btn-outline-secondary" onClick={() => handleShowModal('brand')}>+</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="status" className='fw-bold'>* Tay áo:</label>
                                <select
                                    id="status"
                                    className="form-control"
                                    value={status}
                                    onChange={handleStatusChange}
                                >
                                    <option value="Kinh Doanh">Kinh Doanh</option>
                                    {/* Add more options here */}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6 mt-3">
                            <div className="form-group">
                                <label htmlFor="material" className='fw-bold'>* Chất Liệu:</label>
                                <div className="input-group">
                                    <select
                                        id="material"
                                        className="form-control"
                                        value={material}
                                        onChange={handleMaterialChange}
                                    >
                                        <option value="">Chọn chất liệu</option>
                                        {/* Add more options here */}
                                    </select>
                                    <div className="input-group-append">
                                        <Button className="btn btn-outline-secondary" onClick={() => handleShowModal('material')}>+</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mt-3">
                            <div className="form-group">
                                <label htmlFor="sole" className='fw-bold'>* Đế Giày:</label>
                                <div className="input-group">
                                    <select
                                        id="sole"
                                        className="form-control"
                                        value={sole}
                                        onChange={handleSoleChange}
                                    >
                                        <option value="">Chọn đế giày</option>
                                        {/* Add more options here */}
                                    </select>
                                    <div className="input-group-append">
                                        <Button className="btn btn-outline-secondary" onClick={() => handleShowModal('sole')}>+</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mt-3">
                            <div className="form-group">
                                <label htmlFor="gender" className='fw-bold'>* Cổ áo:</label>
                                <div className="input-group">
                                    <select
                                        id="gender"
                                        className="form-control"
                                        value={gender}
                                        onChange={handleGenderChange}
                                    >
                                        <option value="">Chọn cổ áo</option>
                                        {/* Add more options here */}
                                    </select>
                                    <div className="input-group-append">
                                        <Button className="btn btn-outline-secondary" onClick={() => handleShowModal('gender')}>+</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mt-3">
                            <div className="form-group">
                                <label htmlFor="category" className='fw-bold'>* Thể loại:</label>
                                <div className="input-group">
                                    <select
                                        id="category"
                                        className="form-control"
                                        value={category}
                                        onChange={handleCategoryChange}
                                    >
                                        <option value="">Chọn thể loại</option>
                                        {/* Add more options here */}
                                    </select>
                                    <div className="input-group-append">
                                        <Button className="btn btn-outline-secondary" onClick={() => handleShowModal('category')}>+</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="sizes" className='fw-bold'>Kích Cỡ:</label>
                                <div className="d-flex flex-wrap">
                                    {sizes.map((size, index) => (
                                        <div key={index} className="btn btn-light border mr-2 mb-2">
                                            {size} <Button variant="link" className="text-danger p-0 ml-1" onClick={() => handleRemoveSize(size)}>x</Button>
                                        </div>
                                    ))}
                                    <Button className="btn btn-primary ml-2" onClick={handleAddSize}>+</Button>
                                </div>
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="colors" className='fw-bold'>Màu Sắc:</label>
                                <div className="d-flex flex-wrap">
                                    {colors.map((color, index) => (
                                        <div key={index} className="btn btn-light border mr-2 mb-2">
                                            {color} <Button variant="link" className="text-danger p-0 ml-1" onClick={() => handleRemoveColor(color)}>x</Button>
                                        </div>
                                    ))}
                                    <Button className="btn btn-primary ml-2" onClick={handleAddColor}>+</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h1 className="mt-5 mb-3" style={{ textAlign: 'center' }}>Chi tiết sản phẩm</h1>
                    <div className="table-responsive">
                        <table className="table table-bordered mt-3">
                            <thead className="thead-dark">
                                <tr>
                                    <th>STT</th>
                                    <th>Tên Sản Phẩm</th>
                                    <th>Kích Cỡ</th>
                                    <th>Màu Sắc</th>
                                    <th>Số Lượng</th>
                                    <th>Giá Bán</th>
                                    <th>Upload Ảnh</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{productName}</td>
                                        <td>
                                            <select
                                                className="form-control"
                                                value={product.size}
                                                onChange={(e) => handleProductChange(index, 'size', e.target.value)}
                                            >
                                                <option value="">Chọn kích cỡ</option>
                                                {sizes.map((size, i) => (
                                                    <option key={i} value={size}>{size}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                className="form-control"
                                                value={product.color}
                                                onChange={(e) => handleProductChange(index, 'color', e.target.value)}
                                            >
                                                <option value="">Chọn màu sắc</option>
                                                {colors.map((color, i) => (
                                                    <option key={i} value={color}>{color}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={product.quantity}
                                                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={product.price}
                                                onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <Button variant="outline-secondary">Upload</Button>
                                        </td>
                                        <td>
                                            <Button variant="danger" onClick={() => handleRemoveProduct(index)}>Xóa</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center mt-3">
                        <Button className="btn btn-primary" onClick={handleAddProduct}>Thêm sản phẩm</Button>
                        <button type="submit" className="btn btn-success mt-3">
                            Lưu
                        </button>
                    </div>
                </form>
                <ToastContainer />
            </div>

            {/* Modal for adding attributes */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm {modalType}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewAttribute">
                            <Form.Label>Tên {modalType}</Form.Label>
                            <Form.Control
                                type="text"
                                value={newAttribute}
                                onChange={(e) => setNewAttribute(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddAttribute}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AddShirt;
