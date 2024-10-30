
import axios from "axios"

const RESST_API_BASE_URL = 'http://localhost:8080/api/dot-giam-gia';

export const listDotGiamGia = () => axios.get(`${RESST_API_BASE_URL}/index`);

export const create = (DotGiamGia) => axios.post(`${RESST_API_BASE_URL}/add`, DotGiamGia);

export const getDotGiamGiaDetailByIdDGG = (idDGG) => {
    return axios.get(`${RESST_API_BASE_URL}/detail/${idDGG}`);
}

export const detailDotGiamGia = (idDGG) => {
    return axios.get(`${RESST_API_BASE_URL}/${idDGG}`);
}

export const updateDotGiamGia = (id, dotGiamGia) => {
    return axios.put(`${RESST_API_BASE_URL}/update/${id}`, dotGiamGia);
}

export const deletedDotGiamGia = (idDGG) => {
    return axios.delete(`${RESST_API_BASE_URL}/deleted/${idDGG}`);
}

//THuong hieu 
const RESST_API_BASE_URL_TH = 'http://localhost:8080/api/brand';
export const findAllThuongHieu = () => axios.get(`${RESST_API_BASE_URL_TH}/index`);

//Chat lieu
const RESST_API_BASE_URL_CL = 'http://localhost:8080/api/material';
export const findAllChatLieu = () => axios.get(`${RESST_API_BASE_URL_CL}/index`);

//Mau sac
const RESST_API_BASE_URL_MS = 'http://localhost:8080/api/color';
export const findAllMauSac = () => axios.get(`${RESST_API_BASE_URL_MS}/index`);

//Kich co
const RESST_API_BASE_URL_KC = 'http://localhost:8080/api/size';
export const findAllKichCo = () => axios.get(`${RESST_API_BASE_URL_KC}/index`);

//Chi tiet san pham đ SPCT
const REST_API_BASE_URL_SPCT = 'http://localhost:8080/api/shirt-detail';

export const listSanPhamCT = () => axios.get(`${REST_API_BASE_URL_SPCT}/index`);


export const DGGDetailByIdSPCT = (idSPCT) => axios.get(`${REST_API_BASE_URL_SPCT}/${idSPCT}`);

export const getAllByIdSP = (idSP) => axios.get(`${REST_API_BASE_URL_SPCT}/spct/${idSP}`);

export const findByIdSPCT = (idSPCT) => axios.get(`${REST_API_BASE_URL_SPCT}/get-one/${idSPCT}`);

//sSan pham 
const RESST_API_BASE_URL_SP = "http://localhost:8080/api/shirt";  // Đảm bảo đúng URL

export const listSanPham = () => axios.get(`${RESST_API_BASE_URL_SP}/index`);

// export const findAllSPById = (idSP) => {
//     if (!idSP) {
//         throw new Error('ID không hợp lệ');
//     }
//     return axios.get(`${RESST_API_BASE_URL_SP}/sp/${idSP}`);
// };

export const findAllByIdSanPham = (id) => {
    return axios.get(`${RESST_API_BASE_URL_SP}/detailDGG/${id}`);
}

export const findAllByIdSanPhamAndDGG = (id) => {
    return axios.get(`${RESST_API_BASE_URL_SP}/detailDGG/${id}`);
}

    //Danh muc
    const RESST_API_BASE_URL_DM = 'http://localhost:8080/api/category';

    export const getAllDanhMuc = () => axios.get(`${RESST_API_BASE_URL_DM}/index`);

    export const finBySanPhamIdDM = (id) => {
        return axios.get(`${RESST_API_BASE_URL_DM}/detail/${id}`);
    }


// Day la trar hàng con mẹ nó 
const REST_API_BASE_URL_TRAHANG = 'http://localhost:8080/api/tra-hang';

// Tìm kiếm (giả sử có endpoint search không cần tham số)
export const search = (maHD) => axios.get(`${REST_API_BASE_URL_TRAHANG}/hoa-don/search`, {
    params: { maHD }
});

export const findAllSPCTTra = (id) => {
    return axios.get(`${REST_API_BASE_URL_TRAHANG}/spct-tra`, {
        params: { id }
    });
};

// Tìm tất cả SPCT theo idHoaDon
export const findAllSPCTByIdHd = (idHD) => axios.get(`${REST_API_BASE_URL_TRAHANG}/spct/${idHD}`);

export const findHDByIdHd = (idHD) => axios.get(`${REST_API_BASE_URL_TRAHANG}/hoa-don/${idHD}`);

export const createTH = (traHangRequest) => axios.post(`${REST_API_BASE_URL_TRAHANG}/create`, traHangRequest);







//Tôngr của client 

const REST_API_BASE_URL_CLIENT = 'http://localhost:8080/api/client';

export const detailSPCT = (idSP) => axios.get(`${REST_API_BASE_URL_CLIENT}/product/${idSP}`);

export const findByMSAndKC = (idSP, idMau, idSize) => {
    return axios.get(`${REST_API_BASE_URL_CLIENT}/pro`, {
        params: { idMau, idSize, idSP }
    });
};

