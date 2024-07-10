
import { DoDisturbOn } from "@mui/icons-material";
import axios from "axios"

const RESST_API_BASE_URL = 'http://localhost:8080/api/dot-giam-gia';

export const listDotGiamGia = () => axios.get(`${RESST_API_BASE_URL}/index`);

export const create = (DotGiamGia) => axios.post(`${RESST_API_BASE_URL}/add`, DotGiamGia);

export const getDotGiamGiaById = (id) => {
    return axios.get(`${RESST_API_BASE_URL}/detail/${id}`);
}

export const detailDotGiamGia = (idDGG) => {
    return axios.get(`${RESST_API_BASE_URL}/${idDGG}`);
}

export const updateDotGiamGia = (id,dotGiamGia) => {
    return axios.put(`${RESST_API_BASE_URL}/update/${id}` , dotGiamGia);
}

export const deleteDotGiamGia = (id) => {
    return axios.delete(`${RESST_API_BASE_URL}/delete/${id}`);
}

//Chi tiet san pham đ SPCT

const RESST_API_BASE_URL_SPCT = 'http://localhost:8080/api/chi-tiet-san-pham';

export const listSanPhamCT = () => axios.get(`${RESST_API_BASE_URL_SPCT}/index`);

//sSan pham 

const RESST_API_BASE_URL_SP = 'http://localhost:8080/api/san-pham';

export const listSanPham = () => axios.get(`${RESST_API_BASE_URL_SP}/index`);

export const findAllByIdSanPham = (id) => {
    return axios.get(`${RESST_API_BASE_URL_SP}/detail/${id}`);
}