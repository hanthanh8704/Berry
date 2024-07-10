  import React, { useEffect, useState } from "react";
  import { Col, Form, Select, Divider } from "antd";
  import * as request from 'views/utilities/httpRequest';

  const GHN = ({ dataAddress, thanhPho, phuong, huyen, disabledValue }) => {
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
      if (thanhPho && huyen) {
        request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${thanhPho}`, configApi)
          .then((response) => {
            setDistricts(response.data);
          })
          .catch((error) => {
            console.error('Error fetching districts:', error);
          });

        request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${huyen}`, configApi)
          .then((response) => {
            setWards(response.data);
          })
          .catch((error) => {
            console.error('Error fetching wards:', error);
          });
      }
    }, [thanhPho, huyen]);

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
          thanhPho: selectedProvince,
          huyen: selectedDistrict,
          phuong: selectedWard,
        });
      }
    }, [selectedProvince, selectedDistrict, selectedWard, dataAddress]);

    return (
      <>
        <Col span={8}>
          <Form.Item
            name="thanhPho"
            label="Thành phố"
            rules={[{ required: true, message: "Thành phố không được để trống!" }]}
          >
            <Select
              showSearch
              placeholder="Chọn thành phố"
              optionFilterProp="children"
              onChange={handleProvinceChange}
              value={thanhPho}
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
            name="huyen"
            label="Huyện"
            rules={[{ required: true, message: "Huyện không được để trống!" }]}
          >
            <Select
              showSearch
              placeholder="Chọn huyện"
              optionFilterProp="children"
              onChange={handleDistrictChange}
              value={huyen}
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
            name="phuong"
            label="Phường"
            rules={[{ required: true, message: "Phường không được để trống!" }]}
          >
            <Select
              showSearch
              placeholder="Chọn phường"
              optionFilterProp="children"
              onChange={handleWardChange}
              value={phuong}
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
