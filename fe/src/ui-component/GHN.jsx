  import React, { useEffect, useState } from "react";
  import { Col, Form, Select, Divider } from "antd";
  import * as request from 'views/utilities/httpRequest';

  const GHN = ({ dataAddress, city, district, ward, disabledValue }) => {
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
      request.get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province", configApi)
        .then((response) => {
          setProvinces(response.data);
        })
        .catch((error) => {
          console.error('Error fetching provinces:', error);
        });
    }, []);

    useEffect(() => {
      if (city && district) {
        request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${city}`, configApi)
          .then((response) => {
            setDistricts(response.data);
          })
          .catch((error) => {
            console.error('Error fetching districts:', error);
          });

        request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${district}`, configApi)
          .then((response) => {
            setWards(response.data);
          })
          .catch((error) => {
            console.error('Error fetching wards:', error);
          });
      }
    }, [city, district]);

    const handleProvinceChange = (provinceCode) => {
      setSelectedProvince(provinceCode);
      setSelectedDistrict(null);
      setSelectedWard(null);
      if (provinceCode) {
        request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceCode}`, configApi)
          .then((response) => {
            setDistricts(response.data);
          })
          .catch((error) => {
            console.error('Error fetching districts:', error);
          });
      }
    };

    const handleDistrictChange = (districtCode) => {
      setSelectedDistrict(districtCode);
      setSelectedWard(null);
      if (districtCode) {
        request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtCode}`, configApi)
          .then((response) => {
            setWards(response.data);
          })
          .catch((error) => {
            console.error('Error fetching wards:', error);
          });
      }
    };

    const handleWardChange = (wardCode) => {
      setSelectedWard(wardCode);
    };

    useEffect(() => {
      if (dataAddress) {
        dataAddress({
          city: selectedProvince,
          district: selectedDistrict,
          ward: selectedWard,
        });
      }
    }, [selectedProvince, selectedDistrict, selectedWard, dataAddress]);

    return (
      <>
        <Col span={8}>
          <Form.Item
            name="city"
            label="Thành phố"
            rules={[{ required: true, message: "Thành phố không được để trống!" }]}
          >
            <Select
              showSearch
              placeholder="Chọn thành phố"
              optionFilterProp="children"
              onChange={handleProvinceChange}
              value={city}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {provinces.map((province) => (
                <Select.Option key={province.ProvinceID} value={province.ProvinceID}>
                  {province.ProvinceName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="district"
            label="Huyện"
            rules={[{ required: true, message: "Huyện không được để trống!" }]}
          >
            <Select
              showSearch
              placeholder="Chọn huyện"
              optionFilterProp="children"
              onChange={handleDistrictChange}
              value={district}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {districts.map((district) => (
                <Select.Option key={district.DistrictID} value={district.DistrictID}>
                  {district.DistrictName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="ward"
            label="Phường"
            rules={[{ required: true, message: "Phường không được để trống!" }]}
          >
            <Select
              showSearch
              placeholder="Chọn phường"
              optionFilterProp="children"
              onChange={handleWardChange}
              value={ward}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {wards.map((ward) => (
                <Select.Option key={ward.WardCode} value={ward.WardCode}>
                  {ward.WardName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </>
    );
  };

  export default GHN;
