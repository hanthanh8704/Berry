
//                     <Box id="table" noValidate autoComplete="off" width={"600px"} marginRight={"15px"}>
//                         {/* Thanh tìm kiếm cửa Sản phẩm */}
//                         {/* //Tim kiem */}
//                         <Grid item xs={12} md={6}>
//                             <Box display="flex" alignItems="center">
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     placeholder="Tìm kiếm theo tên sản phẩm"
//                                     value={searchValue}
//                                     onChange={(e) => setSearchValue(e.target.value)}
//                                     InputProps={{
//                                         endAdornment: (
//                                             <IconButton>
//                                                 <SearchIcon />
//                                             </IconButton>
//                                         )
//                                     }}
//                                 />
//                             </Box>
//                         </Grid>

//                         {/* Bảng sản phẩm  */}

//                         <TableContainer component={Paper}>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>
//                                             {/* Ô chọn tất cả */}
//                                             <Checkbox

//                                                 checked={selectedSanPhamIds.length === paginatedOrders.length}
//                                                 onChange={handleSelectAllSP}
//                                                 inputProps={{ 'aria-label': 'Chọn tất cả' }}
//                                             />
//                                         </TableCell>
//                                         <TableCell>STT</TableCell>
//                                         <TableCell>Tên sản phẩm</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {paginatedOrders.map((sanPham, index) => (
//                                         <TableRow key={sanPham.id}>
//                                             <TableCell>
//                                                 {/* Checkbox */}
//                                                 <Checkbox
//                                                     checked={selectedSanPhamIds.includes(sanPham.id)}
//                                                     onChange={() => handleCheckboxChangeSP(sanPham.id)}


//                                                 />
//                                             </TableCell>
//                                             <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
//                                             <TableCell>{sanPham.ten}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                         {/* Pagination */}
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
//                             <Pagination
//                                 count={Math.ceil(filteredOrders.length / pageSize)}
//                                 page={currentPage}
//                                 onChange={handleChangePage}
//                                 color="primary"
//                             />
//                         </Grid>
//                     </Box>
//                 </Box>


//                 {/* {sanPhamCT.length > 0 && (
//                     <> */}
//                 {/* <Box id="table2" noValidate autoComplete="off" sx={{
//                             backgroundColor: 'white',
//                             padding: '20px',
//                             borderRadius: '10px',
//                             border: '1px solid black',
//                             marginTop: '50px'
//                         }} > */}

//                 <Typography variant="h3" gutterBottom marginBottom={"20px"} marginTop={"20px"}>
//                     Danh sách chi tiết sản phẩm
//                 </Typography>
//                 {/* Thanh tìn kiếm của sản phẩm chi tiết */}
//                 {/* Search Bar */}
//                 <Grid item xs={12} md={6}>
//                     <Box display="flex" alignItems="center">
//                         <TextField
//                             fullWidth
//                             variant="outlined"
//                             placeholder="Tìm kiếm theo tên sản phẩm, chất liệu, kích cỡ, màu sắc"
//                             value={searchValueSCT}
//                             onChange={handleSearchChange}
//                             InputProps={{
//                                 endAdornment: (
//                                     <IconButton onClick={searchSPCT}>
//                                         <SearchIcon />
//                                     </IconButton>
//                                 )
//                             }}
//                         />
//                     </Box>
//                 </Grid>
//                 {/*   Bảng sản phẩm chi tiết */}
//                 <TableContainer component={Paper}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell padding="checkbox">
//                                     {/* Ô chọn tất cả */}
//                                     <Checkbox
//                                         checked={allCheckedSPCT}
//                                         onChange={handleSelectAllSPCT}
//                                         inputProps={{ 'aria-label': 'Chọn tất cả' }}
//                                     />
//                                 </TableCell>
//                                 <TableCell>STT</TableCell>
//                                 <TableCell>Tên sản phẩm</TableCell>
//                                 <TableCell>Số lượng tồn</TableCell>
//                                 <TableCell>Giá bán</TableCell>
//                                 <TableCell>Chất liệu</TableCell>
//                                 <TableCell>Màu sắc</TableCell>
//                                 <TableCell>Kích cỡ</TableCell>
//                                 <TableCell>Thương hiệu</TableCell>
//                                 <TableCell>Tay áo</TableCell>
//                                 <TableCell>Cổ áo</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {searchSPCT.map((ct, index) => (
//                                 <TableRow key={ct.id}>
//                                     <TableCell padding="checkbox">
//                                         {/* Checkbox */}
//                                         <Checkbox
//                                             checked={selectedSanPhamDetailIds.includes(ct.id)}
//                                             onChange={(e) => handleCheckboxChangeSPCT(e, ct.id)}

