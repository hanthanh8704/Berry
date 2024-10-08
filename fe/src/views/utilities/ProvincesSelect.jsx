import React, { useState, useEffect } from 'react';
import * as request from 'views/utilities/httpRequest';  // Đảm bảo import đúng request utilities

const ProvincesSelect = ({ selectedProvince, setSelectedProvince, configApi }) => {
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    request.get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province", configApi)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setProvinces(response.data.data);
        } else {
          console.error('Invalid provinces data:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching provinces:', error);
      });
  }, [configApi]);

  // return (
  //   <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
  //     <option value="">Chọn Tỉnh/Thành Phố</option>
  //     {provinces.map((province) => (
  //       <option key={province.ProvinceID} value={province.ProvinceID}>
  //         {province.ProvinceName}
  //       </option>
  //     ))}
  //   </select>
  // );
};

export default ProvincesSelect;
