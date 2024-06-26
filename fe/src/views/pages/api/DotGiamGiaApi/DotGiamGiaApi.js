
import axios from "axios"

const RESST_API_BASE_URL = 'http://localhost:8080/api/dot-giam-gia';

export const listDotGiamGia = () => axios.get(`${RESST_API_BASE_URL}/index`);

export const create = (DotGiamGia) => axios.post(`${RESST_API_BASE_URL}/add`,DotGiamGia , {
    headers :{
        'Content-Type' : 'application/json',
    }
});

export const getDotGiamGiaById = (id) => {
    return axios.get(`${RESST_API_BASE_URL}/detail/${id}`);
}

export const updateDotGiamGia = (id,dotGiamGia) => {
    return axios.put(`${RESST_API_BASE_URL}/update/${id}` , dotGiamGia);
}

export const deleteDotGiamGia = (id) => {
    return axios.delete(`${RESST_API_BASE_URL}/delete/${id}`);
}

export const exportData = () => axios.get(`${RESST_API_BASE_URL}/export`);


export const searchDotGiamGia = (keyword, startDate, endDate) => {
    const params = new URLSearchParams();

    if (keyword) params.append('keyword', keyword);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const url = `${RESST_API_BASE_URL}/search?${params.toString()}`;

    return axios.get(url);
};
