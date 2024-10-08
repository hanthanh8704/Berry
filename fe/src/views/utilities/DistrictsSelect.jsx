import React, { useState, useEffect } from 'react';
import * as request from 'views/utilities/httpRequest';  // Đảm bảo import đúng request utilities
const DistrictsSelect = ({ selectedDistrict, setSelectedDistrict, thanhPho, configApi }) => {
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    if (thanhPho) {
      request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${thanhPho}`, configApi)
        .then((response) => {
          if (Array.isArray(response.data.data)) {
            setDistricts(response.data.data);
          } else {
            console.error('Invalid districts data:', response.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching districts:', error);
        });
    }
  }, [thanhPho, configApi]);

  // return (
  //   <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
  //     <option value="">Chọn Quận/Huyện</option>
  //     {districts.map((district) => (
  //       <option key={district.DistrictID} value={district.DistrictID}>
  //         {district.DistrictName}
  //       </option>
  //     ))}
  //   </select>
  // );
};

export default DistrictsSelect;
