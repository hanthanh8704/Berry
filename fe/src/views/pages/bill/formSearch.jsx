import { Button, Col, Form, Input, Row, Select } from "antd";
import React from "react";

function FormSearch({
  fillter,
  changFillter,
  handleSubmitSearch,
  clearFillter,
}) {
  const { Option } = Select;

  return (
    <div style={{ padding: "20px", backgroundColor: "white", borderRadius: "10px" }}>
      <Form
        layout="vertical"
        onFinish={handleSubmitSearch}
        onReset={clearFillter}
      >
        {/* Tìm kiếm từ khóa */}
        <Form.Item label="Tìm kiếm" name="searchKey">
          <Input
            value={fillter.key}
            onChange={(value) => changFillter(value.target.value, "key")}
            placeholder="Nhập từ khóa tìm kiếm"
          />
        </Form.Item>

        {/* Loại đơn */}
        <Form.Item label="Loại đơn" name="orderType">
          <Select
            value={fillter.type}
            onChange={(value) => changFillter(value, "type")}
            defaultValue={"Tất cả"}
          >
            <Option value={""} disabled>
              Chọn loại đơn
            </Option>
            <Option value={"OFFLINE"}>Tại quầy</Option>
            <Option value={"ONLINE"}>Online</Option>
          </Select>
        </Form.Item>

        {/* Ngày bắt đầu và kết thúc */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Ngày bắt đầu" name="startDate">
              <Input
                type="date"
                value={fillter.startTimeString}
                onChange={(value) =>
                  changFillter(value.target.value, "startTimeString")
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ngày kết thúc" name="endDate">
              <Input
                type="date"
                value={fillter.endTimeString}
                onChange={(value) =>
                  changFillter(value.target.value, "endTimeString")
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Nút tìm kiếm và làm mới */}
        <Row justify="center" gutter={16} style={{ marginTop: "20px" }}>
          <Col>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
          </Col>
          <Col>
            <Button htmlType="reset">
              Làm mới
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default FormSearch;
