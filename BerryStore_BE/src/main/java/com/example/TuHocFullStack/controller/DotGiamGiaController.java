package com.example.TuHocFullStack.controller;

import com.example.TuHocFullStack.dto.NhanVienDto;
import com.example.TuHocFullStack.entity.DotGiamGia;
import com.example.TuHocFullStack.entity.DotGiamGiaDetail;
import com.example.TuHocFullStack.entity.SPCT;
import com.example.TuHocFullStack.repository.DotGiamGiaDetailRepository;
import com.example.TuHocFullStack.repository.DotGiamGiaRepository;
import com.example.TuHocFullStack.repository.SPCT_Repository;
import com.example.TuHocFullStack.service.DotGiamGiaService;
import com.example.TuHocFullStack.service.NhanVienService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@CrossOrigin("*")
@RestController
@RequestMapping("/api/dot-giam-gia")
public class DotGiamGiaController {
    @Autowired
    private DotGiamGiaService dotGiamGiaService;
    @Autowired
    private DotGiamGiaRepository dotGiamGiaRepository;

    @Autowired
    private DotGiamGiaDetailRepository dotGiamGiaDetailRepository;

    @Autowired
    private SPCT_Repository spct_repository;

//    Integer idSPCT;


//    public DotGiamGiaController() {
//        idSPCT = 2;
//    }


    // Ham them Nhan vien vao REST API
    @PostMapping("/add")
    public ResponseEntity<DotGiamGia> createDotGiamGia(@RequestBody DotGiamGia dotGiamGia) {
        DotGiamGia savedDotGiamGia = dotGiamGiaService.createDotGiamGia(dotGiamGia);

        Integer giaTriGiam = savedDotGiamGia.getGiaTriGiam();

        List<Integer> idSPCTs = new ArrayList<>();
        idSPCTs.add(1);


        // Lặp qua từng idSPCT và thêm DotGiamGiaDetail cho mỗi SPCT
        for (Integer idSPCT : idSPCTs) {
            Optional<SPCT> spctOptional = spct_repository.findById(idSPCT);
            if (!spctOptional.isPresent()) {
                // Xử lý trường hợp SPCT không tồn tại
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Hoặc xử lý lỗi khác tùy theo logic của bạn
            }

            SPCT spctDetail = spctOptional.get();
            BigDecimal giaCu = spctDetail.getGiaBan();
            BigDecimal giaMoi = giaCu.multiply(BigDecimal.valueOf(1 - giaTriGiam / 100.0));

            // Tạo bản ghi DotGiamGiaDetail tương ứng
            DotGiamGiaDetail dotGiamGiaDetail = new DotGiamGiaDetail();
            dotGiamGiaDetail.setIdDotGiamGia(savedDotGiamGia); //Lấy ra id đợt giảm giá vừa thêm
            dotGiamGiaDetail.setIdSPCT(spctDetail); // Lấy ra idSPCT được chọn
            dotGiamGiaDetail.setGiaCu(giaCu); //Lấy ra giá cũ trong spct
            dotGiamGiaDetail.setGiaMoi(giaMoi); // Giá mới bằng giá cũ nhân với tỷ lệ giảm giá
            dotGiamGiaDetail.setGiaGiam(giaCu.subtract(giaMoi)); // Giá giảm bằng giá cũ trừ giá mới
            dotGiamGiaDetail.setTrangThai(savedDotGiamGia.getTrangThai());
            dotGiamGiaDetail.setNgayBatDau(savedDotGiamGia.getNgayBatDau());
            dotGiamGiaDetail.setNgayKetThuc(savedDotGiamGia.getNgayKetThuc());


            // Lưu thông tin DotGiamGiaDetail
            dotGiamGiaDetailRepository.save(dotGiamGiaDetail);
        }
        return new ResponseEntity<>(savedDotGiamGia, HttpStatus.CREATED);
    }

    // Ham lay danh sach tat ca Nhan vien
    @GetMapping("/index")
    public ResponseEntity<List<DotGiamGia>> getAllDotGiamGia() {
        List<DotGiamGia> dotGiamGiaList = dotGiamGiaService.getAllDotGiamGia();
        return ResponseEntity.ok(dotGiamGiaList);
    }

    @GetMapping("/search")
    public ResponseEntity<List<DotGiamGia>> search(@RequestParam("keyword") String keyword,
                                                   @RequestParam(value = "startDate", required = false) LocalDateTime startDate,
                                                   @RequestParam(value = "endDate", required = false) LocalDateTime endDate) {
        List<DotGiamGia> dotGiamGiaList;
        if (startDate != null && endDate != null) {
            dotGiamGiaList = dotGiamGiaRepository.findAllByDateChange(startDate, endDate);
        } else {
            dotGiamGiaList = dotGiamGiaRepository.findByMaTenTrangThaiLike(keyword);
        }
        return ResponseEntity.ok(dotGiamGiaList);
    }


    //Lấy ra nhan vien theo id REST API
    @GetMapping("/detail/{id}")
    public ResponseEntity<DotGiamGia> detail(@PathVariable("id") Integer idDGG) {
        DotGiamGia dotGiamGiaDetail = dotGiamGiaService.getDotGiamGiaById(idDGG);
        return ResponseEntity.ok(dotGiamGiaDetail);
    }

