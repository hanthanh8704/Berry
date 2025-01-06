// import React, { useState, useEffect } from 'react';
// import * as request from 'views/utilities/httpRequest';

// function DetailAddress({ prov, distr, war }) {
//   const [province, setProvince] = useState(null);
//   const [district, setDistrict] = useState(null);
//   const [ward, setWard] = useState(null);
//   const configApi = {
//     headers: {
//       Token: '693d8a79-3a3d-11ef-8e53-0a00184fe694',
//       'Content-Type': 'application/json',
//       ShopId: '192796'
//     }
//   };

//   useEffect(() => {
//     // Prov
//     request
//       .get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', configApi)
//       .then((response) => {
//         setProvince(
//           response.data.find((item) => item.ProvinceID === parseInt(prov))
//             .ProvinceName
//         );
//       })
//       .catch((e) => {
//         console.log("Bug rùi nè huhuuu 1");
//       });

//     // distr
//     request
//       .get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${prov}`, configApi)
//       .then((response) => {
//         setDistrict(response.data.find((item) => item.DistrictID === parseString(distr)).DistrictName);
//         console.log("address districtttttttttttttttttttttttttttttttt1111111tttttttt : ", district);
//       })
//       .catch((e) => {
//         console.log("Bug rùi nè huhuuu 2");
//       });

//     // Ward
//     request
//       .get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${distr}`, configApi)
//       .then((response) => {
//         setWard(response.data.find((item) => item.WardCode === war).WardName);
//         console.log("address ward : ", response.data);
//       })
//       .catch((e) => {
//         console.log("Bug rùi nè huhuuu 3");
//       });
//   }, [distr, prov, war]);
//   console.log('Data dist 1: ', district);
//   console.log('Data dist 2: ', province);
//   console.log('Data dist 3: ', ward);

//   return <>{` ${district}, ${province},${ward}`}</>;
// }

// export default DetailAddress;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DetailAddress({ idcustomer, provincesCache, districtCache, wardCache }) {
  // Lưu dữ liệu địa chỉ đã được tải (dạng object, mỗi bản ghi sẽ có địa chỉ riêng)
  const [addressDetails, setAddressDetails] = useState({});

  // Cấu hình API
  const configApi = {
    headers: {
      Token: '693d8a79-3a3d-11ef-8e53-0a00184fe694', // Token cho API
      'Content-Type': 'application/json', // Loại nội dung là JSON
      ShopId: '192796', // ID cửa hàng
    },
  };

  // Hàm lấy dữ liệu tỉnh từ cache hoặc gọi API nếu chưa có
  const fetchProvincesHT = async () => {
    // Kiểm tra nếu cache đã có tỉnh, nếu có trả về luôn
    if (provincesCache.size > 0) {
      console.log('Provinces from cache:', Array.from(provincesCache.values()));
      return Array.from(provincesCache.values());
    }
    
    // Nếu chưa có, gọi API để lấy dữ liệu
    try {
      const response = await axios.get(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province',
        configApi
      );
      if (Array.isArray(response.data.data)) {
        // Lưu các tỉnh vào cache để lần sau sử dụng lại
        response.data.data.forEach((province) => {
          provincesCache.set(province.ProvinceID, province);
        });
        console.log('Fetched and cached provinces:', response.data.data);
        return response.data.data;
      } else {
        console.error('Invalid provinces data:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return [];
    }
  };

  // Hàm lấy dữ liệu quận/huyện từ cache hoặc gọi API nếu chưa có
  const fetchDistrictsHT = async (provinceId) => {
    // Kiểm tra nếu cache đã có quận/huyện cho tỉnh, nếu có trả về luôn
    if (districtCache.has(provinceId)) {
      return districtCache.get(provinceId);
    }
    
    // Nếu chưa có, gọi API để lấy dữ liệu
    try {
      const response = await axios.get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
        configApi
      );
      if (Array.isArray(response.data.data)) {
        // Lưu quận/huyện vào cache để lần sau sử dụng lại
        districtCache.set(provinceId, response.data.data);
        return response.data.data;
      } else {
        console.error('Invalid districts data:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      return [];
    }
  };

  // Hàm lấy dữ liệu xã/phường từ cache hoặc gọi API nếu chưa có
  const fetchWardsHT = async (districtId) => {
    // Kiểm tra nếu cache đã có xã/phường cho quận/huyện, nếu có trả về luôn
    if (wardCache.has(districtId)) {
      return wardCache.get(districtId);
    }
    
    // Nếu chưa có, gọi API để lấy dữ liệu
    try {
      const response = await axios.get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
        configApi
      );
      if (Array.isArray(response.data.data)) {
        // Lưu xã/phường vào cache để lần sau sử dụng lại
        wardCache.set(districtId, response.data.data);
        return response.data.data;
      } else {
        console.error('Invalid wards data:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
      return [];
    }
  };

  // Hàm xử lý địa chỉ cho mỗi bản ghi
  const getAddressDetailsPerRecord = async (record) => {
    const { ward: idPhuong, city: idTP, district: idHuyen } = record;

    // Đảm bảo tỉnh đã có trong cache trước khi tiếp tục
    await fetchProvincesHT();

    // Lấy dữ liệu quận/huyện và xã/phường từ API hoặc cache
    const [districts, wards] = await Promise.all([
      fetchDistrictsHT(idTP),
      fetchWardsHT(idHuyen),
    ]);

    // Lấy tên tỉnh từ cache
    const province = provincesCache.get(Number(idTP));
    const provinceName = province ? province.ProvinceName : 'Không xác định';

    // Lấy tên quận/huyện từ mảng districts
    const districtName =
      districts?.find((d) => Number(d.DistrictID) === Number(idHuyen))?.DistrictName ||
      'Không xác định';

    // Lấy tên xã/phường từ mảng wards
    const wardName =
      wards?.find((w) => String(w.WardCode) === String(idPhuong))?.WardName ||
      'Không xác định';

    console.log(`Address resolved for record ${record.id}: ${provinceName}, ${districtName}, ${wardName}`);
    return `${provinceName}, ${districtName}, ${wardName}`;
  };

  // Xử lý tất cả các bản ghi địa chỉ
  const processAllRecords = async (records) => {
    const details = {};
    // Duyệt qua từng bản ghi để lấy địa chỉ
    await Promise.all(
      records.map(async (record) => {
        const addressDetail = await getAddressDetailsPerRecord(record);
        details[record.id] = addressDetail; // Lưu địa chỉ vào đối tượng details
      })
    );
    setAddressDetails(details); // Cập nhật state addressDetails
    console.log('All address details:', details);
  };

  // Chạy khi idcustomer thay đổi, hoặc khi có listAddress mới
  useEffect(() => {
    if (idcustomer?.listAddress?.length > 0) {
      processAllRecords(idcustomer.listAddress); // Xử lý tất cả địa chỉ
    }
  }, [idcustomer]); // Chạy lại khi idcustomer thay đổi

  console.log("Tỉnh :", provincesCache);
  console.log("Quận/Huyện :", districtCache);
  console.log("Xã/Phường :", wardCache);

  // Hiển thị thông tin địa chỉ cho mỗi bản ghi
  return (
    <div>
      {idcustomer?.listAddress?.map((item) => (
        <p key={item.id}>
          {addressDetails[item.id] || 'Đang tải...'} {/* Hiển thị địa chỉ hoặc thông báo đang tải */}
        </p>
      ))}
    </div>
  );
}

export default DetailAddress;
