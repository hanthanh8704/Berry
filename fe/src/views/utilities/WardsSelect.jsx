import React, { useState, useEffect } from 'react';
import * as request from 'views/utilities/httpRequest';  // Đảm bảo import đúng request utilities
const WardsSelect = ({ selectedWard, setSelectedWard, huyen, configApi }) => {
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (huyen) {
      request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${huyen}`, configApi)
        .then((response) => {
          if (Array.isArray(response.data.data)) {
            setWards(response.data.data);
          } else {
            console.error('Invalid wards data:', response.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching wards:', error);
        });
    }
  }, [huyen, configApi]);

  // return (
  //   <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
  //     <option value="">Chọn Phường/Xã</option>
  //     {wards.map((ward) => (
  //       <option key={ward.WardCode} value={ward.WardCode}>
  //         {ward.WardName}
  //       </option>
  //     ))}
  //   </select>
  // );
};

export default WardsSelect;
