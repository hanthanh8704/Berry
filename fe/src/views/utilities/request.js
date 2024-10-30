import axios from "axios";
import { toast } from "react-toastify";
import { store } from "app/store";
import {
  SetLoadingFalse,
  SetLoadingTrue,
} from "app/reducer/Loading.reducer.js";
// import { getTokenCustomer, getTokenEmpoloyee } from "./useCookies";

// Cấu hình AppConfig trực tiếp
const AppConfig = {
  apiUrl: "http://localhost:8080",
  routerBase: "",
};

const AppConfigAddress = {
  apiUrl: "",
  routerBase: "",
};

// Khởi tạo các request instance với baseURL từ cấu hình
export const request = axios.create({
  baseURL: AppConfig.apiUrl,
});

export const requestCustomer = axios.create({
  baseURL: AppConfig.apiUrl,
});

export const requestAdress = axios.create({
  baseURL: AppConfigAddress.apiUrl,
});

// Thiết lập các interceptor cho request
request.interceptors.request.use((config) => {
  store.dispatch(SetLoadingTrue());
  // const token = getTokenEmpoloyee();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

requestCustomer.interceptors.request.use((config) => {
  store.dispatch(SetLoadingTrue());
  // const token = getTokenCustomer();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Thiết lập các interceptor cho response
request.interceptors.response.use(
  (response) => {
    store.dispatch(SetLoadingFalse());
    return response;
  },
  (error) => {
    if (error.response != null && error.response.status === 400) {
      toast.error(error.response.data.message);
    }
    if (error.response && error.response.status === 404) {
      window.location.href = "/not-found";
      return;
    }
    store.dispatch(SetLoadingFalse());
    throw error;
  }
);

requestCustomer.interceptors.response.use(
  (response) => {
    store.dispatch(SetLoadingFalse());
    return response;
  },
  (error) => {
    if (error.response != null && error.response.status === 400) {
      toast.error(error.response.data.message);
    }
    if (error.response && error.response.status === 404) {
      window.location.href = "/not-found";
      return;
    }
    store.dispatch(SetLoadingFalse());
    throw error;
  }
);
