import { Button, Collapse, Empty, Input, InputNumber, Modal, Upload, message, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ImageModal from "./ImageModal";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { IconTrashFilled } from "@tabler/icons-react";

function TableProduct({ props, handleChange }) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const [groupByColor, setGroupByColor] = useState([]);

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    // const handleChangeWeight = (value, colorName, index) => {
    //     const updatedItems = [...groupByColor[colorName]];
    //     updatedItems[index] = { ...updatedItems[index], weight: value };
    //     setGroupByColor({
    //         ...groupByColor,
    //         [colorName]: updatedItems,
    //     });
    //     handleChange(
    //         Object.values({
    //             ...groupByColor,
    //             [colorName]: [...updatedItems],
    //         }).flat()
    //     );
    // };

    const handleChangeWeight = (value, colorName, index) => {
        if (value === null || value === undefined || value === "") {
            toast.error("Giá bán không được để trống!");
            return;
        }
        const updatedItems = [...groupByColor[colorName]];
        updatedItems[index] = { ...updatedItems[index], weight: value };
        setGroupByColor({
            ...groupByColor,
            [colorName]: updatedItems,
        });
        handleChange(
            Object.values({
                ...groupByColor,
                [colorName]: [...updatedItems],
            }).flat()
        );
    };

    const handleCheckAllChange = (e) => {
        const checked = e.target.checked;
        setCheckAll(checked);

        if (checked) {
            // Lọc tất cả các sản phẩm có cùng số lượng và đơn giá
            const selectedItems = [];
            Object.entries(groupByColor).forEach(([key, items]) => {
                const firstItem = items[0];
                items.forEach((item) => {
                    if (item.quantity === firstItem.quantity && item.price === firstItem.price) {
                        selectedItems.push(item.key);
                    }
                });
            });
            setSelectedRowKeys(selectedItems);
        } else {
            setSelectedRowKeys([]);
        }
    };

    const handleImageSelect = (colorName, index, files) => {
        const updatedItems = [...groupByColor[colorName]];
        for (let i = 0; i < updatedItems.length; i++) {
            updatedItems[i] = { ...updatedItems[i], images: files };
        }
        setGroupByColor({
            ...groupByColor,
            [colorName]: updatedItems,
        });
        handleChange(
            Object.values({
                ...groupByColor,
                [colorName]: [...updatedItems],
            }).flat()
        );
    };

    // const handleChangeQuantity = (value, colorName, index) => {
    //     const updatedItems = [...groupByColor[colorName]];
    //     updatedItems[index] = { ...updatedItems[index], quantity: value };
    //     setGroupByColor({
    //         ...groupByColor,
    //         [colorName]: updatedItems,
    //     });
    //     handleChange(
    //         Object.values({
    //             ...groupByColor,
    //             [colorName]: [...updatedItems],
    //         }).flat()
    //     );
    // };
    const handleChangeQuantity = (value, colorName, index) => {
        if (value === null || value === undefined || value === "") {
            toast.error("Số lượng không được để trống!");
            return;
        }
        const updatedItems = [...groupByColor[colorName]];
        updatedItems[index] = { ...updatedItems[index], quantity: value };
        setGroupByColor({
            ...groupByColor,
            [colorName]: updatedItems,
        });
        handleChange(
            Object.values({
                ...groupByColor,
                [colorName]: [...updatedItems],
            }).flat()
        );
    };

    // const handleChangePrice = (value, colorName, index) => {
    //     const updatedItems = [...groupByColor[colorName]];
    //     updatedItems[index] = { ...updatedItems[index], price: value };
    //     setGroupByColor({
    //         ...groupByColor,
    //         [colorName]: updatedItems,
    //     });
    //     handleChange(
    //         Object.values({
    //             ...groupByColor,
    //             [colorName]: [...updatedItems],
    //         }).flat()
    //     );
    // };
    const handleChangePrice = (value, colorName, index) => {
        if (value === null || value === undefined || value === "") {
            toast.error("Đơn giá không được để trống!");
            return;
        }
        const updatedItems = [...groupByColor[colorName]];
        updatedItems[index] = { ...updatedItems[index], price: value };
        setGroupByColor({
            ...groupByColor,
            [colorName]: updatedItems,
        });
        handleChange(
            Object.values({
                ...groupByColor,
                [colorName]: [...updatedItems],
            }).flat()
        );
    };

    const deleteProductDetail = (colorName, index) => {
        const items = groupByColor[colorName];
        items.splice(index, 1);

        setGroupByColor({
            ...groupByColor,
            [colorName]: [...items],
        });

        const allItems = Object.values({
            ...groupByColor,
            [colorName]: [...items],
        }).flat();
        handleChange(allItems);
        toast.success("Xóa thành công!");
    };

    useEffect(() => {
        const groupedProducts = {};
        props.forEach((option) => {
            const colorName = option.color.name;

            if (!groupedProducts[colorName]) {
                groupedProducts[colorName] = [];
            }

            groupedProducts[colorName].push(option);
        });
        setGroupByColor(groupedProducts);
    }, [props]);

    const validateInput = (value) => {
        if (/\s/.test(value)) {
            return false;
        }
        return true;
    };

    return (
        <>
            <Collapse defaultActiveKey={0} className="rounded-0 border-0">
                <Collapse.Panel key={0} header={"Danh sách các sản phẩm cùng loại"} className="border-bottom-0">
                    <div className="table-responsive">
                        <table className="table table-borderless text-nowrap center">
                            <thead>
                                <tr>
                                    <th>
                                        <Checkbox onChange={handleCheckAllChange} checked={checkAll} />
                                    </th>
                                    <th className="text-center">Sản phẩm</th>
                                    <th className="text-center">Số lượng</th>
                                    <th className="text-center">Đơn giá</th>
                                    <th className="text-center">Cân nặng</th>
                                    <th className="text-center">Danh mục</th>
                                    <th className="text-center">Thương hiệu</th>
                                    <th className="text-center">Chất liệu</th>
                                    <th className="text-center">Tay áo</th>
                                    <th className="text-center">Cổ áo</th>
                                    <th className="text-center">Hành Động</th>
                                    <th className="text-center">Ảnh</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {Object.entries(groupByColor).map(([key, items], index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td colSpan="12" className="bg-secondary-subtle text-center fw-bold">
                                                Các sản phẩm màu <span className="text-lowercase">{key}</span>
                                            </td>
                                        </tr>
                                        {items.map((option, idx) => (
                                            <tr key={idx}>
                                                {option.product && option.product !== undefined && option.product !== null ? (
                                                    <>
                                                        <td>
                                                            <Checkbox
                                                                checked={selectedRowKeys.includes(option.key)}
                                                                onChange={() => {
                                                                    const newSelectedRowKeys = [...selectedRowKeys];
                                                                    if (newSelectedRowKeys.includes(option.key)) {
                                                                        newSelectedRowKeys.splice(newSelectedRowKeys.indexOf(option.key), 1);
                                                                    } else {
                                                                        newSelectedRowKeys.push(option.key);
                                                                    }
                                                                    setSelectedRowKeys(newSelectedRowKeys);
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            {option.product.name} [{option.color.name} - {option.size.name}]
                                                        </td>
                                                        <td width="130px">
                                                            <InputNumber
                                                                defaultValue={option.quantity}
                                                                style={{ width: "100%" }}
                                                                step={1}
                                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                                                onChange={(value) => {
                                                                    if (!validateInput(value.toString())) {
                                                                        toast.error('Lỗi nhập liệu');
                                                                        return;
                                                                    }
                                                                    handleChangeQuantity(value, key, idx);
                                                                }}
                                                                controls={false}
                                                                min={1}
                                                            />
                                                        </td>
                                                        <td width="130px">
                                                            <InputNumber
                                                                defaultValue={option.price}
                                                                style={{ width: "100%" }}
                                                                step={10000}
                                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                                parser={(value) => value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : ""}
                                                                onChange={(value) => {
                                                                    if (!validateInput(value.toString())) {
                                                                        return;
                                                                    }
                                                                    handleChangePrice(value, key, idx);
                                                                }}
                                                                controls={false}
                                                                min={0}
                                                            />
                                                        </td>
                                                        <td width="130px">
                                                            <InputNumber
                                                                defaultValue={option.weight}
                                                                style={{ width: "100%" }}
                                                                step={0.0} // Có thể thay đổi step tùy theo yêu cầu
                                                                onChange={(value) => {
                                                                    if (!validateInput(value.toString())) {
                                                                        toast.error('Lỗi nhập liệu');
                                                                        return;
                                                                    }
                                                                    handleChangeWeight(value, key, idx); // Hàm thay đổi weight
                                                                }}
                                                                controls={false}
                                                                min={0}
                                                            />
                                                        </td>


                                                        <td className="text-center">{option.product.category}</td>
                                                        <td className="text-center">{option.brand.name}</td>
                                                        <td className="text-center">{option.material.name}</td>
                                                        <td className="text-center">{option.sleeve.name}</td>
                                                        <td className="text-center">{option.collar.name}</td>
                                                        <td className="text-center">
                                                            <button className="btn btn-sm" onClick={() => deleteProductDetail(key, idx)}>
                                                                <IconTrashFilled />
                                                            </button>
                                                        </td>
                                                        {idx === 0 && (
                                                            <td className="align-middle" rowSpan={items.length}>
                                                                <ImageModal sttModal={index} colorName={key} handleChange={handleImageSelect} />
                                                            </td>
                                                        )}
                                                    </>
                                                ) : ""}
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={11} className="text-center">
                                                {items.length > 0 && items[0].images !== undefined && items[0].images.length !== 0 ? (
                                                    items[0].images.map((image, stt) => (
                                                        <img
                                                            src={image}
                                                            width={100}
                                                            height={100}
                                                            alt=""
                                                            key={stt}
                                                            className="me-2 object-fit-cover"
                                                        />
                                                    ))
                                                ) : (
                                                    <Empty description={"Không có ảnh"} />
                                                )}
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Collapse.Panel>
            </Collapse>
            <ToastContainer />
        </>
    );
}

export default TableProduct;
