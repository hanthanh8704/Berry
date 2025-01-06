//// Kiểm tra sản phẩm trong giỏ hàng
//        List<BillDetail> exHDCTList = hoaDonChiTietRepository.findChiTietSanPhamMaAndHoaDonID(request.getDetailCode(), request.getIdBill());
//        BillDetail hdct = null; // Khởi tạo hdct với giá trị mặc định là null
//
//        if (exHDCTList != null && !exHDCTList.isEmpty()) {
//        // Nếu tồn tại bản ghi trong giỏ hàng
//        if (exHDCTList.size() == 1) {
//        // Nếu chỉ có một bản ghi, lấy bản ghi đó
//        hdct = exHDCTList.get(0);
//        } else {
//        // Nếu có nhiều hơn một bản ghi, lấy bản ghi mới nhất (ngày tạo sớm nhất)
//        hdct = exHDCTList.stream()
//        .max(Comparator.comparing(BillDetail::getCreatedAt))
//        .orElse(exHDCTList.get(0));
//        }
//
//        // Kiểm tra giá của bản ghi được chọn
//        if (hdct.getPrice().equals(productDetail.getPrice())) {
//        // Nếu giá trùng khớp, cộng dồn số lượng
//        hdct.setQuantity(hdct.getQuantity() + request.getQuantity());
//        hoaDonChiTietRepository.save(hdct);
//        } else {
//        // Nếu giá khác, tạo một bản ghi mới
//        BillDetail newBillDetail = new BillDetail();
//        newBillDetail.setBill(hoaDon);
//        newBillDetail.setProductDetail(productDetail);
//        newBillDetail.setQuantity(request.getQuantity());
//        newBillDetail.setPrice(productDetail.getPrice());
//        newBillDetail.setStatus(StatusBill.CHO_XAC_NHAN);
//        newBillDetail.setPromotion(productDetail.getDiscountPercentage());
//
//        hoaDonChiTietRepository.save(newBillDetail);
//        }
//        } else {
//        // Nếu không có bản ghi nào trong giỏ hàng
//        hdct = billDetailConvert.convertRequestToEntity(request);
//        hdct.setPrice(productDetail.getPrice());
//        hdct.setQuantity(request.getQuantity());
//        hdct.setPromotion(productDetail.getDiscountPercentage());
//        hdct.setStatus(StatusBill.CHO_XAC_NHAN);
//
//        hoaDonChiTietRepository.save(hdct);
//        }