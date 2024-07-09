// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Breadcrumb, Button, Col, Divider, Form, Input, Modal, Radio, Row, Select } from "antd";
// import { toast } from "react-toastify";
// import QrCode from "components/QrCode";
// // import * as request from "views/utilities/httpRequest";
// const { Option } = Select;

// const AddCustomer = () => {
  // const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [dataAddress, setDataAddress] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [avatar, setAvatar] = useState(null);
//   const [isQrModalVisible, setIsQrModalVisible] = useState(false);

//   const handleImageSelect = (event) => {
//     try {
//       const file = event.target.files[0];
//       const imageUrl = URL.createObjectURL(file);
//       setAvatar(file);
//       setPreviewUrl(imageUrl);
//     } catch (e) {
//       setPreviewUrl("");
//     }
//   };

//   const handleQrSuccess = (value) => {
//     const withoutName = value.substring(14);
//     const splits = withoutName.split("|");
//     const birthday = splits[1];
//     if (value.substring(0, 12).length === 12) {
//       toast.success(`Đã tìm thấy ${splits[0]}!`);
//       form.setFieldsValue({
//         gioiTinh: splits[2],
//         cccd: value.substring(0, 12),
//         ten: splits[0],
//         ngaySinh: `${birthday.substring(4)}-${birthday.substring(2, 4)}-${birthday.substring(0, 2)}`,
//         diaChi: splits[3],
//       });
//       setIsQrModalVisible(false);
//     }
//   };

//   const handleAddStaff = (data) => {
//     if (!dataAddress) {
//       toast.error("Vui lòng chọn địa chỉ!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("avatar", avatar);
//     formData.append("address.ten", data.ten);
//     formData.append("address.soDienThoai", data.soDienThoai);
//     formData.append("address.diaChi", data.diaChi);
//     formData.append("cccd", data.cccd);
//     formData.append("taiKhoan", data.taiKhoan);
//     formData.append("ten", data.ten);
//     formData.append("gioiTinh", data.gioiTinh);
//     formData.append("ngaySinh", data.ngaySinh);
//     formData.append("email", data.email);
//     formData.append("soDienThoai", data.soDienThoai);

//     Modal.confirm({
//       title: "Xác nhận",
//       maskClosable: true,
//       content: "Xác nhận thêm nhân viên?",
//       okText: "Xác nhận",
//       cancelText: "Hủy",
//       onOk: () => {
//         setLoading(true);
//         request
//           .post("/nhan-vien/create", formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//           })
//           .then((response) => {
//             setLoading(false);
//             if (response.data.success) {
//               toast.success("Thêm thành công!");
//               navigate("/nhan-vien");
//             }
//           })
//           .catch((e) => {
//             setLoading(false);
//             toast.error(e.response.data);
//           });
//       },
//     });
//   };

//   const showModal = () => {
//     setIsQrModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsQrModalVisible(false);
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div>
//       <Button type="primary" onClick={showModal}>
//         Quét CCCD
//       </Button>
//       <Modal
//         title="Quét CCCD"
//         visible={isQrModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//       >
//         <QrCode onQrSuccess={handleQrSuccess} />
//       </Modal>
//       <Form onFinish={handleAddStaff} layout="vertical" form={form}>
//         <Row gutter={24}>
//           <Col span={8}>
//             <h6>Thông tin nhân viên</h6>
//             <Divider />
//             <Form.Item
//               label="Tên nhân viên"
//               name="ten"
//               rules={[
//                 { required: true, message: "Tên không được để trống!" },
//                 {
//                   pattern: /^[^\d!@#$%^&*()_+={}\\:;"'<>,.?/`~|-]+$/,
//                   message: "Tên phải là chữ",
//                 },
//               ]}
//             >
//               <Input placeholder="Nhập tên nhân viên..." />
//             </Form.Item>
//           </Col>
//           <Col span={16}>
//             <h6>Thông tin chi tiết</h6>
//             <Divider />
//             <Row gutter={10}>
//               <Col span={12}>
//                 <Form.Item
//                   label="Mã định danh (Số CMT/CCCD)"
//                   name="cccd"
//                   rules={[
//                     { required: true, message: "Mã định danh không được để trống!" },
//                     {
//                       pattern: /^([0-9]{9}|[0-9]{12})$/,
//                       message: "Mã định danh phải có 9 hoặc 12 kí tự!",
//                     },
//                   ]}
//                 >
//                   <Input placeholder="Nhập mã định danh..." />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   label="Giới tính"
//                   name="gioiTinh"
//                   rules={[{ required: true, message: "Giới tính không được để trống!" }]}
//                 >
//                   <Radio.Group>
//                     <Radio value="Nam">Nam</Radio>
//                     <Radio value="Nữ">Nữ</Radio>
//                   </Radio.Group>
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   label="Ngày sinh"
//                   name="ngaySinh"
//                   rules={[{ required: true, message: "Ngày sinh không được để trống!" }]}
//                 >
//                   <Input type="date" />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   label="Email"
//                   name="email"
//                   rules={[{ required: true, message: "Email không được để trống!" }]}
//                 >
//                   <Input placeholder="Nhập email ..." />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   label="Số điện thoại"
//                   name="soDienThoai"
//                   rules={[
//                     { required: true, message: "Số điện thoại không được để trống!" },
//                     { pattern: /^0[0-9]{9}$/, message: "SDT không đúng định dạng!" },
//                   ]}
//                 >
//                   <Input placeholder="Nhập số điện thoại ..." />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   label="Địa chỉ cụ thể"
//                   name="diaChi"
//                   rules={[{ required: true, message: "Địa chỉ cụ thể không được để trống!" }]}
//                 >
//                   <Input placeholder="Nhập địa chỉ cụ thể ..." />
//                 </Form.Item>
//               </Col>   
//             </Row>
//           </Col>
//         </Row>
//         <Row justify="center">
//           <Col>
//             <Button type="primary" htmlType="submit" className="mt-3">
//               Thêm nhân viên
//             </Button>
//           </Col>
//         </Row>
//       </Form>
//     </div>
//   );
// };