export const getSPBanChay = () => axios.get(`${REST_API_BASE_URL_CLIENT}/sp/ban-chay`);

export const getNewProducts = () => axios.get(`${REST_API_BASE_URL_CLIENT}/sp/new`);

export const getAllProductsByIdDM = (idDM) => axios.get(`${REST_API_BASE_URL_CLIENT}/products/${idDM}`);

//Loc tat ca client 
export const getSearchProductsKCTHMS = (idMS, idDM, idTH, idKC, priceRange, sort) => {
    return axios.get(`${REST_API_BASE_URL_CLIENT}/search/products/${idDM}`, {
        params: {
            idMS: idMS === 'ALL' ? null : idMS,
            idTH: idTH === 'ALL' ? null : idTH,
            idKC: idKC === 'ALL' ? null : idKC,
            priceRange: priceRange === 'ALL' ? null : priceRange,
            sort: sort
        }
    });
};

//Phần sản phẩm của tìm kiếm 
export const findFilteredSearchProducts = (key, idMS, idTH, idKC, priceRange, sort) => {
    return axios.get(`${REST_API_BASE_URL_CLIENT}/findFilteredSearchProducts`, {
        params: {
            key: key || '',
            idMS: idMS === 'ALL' ? null : idMS,
            idTH: idTH === 'ALL' ? null : idTH,
            idKC: idKC === 'ALL' ? null : idKC,
            priceRange: priceRange === 'ALL' ? null : priceRange,
            sort: sort
        }
    });
};


export const searchSP = (key) => {
    return axios.get(`${REST_API_BASE_URL_CLIENT}/searchSP`, {
        params: {
            key: key || '',   // Nếu tenSP null, đặt giá trị mặc định là chuỗi rỗng
        }
    });
};

//phần lưu thay đổi thông tin của khách hàng 
export const updateKH = (idKH, khacHang) => {
    return axios.put(`${REST_API_BASE_URL_CLIENT}/update/${idKH}`, khacHang);
}

// Giỏ hàng
const REST_API_BASE_URL_GIOHANG = 'http://localhost:8080/api/gio-hang';

// Lấy tất cả giỏ hàng
export const getAllGioHang = (idKH) => axios.get(`${REST_API_BASE_URL_GIOHANG}/index`, {
    params: {
        idKH: idKH
    }
});

// Thêm giỏ hàng mới
export const createGioHang = (giohang) => axios.post(`${REST_API_BASE_URL_GIOHANG}/create`, giohang);
// Tạo giỏ hàng ảo 
export const muaHang = (gioHangAo) => axios.post(`${REST_API_BASE_URL_GIOHANG}/mua-hang`, gioHangAo);
//Thanh toán
export const thanhToan = (hoaDon) => axios.post(`${REST_API_BASE_URL_GIOHANG}/thanh-toan`, hoaDon);
// Xóa giỏ hàng
export const deleteGH = (idGH) => axios.delete(`${REST_API_BASE_URL_GIOHANG}/delete/${idGH}`);

export const detailKH = (idKH) => axios.get(`${REST_API_BASE_URL_GIOHANG}/detail/${idKH}`);

export const selectedDC = (idDC) => axios.get(`${REST_API_BASE_URL_GIOHANG}/selected/${idDC}`);

export const getAllByPublic = () => axios.get(`${REST_API_BASE_URL_GIOHANG}/phieu-giam-gia/index`);

export const detailVoucher = (idP) => axios.get(`${REST_API_BASE_URL_GIOHANG}/phieu-giam-gia/detail/${idP}`);

export const getAllByCaNhan = (idKH) => {
    return axios.get(`${REST_API_BASE_URL_GIOHANG}/phieu-giam-gia/primary`, {
        params: { idKH: idKH }
    });
};

export const selectedPhieuGiamGia = (idP) => axios.get(`${REST_API_BASE_URL_GIOHANG}/selected-voucher/${idP}`);

export const updateDiaChi = (idDC) => {
    return axios.put(`${REST_API_BASE_URL_GIOHANG}/update-dia-chi/${idDC}`);
};

export const createDiaChi = (diaChi) => axios.post(`${REST_API_BASE_URL_GIOHANG}/createDC`, diaChi);


export const updateSoLuong = (idGioHangCT, quantity) => {
    return axios.put(`${REST_API_BASE_URL_GIOHANG}/update-quantity/${idGioHangCT}`, {
        quantity: quantity
    });
};

export const getAllDonMuaByIdKh = (idKH) => {
    return axios.get(`${REST_API_BASE_URL_GIOHANG}/orders/${idKH}`);
};

const REST_API_BASE_URL_TRACUU = 'http://localhost:8080/api/tra-cuu';

export const detailHoaDon = (maHD) => {
    return axios.get(`${REST_API_BASE_URL_TRACUU}/detail/${maHD}`);
};

export const findByMaAndSDT = (code, recipientPhone) => {
    return axios.get(`${REST_API_BASE_URL_TRACUU}/hoa-don`, {
        params: { code: code, recipientPhone: recipientPhone }  // Chuyển cả ma và sdt vào params
    });
};

