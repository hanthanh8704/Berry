import { Col, Form, Select } from "antd";
import { Option } from "antd/es/mentions";
import React, { useEffect, useState } from "react";
import * as request from 'views/utilities/httpRequest';

const GHNDetail = ({ dataAddress, city, district, ward, disabledValue }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const configApi = {
    headers: {
      "Content-Type": "application/json",
      Token: "693d8a79-3a3d-11ef-8e53-0a00184fe694",
      ShopId: 192796,
    },
  };

  useEffect(() => {
    request.get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province", configApi).then((response) => {
      setProvinces(response.data);
    }).catch((e) => {
      console.log(e);
    });
    if (district !== undefined && ward !== undefined) {
      request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${city}`, configApi).then((response) => {
        setDistricts(response.data);
      }).catch((e) => {
        console.log(e);
      });
      request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${district}`, configApi).then((response) => {
        setWards(response.data);
      }).catch((e) => {
        console.log(e);
      });
    }
  }, [city, district, ward]);

  const handleProvinceChange = (provinceCode) => {
    request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceCode}`, configApi).then((response) => {
      setDistricts(response.data);
    }).catch((e) => {
      console.log(e);
    });
    setSelectedProvince(provinceCode);
  };

  const handleDistrictChange = (districtCode) => {
    request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtCode}`, configApi).then((response) => {
      setWards(response.data);
    }).catch((e) => {
      console.log(e);
    });
    setSelectedDistrict(districtCode);
  };

  useEffect(() => {
    setSelectedProvince(city);
    setSelectedDistrict(district);
    setSelectedWard(ward);
    console.log("Địa chỉ nè :",`${city} - ${district} - ${ward}`);
  }, [city, district, ward]);

  const handleWardChange = (wardCode) => {
    dataAddress({
      city: selectedProvince,
      district: selectedDistrict,
      ward: wardCode,
    });
  };

  return (
    <>
      <Col span={8}>
        <Form.Item label="Tỉnh/thành phố" name={"city"} initialValue={!city ? null : parseInt(city)} rules={[{ required: true, message: "Tỉnh thành phố không được để trống!" },]}>
          <Select showSearch onChange={handleProvinceChange} placeholder="Chọn tỉnh/thành phố..." optionFilterProp="children"
            filterOption={(input, option) => (option?.children ?? "").toLowerCase().includes(input.toLowerCase())}
            defaultValue={!city ? null : parseInt(city)}
            disabled={disabledValue}
          >
            {provinces.map((province) => (
              <Option key={province.ProvinceID} value={province.ProvinceID}>
                {province.ProvinceName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Quận/huyện" name={"district"} initialValue={!district ? null : parseInt(district)} rules={[{ required: true, message: "Quận huyện không được để trống!" },]}>
          <Select showSearch onChange={handleDistrictChange} placeholder="Chọn quận/huyện..." optionFilterProp="children"
            filterOption={(input, option) => (option?.children ?? "").toLowerCase().includes(input.toLowerCase())}
            defaultValue={!district ? null : parseInt(district)}
            disabled={disabledValue}
          >
            {districts.map((province) => (
              <Option key={province.DistrictID} value={province.DistrictID}>
                {province.DistrictName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Xã/phường" initialValue={ward} name={"ward"} rules={[{ required: true, message: "Xã phường không được để trống!" },]}>
          <Select showSearch onChange={handleWardChange} placeholder="Chọn xã/phường/thị trấn..." optionFilterProp="children"
            filterOption={(input, option) => (option?.children ?? "").toLowerCase().includes(input.toLowerCase())}
            defaultValue={ward}
            disabled={disabledValue}
          >
            {wards.map((ward) => (
              <Option
                key={ward.WardCode}
                value={ward.WardCode}
              >
                {ward.WardName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </>
  );
};

export default GHNDetail;
