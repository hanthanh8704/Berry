
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

export const updateDotGiamGia = (id,dotGiamGia) => {
    return axios.put(`${RESST_API_BASE_URL}/update/${id}` , dotGiamGia);
}

export const deletedDotGiamGia = (idDGG) => {
    return axios.delete(`${RESST_API_BASE_URL}/deleted/${idDGG}`);
}

//THuong hieu 
const RESST_API_BASE_URL_TH = 'http://localhost:8080/api/brand';
export const findAllThuongHieu = () => axios.get(`${RESST_API_BASE_URL_TH}/thuong-hieu`);

//Chat lieu
const RESST_API_BASE_URL_CL = 'http://localhost:8080/api/material';
export const findAllChatLieu = () => axios.get(`${RESST_API_BASE_URL_CL}/chat-lieu`);

//Mau sac
const RESST_API_BASE_URL_MS = 'http://localhost:8080/api/color';
export const findAllMauSac = () => axios.get(`${RESST_API_BASE_URL_MS}/mau-sac`);

//Kich co
const RESST_API_BASE_URL_KC = 'http://localhost:8080/api/size';
export const findAllKichCo = () => axios.get(`${RESST_API_BASE_URL_KC}/kich-co`);

//Chi tiet san pham đ SPCT
const REST_API_BASE_URL_SPCT = 'http://localhost:8080/api/shirt-detail';

export const listSanPhamCT = () => axios.get(`${REST_API_BASE_URL_SPCT}/index`);

export const DGGDetailByIdSPCT = (idSPCT) => axios.get(`${REST_API_BASE_URL_SPCT}/${idSPCT}`);

//sSan pham 
const RESST_API_BASE_URL_SP = 'http://localhost:8080/api/shirt';

export const listSanPham = () => axios.get(`${RESST_API_BASE_URL_SP}/index`);

export const findAllByIdSanPham = (id) => {
    return axios.get(`${RESST_API_BASE_URL_SP}/detailDGG/${id}`);
}

export const findAllByIdSanPhamAndDGG = (id) => {
    return axios.get(`${RESST_API_BASE_URL_SP}/detailDGG/${id}`);
}