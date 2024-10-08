import * as request from 'views/utilities/httpRequest'; // Đảm bảo import đúng request utilities

// API config
const configApi = {
  headers: {
    "Content-Type": "application/json",
    Token: "693d8a79-3a3d-11ef-8e53-0a00184fe694",
    ShopId: 192796,
  },
};

// Hàm lấy tên tỉnh từ mã tỉnh
export const fetchProvinceName = async (provinceCode) => {
  try {
    const response = await request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`, configApi);
    const provinces = response.data.data || [];
    const province = provinces.find(p => p.ProvinceID === provinceCode);
    return province ? province.ProvinceName : '';
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return '';
  }
};

// Hàm lấy tên quận/huyện từ mã quận/huyện
export const fetchDistrictName = async (districtCode) => {
  try {
    const response = await request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${districtCode}`, configApi);
    const districts = response.data.data || [];
    const district = districts.find(d => d.DistrictID === districtCode);
    return district ? district.DistrictName : '';
  } catch (error) {
    console.error('Error fetching districts:', error);
    return '';
  }
};

// Hàm lấy tên phường/xã từ mã phường/xã
export const fetchWardName = async (wardCode) => {
  try {
    const response = await request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${wardCode}`, configApi);
    const wards = response.data.data || [];
    const ward = wards.find(w => w.WardCode === wardCode);
    return ward ? ward.WardName : '';
  } catch (error) {
    console.error('Error fetching wards:', error);
    return '';
  }
};




// import React, { useEffect, useState } from "react";
// import { Col, Form, Select, Divider ,Row } from "antd";
// import * as request from 'views/utilities/httpRequest';

// const GHN = ({ dataAddress, thanhPho, phuong, huyen, disabledValue }) => {
//   const [provinces, setProvinces] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [wards, setWards] = useState([]);

//   const [selectedProvince, setSelectedProvince] = useState(null);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedWard, setSelectedWard] = useState(null);

//   const configApi = {
//     headers: {
//       "Content-Type": "application/json",
//       Token: "693d8a79-3a3d-11ef-8e53-0a00184fe694",
//       ShopId: 192796,
//     },
//   };

//   useEffect(() => {
//     request.get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province", configApi)
//       .then((response) => {
//         setProvinces(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching provinces:', error);
//       });
//   }, []);

//   useEffect(() => {
//     if (thanhPho && huyen) {
//       request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${thanhPho}`, configApi)
//         .then((response) => {
//           setDistricts(response.data);
//         })
//         .catch((error) => {
//           console.error('Error fetching districts:', error);
//         });

//       request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${huyen}`, configApi)
//         .then((response) => {
//           setWards(response.data);
//         })
//         .catch((error) => {
//           console.error('Error fetching wards:', error);
//         });
//     }
//   }, [thanhPho, huyen]);

//   const handleProvinceChange = (provinceCode) => {
//     setSelectedProvince(provinceCode);
//     setSelectedDistrict(null);
//     setSelectedWard(null);
//     if (provinceCode) {
//       request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceCode}`, configApi)
//         .then((response) => {
//           setDistricts(response.data);
//         })
//         .catch((error) => {
//           console.error('Error fetching districts:', error);
//         });
//     }
//   };

//   const handleDistrictChange = (districtCode) => {
//     setSelectedDistrict(districtCode);
//     setSelectedWard(null);
//     if (districtCode) {
//       request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtCode}`, configApi)
//         .then((response) => {
//           setWards(response.data);
//         })
//         .catch((error) => {
//           console.error('Error fetching wards:', error);
//         });
//     }
//   };

//   const handleWardChange = (wardCode) => {
//     setSelectedWard(wardCode);
//   };

//   useEffect(() => {
//     if (dataAddress) {
//       dataAddress({
//         thanhPho: selectedProvince,
//         huyen: selectedDistrict,
//         phuong: selectedWard,
//       });
//     }
//   }, [selectedProvince, selectedDistrict, selectedWard, dataAddress]);


// };

// export default GHN;
