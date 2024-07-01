import axios from "axios"
const RESST_API_BASE_URL = 'http://localhost:8080/api/chi-tiet-san-pham';

export const listSanPhamCT = () => axios.get(`${RESST_API_BASE_URL}/index`);

export const findAllByIdSanPham = (id) => {
    return axios.get(`${RESST_API_BASE_URL}/detail/${id}`);
}