//                                         // inputProps={{ 'aria-label': `Chọn sản phẩm chi tiết ${ct.id}` }}
//                                         />
//                                     </TableCell>
//                                     <TableCell>{index + 1}</TableCell>
//                                     <TableCell>{ct.idSanPham && ct.idSanPham.ten}</TableCell>
//                                     <TableCell>{ct.soLuong}</TableCell>
//                                     <TableCell><FormatCurrency value={ct.giaBan} /></TableCell>
//                                     <TableCell>{ct.idChatLieu && ct.idChatLieu.ten}</TableCell>
//                                     <TableCell>{ct.idMauSac && ct.idMauSac.ten}</TableCell>
//                                     <TableCell>{ct.idKichCo && ct.idKichCo.ten}</TableCell>
//                                     <TableCell>{ct.idThuongHieu && ct.idThuongHieu.ten}</TableCell>
//                                     <TableCell>{ct.idTayAo && ct.idTayAo.ten}</TableCell>
//                                     <TableCell>{ct.idCoAo && ct.idCoAo.ten}</TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>


















// import { Table, Input } from "antd";
// import React, { useState, useEffect } from "react";
// import { listSanPhamCT } from '../api/ChiTietSanPhamApi/ChiTietSanPhamApi';

// function TableShoe({ setProductIds, setRowKeys }) {
//   const [productList, setProductList] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const [searchValue, setSearchValue] = useState("");
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);

//   useEffect(() => {
//     getAllSanPham();
//   }, []);

//   function getAllSanPham() {
//     listSanPhamCT()
//       .then((response) => {
//         setProductList(response.data); // Assuming `response.data` contains the array of products
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }

//   const columns = [
//     {
//       title: "STT",
//       dataIndex: "index",
//       key: "index",
//       render: (text, record, index) => index + 1,
//     },
//     {
//       title: "Tên sản phẩm",
//       dataIndex: "productList.idSanPham.ten", // Assuming `response.data` structure allows direct access to `ten`
//       key: "ten",
//     },
//   ];

//   const onSelectChange = (newSelectedRowKeys) => {
//     setSelectedRowKeys(newSelectedRowKeys);
//     setProductIds(newSelectedRowKeys);
//   };

//   const rowSelection = {
//     selectedRowKeys,
//     onChange: onSelectChange,
//   };

//   return (
//     <>
//       <Input
//         placeholder="Tìm kiếm sản phẩm theo tên..."
//         onChange={(e) => setSearchValue(e.target.value)}
//       />
//       <Table
//         rowKey="id"
//         rowSelection={rowSelection}
//         dataSource={productList}
//         columns={columns}
//         className="mt-3"
//         pagination={{
//           showSizeChanger: true,
//           current: currentPage,
//           pageSize: pageSize,
//           pageSizeOptions: [5, 10, 20, 50, 100],
//           showQuickJumper: true,
//           total: productList.length,
//           onChange: (page, pageSize) => {
//             setCurrentPage(page);
//             setPageSize(pageSize);
//           },
//         }}
//       />
//     </>
//   );
// }

// export default TableShoe;
