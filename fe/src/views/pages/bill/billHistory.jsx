import { Button, Modal } from "antd";
import React, { useState } from "react";
import FormatDate from "views/utilities/FormatDate";
import { IconBrandOpenai, IconAB2 } from "@tabler/icons-react";

function BillHistory({ props }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Kiểm tra props trước khi sử dụng map
    if (!props || !Array.isArray(props) || props.length === 0) {
        return (
            <div>
                <Button type='primary' onClick={showModal} danger>
                    Chi tiết
                </Button>
                <Modal title="Lịch sử chi tiết" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer="" width={1000}>
                    <p>Không có dữ liệu để hiển thị</p>
                </Modal>
            </div>
        );
    }

    return (
        <>
            <Button type='primary' onClick={showModal} danger>
                Chi tiết
            </Button>
            <Modal title="Lịch sử chi tiết" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer="" width={1000}>
                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <table className="table align-middle table-borderless">
                        <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                            <tr>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Thời gian</th>
                                <th scope="col">Nhân viên xác nhận</th>
                                <th scope="col">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.map((item, index) => (
                                <tr key={index} className='border-bottom'>
                                    <td>
                                        <span style={{
                                            fontSize: "36px",
                                            color: item.trangThai === "Tạo đơn hàng" ? '#024FA0' :
                                                item.trangThai === "Xác nhận thanh toán" ? "#F2721E" :
                                                    item.trangThai === "Chờ giao" ? "#50B846" :
                                                        item.trangThai === "Chỉnh sửa đơn hàng" ? "#FFBC05" :
                                                            item.trangThai === "Hủy" ? "#9C281C" : '#2DC255'
                                        }}>
                                            {item.trangThai === "Tạo đơn hàng" && <IconAB2 />}
                                            {item.trangThai === "Chờ thanh toán" && <IconAB2 />}
                                            {item.trangThai === "Chờ xác nhận" && <IconAB2 />}
                                            {item.trangThai === "Xác nhận thanh toán" && <IconAB2 />}
                                            {item.trangThai === "Chờ giao" && <IconAB2 />}
                                            {item.trangThai === "Đang giao" && <IconAB2 />}
                                            {item.trangThai === "Hoàn thành" && <IconAB2 />}
                                            {(item.trangThai !== "Tạo đơn hàng" && item.trangThai !== "Chờ thanh toán"
                                                && item.trangThai !== "Chờ xác nhận" && item.trangThai !== "Xác nhận thanh toán"
                                                && item.trangThai !== "Chờ giao" && item.trangThai !== "Đang giao"
                                                && item.trangThai !== "Hoàn thành" && item.trangThai !== "Hủy") && <IconBrandOpenai name="robot" />}
                                        </span>
                                        <span className='fw-semibold'>
                                            {item.trangThai === "Tạo đơn hàng" ? "Tạo đơn hàng" :
                                                item.trangThai === "Chờ thanh toán" ? "Chờ thanh toán" :
                                                    item.trangThai === "Chờ xác nhận" ? "Chờ xác nhận" :
                                                        item.trangThai === "Xác nhận thanh toán" ? "Xác nhận thanh toán" :
                                                            item.trangThai === "Chờ giao" ? "Chờ giao" :
                                                                item.trangThai === "Đang giao" ? "Đang giao" :
                                                                    item.trangThai === "Hoàn thành" ? "Hoàn thành" :
                                                                        item.trangThai === "Hủy" ? "Hủy" : "Robot"}
                                        </span>
                                    </td>
                                    <td><FormatDate date={item.ngayTao} /></td>
                                    <td>{item.createBy}</td>
                                    <td>{item.ghiChu}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </>
    );
}

export default BillHistory;
