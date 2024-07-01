import {  Col, Input, Row, Table, Tooltip } from "antd";
import { jwtDecode } from "jwt-decode";
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FormatDate from "views/utilities/FormatDate";
import * as request from "views/utilities/httpRequest";
import SearchIcon from '@mui/icons-material/Search';
import { Grid,Box, Typography, Button, FormLabel, RadioGroup, FormControlLabel, Radio, DialogActions, TextField,IconButton,FormControl,InputLabel,Select } from '@mui/material';


function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [trangThai, setTrangThai] = useState(null);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    request.get("/nhan-vien", {
      params: {
        name: searchValue,
        page: currentPage,
        sizePage: pageSize,
        status: trangThai,
      },
    }).then(response => {
      setStaffList(response.data);
      setTotalPages(response.totalPages);
    }).catch(e => {
      console.log(e);
    })
  }, [searchValue, pageSize, trangThai, currentPage]);

  const handleStatusChange = (event) => {
    setTrangThai(event.target.value);
    setCurrentPage(1); // Reset page when status filter changes
  };
  const filteredOrders = staffList.filter(order =>
    (trangThai === 'All' || order.trangthai === trangThai) &&
    (order.ten.toLowerCase().includes(searchValue.toLowerCase()) ||
      (order.soDienThoai.includes(searchValue)) )
  );
  const columns = [
    {
      title: 'STT',
      dataIndex: 'integer',
      key: 'integer',
      className: "text-center",
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      key: 'ten',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
    },
    {
      title: 'Ngày ngày sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
      render: (x) => <FormatDate date={x} />
    },
    {
      title: 'Trạng thái',
      dataIndex: 'deleted',
      key: 'deleted',
      render: (x) => (
        <span className={x ? "fw-semibold text-danger" : "fw-semibold text-success"}>
          {x ? "Đã nghỉ" : "Đang làm"}
        </span>
      )
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      key: 'action',
      render: (x) => (
        <>
          <Tooltip placement="top" title="Chỉnh sửa">
            <Link to={`/admin/customer/${x}`} className="btn btn-sm text-warning">
              <i className="fas fa-edit"></i>
            </Link>
          </Tooltip>
        </>
      )
    },
  ];

  return (
    <Grid container spacing={3}>
      {/* Search Bar */}
      <Grid item xs={12} md={6}>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search orders..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              )
            }}
            
          />
        </Box>
      </Grid>

      {/* Filter by Status */}
      <Grid item xs={12} md={3}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="filter-status-label">Filter by Status</InputLabel>
          <Select
            labelId="filter-status-label"
            id="filter-status"
            value={trangThai}
            onChange={handleStatusChange}
            label="Filter by Status"
          >
            <MenuItem value={null}>tất cả</MenuItem>
            <MenuItem  value={false}>Đang làm</MenuItem>
            <MenuItem value={true}>Nghỉ làm</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={3}>
      <Link to={"/nhan-vien/add"}>
            <Button type="primary" className="bg-warning" icon={<i className="fas fa-plus-circle me-1"></i>}>
              Thêm nhân viên
            </Button>
          </Link>
      </Grid>
      
      <Grid item xs={12} >
      <Table
        dataSource={staffList}
        columns={columns}
        className="mt-3"
        pagination={{
          showSizeChanger: true,
          current: currentPage,
          pageSize: pageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
          showQuickJumper: true,
          total: totalPages * pageSize,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
        rowKey="id"
        style={{ marginTop: '20px' }}
      />
    </Grid>
    </Grid>
  );
}

export default Staff;
