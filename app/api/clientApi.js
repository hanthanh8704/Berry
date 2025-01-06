import axiosApi, { axiosApiRealtime } from "./axios";

const clientApi = {
  getProductHome: (filter) => {
    const url = `/client/product-home`;
    return axiosApi.get(url, { params: filter });
  },

  getSellingProduct: (filter) => {
    const url = `/client/selling-product`;
    return axiosApi.get(url, { params: filter });
  },
  getAllProduct: (filter) => {
    const url = `/client/all/product`;
    return axiosApi.post(url, filter);
  },

  getSizes: (request) => {
    const url = `/client/product/size`;
    return axiosApi.get(url, { params: request });
  },
  getBrand: () => {
    const url = `/client/brand`;
    return axiosApi.get(url);
  },
  getCategory: () => {
    const url = `/client/category`;
    return axiosApi.get(url);
  },

  getMaterial: () => {
    const url = `/client/material`;
    return axiosApi.get(url);
  },

  getSize: () => {
    const url = `/client/size`;
    return axiosApi.get(url);
  },

  getColor: () => {
    const url = `/client/color`;
    return axiosApi.get(url);
  },

  getSole: () => {
    const url = `/client/sole`;
    return axiosApi.get(url);
  },

  getMinMaxPrice: () => {
    const url = `/client/min-max-price`;
    return axiosApi.get(url);
  },
  check: () => {
    const url = `/check-start`;
    return axiosApi.get(url);
  },  
  checkQuantiy: (id, quantity) => {
    const url = `/check-start/check-quantity`;
    return axiosApi.get(url, { params: { id: id, quantity: quantity } });
  },
  getColors: (request) => {
    const url = `/client/product/color`;
    return axiosApi.get(url, { params: request });
  },
  getById: (id) => {
    const url = `/client/product/${id}`;
    return axiosApi.get(url);
  },
  getCungLoai: (filter) => {
    const url = `/client/product/cung-loai`;
    return axiosApi.get(url, { params: filter });
  },
  getSizes: (request) => {
    const url = `/client/product/size`;
    return axiosApi.get(url, { params: request });
  },
  getBillOrder: (text) => {
    const url = `/app/get-order/${text}`;
    return axiosApi.get(url);
  },
  getProductDetailBill: (id) => {
    const url = `/app/get-product-detail-bill/${id}`;
    return axiosApiRealtime.get(url);
  },
  increaseQuantityBillDetail: (idBillDetail, idPrDetail) => {
    const url = `/app/increase-quantity-bill-detail?idBillDetail=${idBillDetail}&idPrDetail=${idPrDetail}`;
    return axiosApi.put(url);
  },
  decreaseQuantityBillDetail: (idBillDetail, idPrDetail) => {
    const url = `/app/decrease-quantity-bill-detail?idBillDetail=${idBillDetail}&idPrDetail=${idPrDetail}`;
    return axiosApi.put(url);
  },
  rollBackQuantityProductDetail: (idBill, idPrDetail) => {
    const url = `/app/roll-back-quantity-product-detail?idBill=${idBill}&idPrDetail=${idPrDetail}`;
    return axiosApi.put(url);
  },
  inputQuantityBillDetail: (idBillDetail, idPrDetail, quantity) => {
    const url = `/app/input-quantity-bill-detail?idBillDetail=${idBillDetail}&idPrDetail=${idPrDetail}&quantity=${quantity}`;
    return axiosApi.put(url);
  },
  addBillDetail: (billDetail, id) => {
    const urlGetAll = `/app/add-product-sell/${id}`;
    return axiosApi.post(urlGetAll, billDetail);
  },
};
export default clientApi;
