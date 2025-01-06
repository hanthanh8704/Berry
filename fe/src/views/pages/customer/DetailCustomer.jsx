import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Modal, Form, Radio, Switch, Button, notification } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as request from 'views/utilities/httpRequest';
import AddressCustomerDetail from 'components/Customer/AddressCustomerDetail';

const DetailCustomer = (idCustomer) => {
  // Lấy tham số ID từ URL
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Khai báo các state
  const [image, setImage] = useState(null); // Lưu trữ hình ảnh khách hàng
  const [customer, setCustomer] = useState({}); // Lưu trữ thông tin khách hàng
  const [previewUrl, setPreviewUrl] = useState(null); // Lưu trữ URL preview ảnh
  const [status, setStatus] = useState(true); // Lưu trạng thái hoạt động của khách hàng


  // const customerData = {idCustomer: idCustomer};
  const customerId = idCustomer.idCustomer ? idCustomer.idCustomer : id;
  // Hàm useEffect được gọi khi component lần đầu tiên render hoặc khi id thay đổi
  useEffect(() => {
    loadCustomer(customerId);
  }, [id, idCustomer.idCustomer]);

  // Hàm tải thông tin chi tiết của khách hàng từ API
  const loadCustomer = () => {
    console.log(`Loading customer with ID: ${customerId}`); // Log ID khách hàng
    console.log(`Loading customer with ID: ${id}`); // Log ID khách hàng
    console.log(`Loading customer with ID: ${idCustomer.idCustomer}`); // Log ID khách hàng
    request
      .get(`/customer/${customerId}`) // Gọi API để lấy thông tin khách hàng dựa trên ID
      .then((response) => {
        console.log('Full response:', customerId); // Hiển thị toàn bộ phản hồi

        // Kiểm tra cấu trúc dữ liệu và lấy thông tin khách hàng
        if (response) {
          setCustomer(response); // Cập nhật state customer
          form.setFieldsValue({
            fullName: response.fullName,
            dateOfBirth: response.dateOfBirth,
            gender: response.gender || '',
            email: response.email,
            phoneNumber: response.phoneNumber,
            status: response.status // Cập nhật trạng thái
          });
          if (response.image) {
            setPreviewUrl(response.image); // Cập nhật URL preview nếu có ảnh
          }
        } else {
          console.error('No customer data found in response.'); // Log nếu không có dữ liệu
          // toast.warning('Không tìm thấy thông tin khách hàng.'); // Thông báo cảnh báo
        }
      })
      .catch((error) => {
        console.error('Error loading customer data:', error.response || error.message || error); // Log thông tin lỗi
        console.log('Full response:', customerId);
        console.log('ninh response12:', idCustomer.idCustomer);
        // toast.error('Không thể tải thông tin khách hàng'); // Thông báo lỗi
      });
  };

  // Hàm xử lý khi chọn ảnh từ input
  const handleImageSelect = (event) => {
    const file = event.target.files[0]; // Lấy tệp tin từ input
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Tạo URL để preview ảnh
      console.log('Selected image:', file, 'Preview URL:', imageUrl); // Hiển thị thông tin ảnh được chọn
      setPreviewUrl(imageUrl); // Cập nhật URL preview
      setImage(file); // Lưu ảnh vào state
    } else {
      setPreviewUrl(null); // Xóa URL preview nếu không có ảnh
      setImage(null); // Xóa ảnh khỏi state
    }
  };

  // Hàm cập nhật thông tin khách hàng
  const updateCustomer = (data) => {
    console.log('Form data before sending:', data); // Hiển thị dữ liệu form trước khi gửi
    const formData = new FormData(); // Tạo form data để gửi dữ liệu
    if (image) {
      formData.append('image', image); // Thêm ảnh vào form data nếu có
      console.log('image', data.image);
    }
    formData.append('fullName', data.fullName);
    console.log('fullName', data.fullName);
    formData.append('gender', data.gender);
    console.log('gender', data.gender);
    formData.append('email', data.email);
    console.log('gender', data.gender);
    formData.append('dateOfBirth', data.dateOfBirth);
    console.log('dateOfBirth', data.dateOfBirth);
    formData.append('phoneNumber', data.phoneNumber);
    console.log('phoneNumber', data.phoneNumber);
    formData.append('status', data.status === 'Đang hoạt động' ? 'Đang hoạt động' : 'Ngừng hoạt động');
    console.log('status', data.status);
    // Hiển thị modal xác nhận trước khi cập nhật
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Xác nhận cập nhật khách hàng?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        console.log('Updating customer with data:', formData); // Hiển thị dữ liệu form data trước khi gọi API
        request
          .put(`/customer/${customerId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          .then((response) => {
            console.log('Update response:', response); // Hiển thị phản hồi từ API
            if (response.data.success) {
              notification.success({
                message: 'Cập nhật thành công!',
                duration: 2,
              });
              navigate('/customer'); // Chuyển hướng sau khi cập nhật
            }
          })
          .catch((error) => {
            console.error('Update failed:', error); // Hiển thị lỗi nếu cập nhật thất bại
            notification.error({
              message: 'Cập nhật thất bại !',
              duration: 2,
            });
          });
      }
    });
  };

  // Hàm xử lý khi submit form
  const onFinish = (values) => {
    console.log('Form values on submit:', values); // Hiển thị dữ liệu khi form được submit
    updateCustomer(values); // Gọi hàm updateCustomer để cập nhật
  };

  return (
    <div className="container">
      <div className="row">
        {/* Chi tiết khách hàng */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm p-4 mb-4">
            <h3 className="card-title mb-4">Chi tiết khách hàng</h3>
            <Form form={form} onFinish={onFinish}>
              <div className="row">
                <div className="col-12 text-center">
                  {/* Hiển thị ảnh preview */}
                  {previewUrl !== null ? (
                    <div className="text-center position-relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ width: '162px', height: '162px' }}
                        className="mt-2 border border-warning shadow-lg bg-body-tertiary rounded-circle object-fit-contain"
                      />
                      <Button
                        className="position-absolute border-0"
                        onClick={() => {
                          setPreviewUrl(null);
                          setImage(null);
                        }}
                      >
                        Xóa ảnh
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        className="position-relative rounded-circle border border-warning mt-2 d-flex align-items-center justify-content-center"
                        style={{ width: '162px', height: '162px' }}
                      >
                        <Input type="file" accept="image/*" onChange={handleImageSelect} className="position-absolute opacity-0 py-5" />
                        <div className="text-center text-secondary">
                          <img
                            src={customer.anh}
                            alt="Preview"
                            style={{ width: '162px', height: '162px' }}
                            className="border border-warning shadow-lg bg-body-tertiary rounded-circle object-fit-contain"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Các trường form */}
                <div className="col-12">
                  <Form.Item
                    label="Tên khách hàng"
                    name="fullName"
                    rules={[
                      { required: true, message: 'Tên không được để trống!' },
                      {
                        pattern: /^[^\d!@#$%^&*()_+={}\\:;"'<>,.?/`~|-]+$/,
                        message: 'Tên phải là chữ'
                      }
                    ]}
                  >
                    <Input placeholder="Nhập tên khách hàng..." />
                  </Form.Item>
                </div>

                <div className="col-12 col-md-6">
                  <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Giới tính không được để trống!' }]}>
                    <Radio.Group>
                      <Radio value="Nam">Nam</Radio>
                      <Radio value="Nữ">Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>

                <div className="col-12">
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Email không được để trống!' },
                      { type: 'email', message: 'Email không đúng định dạng!' }
                    ]}
                  >
                    <Input placeholder="Nhập email ..." />
                  </Form.Item>
                </div>

                <div className="col-12">
                  <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: 'Số điện thoại không được để trống!'
                      },
                      {
                        pattern: /^0[0-9]{9}$/,
                        message: 'Số điện thoại không đúng định dạng!'
                      }
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại ..." />
                  </Form.Item>
                </div>

                <div className="col-12">
                  <Form.Item label="Ngày sinh" name="dateOfBirth" 
                    rules={[
                      { required: true, message: 'Ngày sinh không được để trống!' },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          const birthDate = new Date(value);
                          const today = new Date();
                          const age = today.getFullYear() - birthDate.getFullYear();
                          const monthDiff = today.getMonth() - birthDate.getMonth();
                          const dayDiff = today.getDate() - birthDate.getDate();
                          if (age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Khách hàng phải đủ 18 tuổi.'));
                        },
                      },
                    ]}
                  >
                    <Input type="date" />
                  </Form.Item>
                </div>

                <div className="col-12 d-flex align-items-center">
                  <Form.Item name="status" label="Trạng thái">
                    <Radio.Group
                      onChange={(e) => setStatus(e.target.value)} // Cập nhật giá trị theo lựa chọn
                      value={status} // Giá trị hiện tại của status
                    >
                      <Radio value="Đang hoạt động">Đang hoạt động</Radio>
                      <Radio value="Ngừng hoạt động">Ngừng hoạt động</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>

                {/* Nút cập nhật */}
                <div className="col-12 d-flex justify-content-center">
                  <Button type="primary" htmlType="submit">
                    Cập nhật
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>

        {/* Thông tin địa chỉ */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm p-4 mb-4">
            <div className="row">
              <div className="col-12">
                <h6>Thông tin địa chỉ</h6>
                <hr />
              </div>
              <div className="col-12">
                <AddressCustomerDetail idCustomer={idCustomer.idCustomer} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DetailCustomer;
