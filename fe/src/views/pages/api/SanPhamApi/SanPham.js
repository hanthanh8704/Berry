import axios from "axios"
const RESST_API_BASE_URL = 'http://localhost:8080/api/san-pham';

export const listSanPham = () => axios.get(`${RESST_API_BASE_URL}/index`);