// export default AddCustomer;




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as request from "views/utilities/httpRequest";
import { Modal } from "antd";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {
  Paper, Typography, TextField, Button, Grid, RadioGroup, Radio,
  FormControlLabel, FormControl
} from '@mui/material';

const AddCustomer = () => {
  const [formValues, setFormValues] = useState({
    ma: "",
    cccd: "",
    soDienThoai: "",
    ten: "",
    trangThai: "",
    gioiTinh: "",
    diaChi: "",
    email: "",
    ngaySinh: "",
    chucVu: "",
    deleted: false
  });

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const { ten, cccd, soDienThoai, email, trangThai, gioiTinh, ngaySinh } = formValues;
    if (!ten || ten.trim() === "" || /\d/.test(ten) || /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/.test(ten)) {
      toast.error("Tên nhân viên không được để trống, không được chứa số và không được chứa ký tự tiếng Việt.");
      return false;
    }
    if (!cccd || cccd.trim() === "" || !/^[\d]{9,12}$/.test(cccd)) {
      toast.error("Căn cước không hợp lệ.");
      return false;
    }
    if (!soDienThoai || !/^[0-9]{10}$/.test(soDienThoai)) {
      toast.error("Số điện thoại không hợp lệ.");
      return false;
    }
    if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      toast.error("Email không hợp lệ.");
      return false;
    }
    if (!ngaySinh) {
      toast.error("Ngày sinh không được để trống.");
      return false;
    } else {
      const birthDate = new Date(ngaySinh);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        toast.error("Nhân viên phải đủ 18 tuổi trở lên.");
        return false;
      }
    }
    if (!trangThai || (trangThai !== "Hoạt động" && trangThai !== "Ngừng hoạt động")) {
      toast.error("Vui lòng chọn trạng thái.");
      return false;
    }
    if (!gioiTinh || (gioiTinh !== "Nam" && gioiTinh !== "Nữ")) {
      toast.error("Vui lòng chọn giới tính.");
      return false;
    }
    return true;
  };

  const handleAddEmployee = async (data) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm nhân viên?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        request.post("/nhan-vien/create", data).then((response) => {
          if (response.data.success) {
            toast.success("Thêm thành công!");
            navigate("/nhan-vien");
          }
        }).catch((e) => {
          toast.error(e.response.data);
        });
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleAddEmployee(formValues);
    }
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Thêm mới nhân viên
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Họ tên nhân viên"
                  name="ten"
                  value={formValues.ten}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Căn cước"
                  name="cccd"
                  value={formValues.cccd}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Số điện thoại"
                  name="soDienThoai"
                  value={formValues.soDienThoai}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Địa chỉ"
                  name="diaChi"
                  value={formValues.diaChi}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Form.Item name="ngaySinh" label="Ngày sinh">
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    value={formValues.ngaySinh}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Form.Item>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" fullWidth>
                  <Typography variant="subtitle1" gutterBottom>
                    Trạng thái
                  </Typography>
                  <RadioGroup
                    name="trangThai"
                    value={formValues.trangThai}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel value="Hoạt động" control={<Radio />} label="Hoạt động" />
                    <FormControlLabel value="Ngừng hoạt động" control={<Radio />} label="Ngừng hoạt động" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" fullWidth>
                  <Typography variant="subtitle1" gutterBottom>
                    Giới tính
                  </Typography>
                  <RadioGroup
                    name="gioiTinh"
                    value={formValues.gioiTinh}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                    <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" color="primary" type="submit">
                  Thêm nhân viên
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
      <ToastContainer />
    </Grid>
  );
};

export default AddCustomer;