    //Hamf update theo id REST API
    @PutMapping("/update/{id}")
    public ResponseEntity<DotGiamGia> updateDotGiamGia(@PathVariable("id") Integer idDGG, @RequestBody DotGiamGia updateDotGiamGia) {
        DotGiamGia dotGiamGiaUpdate = dotGiamGiaService.update(idDGG, updateDotGiamGia);

        // Cập nhật thông tin trong DotGiamGiaDetail
        List<DotGiamGiaDetail> ListdotGiamGiaSPCT = dotGiamGiaDetailRepository.findByIdDotGiamGia(idDGG);

        for (DotGiamGiaDetail dotGiamGiaDetail : ListdotGiamGiaSPCT) {
            Integer giaTriGiam = dotGiamGiaUpdate.getGiaTriGiam();
            BigDecimal giaCu = dotGiamGiaDetail.getGiaCu();
            BigDecimal giaMoi = giaCu.multiply(BigDecimal.valueOf(1 - giaTriGiam / 100.0));
            BigDecimal giaGiam = giaCu.subtract(giaMoi);

            dotGiamGiaDetail.setGiaCu(giaCu);
            dotGiamGiaDetail.setGiaMoi(giaMoi);
            dotGiamGiaDetail.setGiaGiam(giaGiam);
            dotGiamGiaDetail.setTrangThai(dotGiamGiaUpdate.getTrangThai());
            dotGiamGiaDetail.setNgayBatDau(dotGiamGiaUpdate.getNgayBatDau());
            dotGiamGiaDetail.setNgayKetThuc(dotGiamGiaUpdate.getNgayKetThuc());

            dotGiamGiaDetailRepository.save(dotGiamGiaDetail);

        }
        return ResponseEntity.ok(dotGiamGiaUpdate);
    }

    //Xoa thoe id
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Integer idDGG) {
        dotGiamGiaService.delete(idDGG);
        return ResponseEntity.ok("Xóa thành công đợt giảm giá");
    }

    @GetMapping("/export")
    public void export(HttpServletResponse response) throws IOException {
        List<DotGiamGia> listDGG = dotGiamGiaService.getAllDotGiamGia(); // Lấy danh sách Dot Giam Gia

        response.setContentType("application/vnd.ms-excel");
        response.setHeader("Content-Disposition", "attachment; filename=DotGiamGia.xlsx");

        try (Workbook workbook = new XSSFWorkbook(); OutputStream out = response.getOutputStream()) {
            Sheet sheet = workbook.createSheet("DotGiamGia");

            // Tạo hàng tiêu đề
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Mã", "Tên", "Loại khuyến mãi", "Giá trị giảm", "Trạng thái", "Ngày bắt đầu", "Ngày kết thúc", "Người tạo", "Người sửa", "Ngày tạo", "Ngày sửa"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Điền dữ liệu vào các hàng
            int rowNum = 1;
            for (DotGiamGia dgg : listDGG) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(dgg.getId());
                row.createCell(1).setCellValue(dgg.getMa());
                row.createCell(2).setCellValue(dgg.getTen());
                row.createCell(3).setCellValue(dgg.getLoaiKhuyenMai());
                row.createCell(4).setCellValue(dgg.getGiaTriGiam());
                row.createCell(5).setCellValue(dgg.getTrangThai());
                row.createCell(6).setCellValue(dgg.getNgayBatDau().toString());
                row.createCell(7).setCellValue(dgg.getNgayKetThuc().toString());
                row.createCell(8).setCellValue(dgg.getNguoiTao());
                row.createCell(9).setCellValue(dgg.getNguoiSua());
                row.createCell(10).setCellValue(dgg.getNgayTao().toString());
                row.createCell(11).setCellValue(dgg.getNgaySua().toString());
            }
            workbook.write(out);
        }
    }
//    @PostMapping("/add")
//    public ResponseEntity<DotGiamGia> createDotGiamGia(@RequestBody DotGiamGia dotGiamGia) {
//        DotGiamGia savedDotGiamGia = dotGiamGiaService.createDotGiamGia(dotGiamGia);
//        Integer giaTriGiam = savedDotGiamGia.getGiaTriGiam();
//
//        Optional<SPCT> spctOptional = spct_repository.findById(idSPCT);
//        if (!spctOptional.isPresent()) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Hoặc xử lý lỗi khác tùy theo logic của bạn
//        }
//
//        SPCT spctDetail = spctOptional.get();
//        BigDecimal giaCu = spctDetail.getGiaBan();
//        BigDecimal giaMoi = giaCu.multiply(BigDecimal.valueOf(1 - giaTriGiam / 100.0));
//
//        // Tạo bản ghi DotGiamGiaDetail tương ứng
//        DotGiamGiaDetail dotGiamGiaDetail = new DotGiamGiaDetail();
//        dotGiamGiaDetail.setIdDotGiamGia(savedDotGiamGia); //Lấy ra id đợt giảm giá vừa thêm
//        dotGiamGiaDetail.setIdSPCT(spctDetail); // Lấy ra idSPCT được chọn
//        dotGiamGiaDetail.setGiaCu(giaCu); //Lấy ra giá cũ trong spct
//        dotGiamGiaDetail.setGiaMoi(giaMoi); // Giá mới bằng giá cũ nhân với tỷ lệ giảm giá
//        dotGiamGiaDetail.setGiaGiam(giaCu.subtract(giaMoi)); // Giá giảm bằng giá cũ trừ giá mới
//        dotGiamGiaDetail.setTrangThai(savedDotGiamGia.getTrangThai());
//        dotGiamGiaDetail.setNgayBatDau(savedDotGiamGia.getNgayBatDau());
//        dotGiamGiaDetail.setNgayKetThuc(savedDotGiamGia.getNgayKetThuc());
//
//
//        // Lưu thông tin DotGiamGiaDetail
//        dotGiamGiaDetailRepository.save(dotGiamGiaDetail);
//
//        return new ResponseEntity<>(savedDotGiamGia, HttpStatus.CREATED);
//    }
}
