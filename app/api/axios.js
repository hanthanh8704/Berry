import axios from "axios";
import { url } from "../service/url";
import store from "../service/store";
import { setLoading } from "../service/slices/loadingSilce";

/*
-- Là một instance của Axios được cấu hình để làm việc với một API cơ bản (base URL: url + "/api") và thêm header mặc định là "Content-Type": "application/json".
 - Được tích hợp sẵn các interceptors:
Request Interceptor:
 - Trước khi gửi yêu cầu, ứng dụng sẽ kích hoạt setLoading(true) để báo hiệu rằng một quá trình tải đang diễn ra.
 - Response Interceptor:
 - Sau khi nhận được phản hồi từ API, ứng dụng sẽ dừng trạng thái tải
  (setLoading(false)) sau một khoảng thời gian trì hoãn là 400ms.
 - Interceptors này giúp điều chỉnh trạng thái loading trong ứng dụng
  một cách tự động mỗi khi thực hiện các yêu cầu HTTP.
*/

const axiosApi = axios.create({
  baseURL: url + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosApi.interceptors.request.use(
  (config) => {
    store.dispatch(setLoading(true));
    return config;
  },
  () => {}
);

axiosApi.interceptors.response.use(
  (response) => {
    setTimeout(() => {
      store.dispatch(setLoading(false));
    }, 400);
    return response;
  },
  (error) => {}
);

export default axiosApi;

/*

- Đây là một instance Axios khác được cấu hình tương tự như axiosApi,
 nhưng không sử dụng interceptors.
- Có thể được dùng cho các trường hợp cần yêu cầu HTTP mà không cần quản lý 
trạng thái loading, chẳng hạn như các yêu cầu thời gian thực.

*/

export const axiosApiRealtime = axios.create({
  baseURL: url + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
