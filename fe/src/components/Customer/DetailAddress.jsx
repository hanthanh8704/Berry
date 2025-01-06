// import React, { useState, useEffect } from 'react';
// import * as request from 'views/utilities/httpRequest';

// function DetailAddress({ city, district, ward }) {
//   const [provinceName, setProvinceName] = useState(null);
//   const [districtName, setDistrictName] = useState(null);
//   const [wardName, setWardName] = useState(null);

//   const configApi = {
//     headers: {
//       Token: "693d8a79-3a3d-11ef-8e53-0a00184fe694",
//       "Content-Type": "application/json",
//       ShopId: "192796"
//     },
//   };

//   useEffect(() => {
//     if (city) {
//       request.get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province", configApi)
//         .then((response) => {
//           const provinceData = response.data.data.find((item) => item.ProvinceID === parseInt(city));
//           if (provinceData) {
//             setProvinceName(provinceData.ProvinceName);
//           }
//         })
//         .catch((e) => {
//           console.log(e);
//         });
//     }

//     if (city && district) {
//       request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${city}`, configApi)
//         .then((response) => {
//           const districtData = response.data.data.find((item) => item.DistrictID === parseInt(district));
//           if (districtData) {
//             setDistrictName(districtData.DistrictName);
//           }
//         })
//         .catch((e) => {
//           console.log(e);
//         });
//     }

//     if (district && ward) {
//       request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${district}`, configApi)
//         .then((response) => {
//           const wardData = response.data.data.find((item) => item.WardCode === ward);
//           if (wardData) {
//             setWardName(wardData.WardName);
//           }
//         })
//         .catch((e) => {
//           console.log(e);
//         });
//     }
//     console.log("CIiiiiiiiiiiiiiiiiiiiiiiiit",provinceName);
//     console.log("CIiiiiiiiiiiiiiiiiiiiiiiiit",districtName);
//     console.log("CIiiiiiiiiiiiiiiiiiiiiiiiit",wardName);
//   }, [city, district, ward]);

//   return (
//     <>
//       {`${wardName}, ${districtName}, ${provinceName}`}
//     </>
//   );
// }

// export default DetailAddress;

import React, { useState, useEffect } from 'react';
import * as request from 'views/utilities/httpRequest';

function DetailAddress({ prov, distr, war }) {
  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);
  const configApi = {
    headers: {
      Token: '693d8a79-3a3d-11ef-8e53-0a00184fe694',
      'Content-Type': 'application/json',
      ShopId: '192796'
    }
  };

  useEffect(() => {
    // Prov
    request
      .get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', configApi)
      .then((response) => {
        setProvince(
          response.data.find((item) => item.ProvinceID === parseInt(prov))
            .ProvinceName
        );
      })
      .catch((e) => {
        console.log("Bug rùi nè huhuuu 1");
      });

    // distr
    request
      .get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${prov}`, configApi)
      .then((response) => {
        setDistrict(response.data.find((item) => item.DistrictID === parseString(distr)).DistrictName);
        console.log("address districtttttttttttttttttttttttttttttttt1111111tttttttt : ", district);
      })
      .catch((e) => {
        console.log("Bug rùi nè huhuuu 2");
      });

    // Ward
    request
      .get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${distr}`, configApi)
      .then((response) => {
        setWard(response.data.find((item) => item.WardCode === war).WardName);
        console.log("address ward : ", response.data);
      })
      .catch((e) => {
        console.log("Bug rùi nè huhuuu 3");
      });
  }, [distr, prov, war]);
  console.log('Data dist 1: ', district);
  console.log('Data dist 2: ', province);
  console.log('Data dist 3: ', ward);

  return <>{` ${district}, ${province},${ward}`}</>;
}

export default DetailAddress;
