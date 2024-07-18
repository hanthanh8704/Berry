import React, { useState, useEffect } from 'react';
import * as request from 'views/utilities/httpRequest';

function DetailAddress({ thanhPho, huyen, phuong }) {
  const [provinceName, setProvinceName] = useState(null);
  const [districtName, setDistrictName] = useState(null);
  const [wardName, setWardName] = useState(null);

  const configApi = {
    headers: {
      "Content-Type": "application/json",
      Token: "693d8a79-3a3d-11ef-8e53-0a00184fe694",
      ShopId: 192796,
    },
  };

  useEffect(() => {
    if (thanhPho) {
      request.get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province", configApi)
        .then((response) => {
          const provinceData = response.data.data.find((item) => item.ProvinceID === parseInt(thanhPho));
          if (provinceData) {
            setProvinceName(provinceData.ProvinceName);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (thanhPho && huyen) {
      request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${thanhPho}`, configApi)
        .then((response) => {
          const districtData = response.data.data.find((item) => item.DistrictID === parseInt(huyen));
          if (districtData) {
            setDistrictName(districtData.DistrictName);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (huyen && phuong) {
      request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${huyen}`, configApi)
        .then((response) => {
          const wardData = response.data.data.find((item) => item.WardCode === phuong);
          if (wardData) {
            setWardName(wardData.WardName);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [thanhPho, huyen, phuong]);

  return (
    <>
      {`${wardName}, ${districtName}, ${provinceName}`}
    </>
  );
}

export default DetailAddress;
