package com.poly.backend.controller.client;

import com.poly.backend.dto.request.khachhang.KhachHangRequest;
import com.poly.backend.dto.request.sanpham.SanPhamRequest;
import com.poly.backend.entity.English.Product;
import com.poly.backend.entity.English.ProductDetail;

import com.poly.backend.infrastructure.common.ResponseObject;
import com.poly.backend.repository.SPCT_Repository;
import com.poly.backend.repository.SanPhamRepository;
import com.poly.backend.service.client.AccountClientService;
import com.poly.backend.service.client.GioHangService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@AllArgsConstructor
@CrossOrigin("*")
@RestController
@RequestMapping("/api/client")
public class SanPham_ClientController {
    @Autowired
    private SPCT_Repository spct_repository;
    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private GioHangService gioHangService;
    @Autowired
    private AccountClientService accountClientService;

    //Làm lại
    @GetMapping("/products/{idDM}")
    public ResponseEntity<List<SanPhamRequest>> getAllProductsById(@PathVariable("idDM") Integer idDM) {
        // Lấy thông tin sản phẩm chính theo id danh mục
        List<Product> sanPhamList = sanPhamRepository.findAllByIdDanhMuc(idDM);

        // Kiểm tra nếu không có sản phẩm nào
        if (sanPhamList.isEmpty()) {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không có sản phẩm
        }

        // Khởi tạo danh sách chứa SanPhamRequest
        List<SanPhamRequest> sanPhamRequestList = new ArrayList<>();

        // Duyệt qua danh sách sản phẩm và tạo SanPhamRequest cho từng sản phẩm
        for (Product sp : sanPhamList) {
            // Lấy danh sách SPCT tương ứng với sản phẩm
            List<ProductDetail> spctList = spct_repository.findByIdSP(sp.getId());

            // Kiểm tra nếu không có SPCT nào
            if (spctList.isEmpty()) {
                continue; // Bỏ qua sản phẩm này nếu không có SPCT
            }

            Map<String, List<ProductDetail>> groupedSPCT = new HashMap<>();

            for (ProductDetail spct : spctList) {
                // Tạo khóa để nhóm theo thương hiệu, chất liệu, cổ áo, tay áo
                String key = spct.getBrand() + "-" +
                        spct.getSleeve() + "-" +
                        spct.getCollar() + "-" +
                        spct.getMaterial();

                // Nếu nhóm đã tồn tại thì thêm vào, nếu chưa thì tạo nhóm mới
                groupedSPCT.computeIfAbsent(key, k -> new ArrayList<>()).add(spct);
            }

            for (Map.Entry<String, List<ProductDetail>> entry : groupedSPCT.entrySet()) {
                List<ProductDetail> spcts = entry.getValue();
                // Tạo đối tượng SanPhamRequest cho từng nhóm
                SanPhamRequest sanPhamRequest = new SanPhamRequest();
                sanPhamRequest.setId(sp.getId());
                sanPhamRequest.setCode(sp.getCode());
                sanPhamRequest.setName(sp.getName());
                sanPhamRequest.setQuantity(sp.getQuantity());
                sanPhamRequest.setCategory(sp.getCategory());
                sanPhamRequest.setStatus(sp.getStatus());
                sanPhamRequest.setCreatedAt(sp.getCreatedAt());
                sanPhamRequest.setUpdatedAt(sp.getUpdatedAt());
                sanPhamRequest.setCreatedBy(sp.getCreatedBy());
                sanPhamRequest.setUpdatedBy(sp.getUpdatedBy());

                // Gán danh sách SPCT cho sản phẩm này
                sanPhamRequest.setListProductDetails(spcts);

                // Thêm vào danh sách sản phẩm trả về
                sanPhamRequestList.add(sanPhamRequest);
            }
        }

        // Trả về danh sách sản phẩm kèm chi tiết
        return ResponseEntity.ok(sanPhamRequestList);
    }

    @GetMapping("/search/products/{idDM}")
    public ResponseEntity<List<SanPhamRequest>> findFilteredProducts(
            @RequestParam(value = "idMS", required = false) Integer idMS,
            @PathVariable(required = false) Integer idDM,
            @RequestParam(value = "idTH", required = false) Integer idTH,
            @RequestParam(value = "idKC", required = false) Integer idKC,
            @RequestParam(value = "priceRange", required = false) String priceRange,
            @RequestParam(value = "sort", required = false) String sort) {

        List<Product> sanPhamList = sanPhamRepository.findAllByIdDanhMuc(idDM);

        // Khởi tạo danh sách chứa SanPhamRequest
        List<SanPhamRequest> sanPhamRequestList = new ArrayList<>();

        // Duyệt qua danh sách sản phẩm và tạo SanPhamRequest cho từng sản phẩm
        for (Product sp : sanPhamList) {
            // Lấy danh sách SPCT tương ứng với sản phẩm
            List<ProductDetail> spctList = sanPhamRepository.findFilteredProducts(idMS, sp.getId(), idTH, idKC, priceRange);

            Map<String, List<ProductDetail>> groupedSPCT = new HashMap<>();

            for (ProductDetail spcts : spctList) {
                // Tạo khóa để nhóm theo thương hiệu, chất liệu, cổ áo, tay áo
                String key = spcts.getBrand() + "-" +
                        spcts.getMaterial() + "-" +
                        spcts.getCollar() + "-" +
                        spcts.getSleeve();

                // Nếu nhóm đã tồn tại thì thêm vào, nếu chưa thì tạo nhóm mới
                groupedSPCT.computeIfAbsent(key, k -> new ArrayList<>()).add(spcts);
            }

            for (Map.Entry<String, List<ProductDetail>> entry : groupedSPCT.entrySet()) {
                List<ProductDetail> spcts = entry.getValue();
                // Tạo đối tượng SanPhamRequest cho từng nhóm
                SanPhamRequest sanPhamRequest = new SanPhamRequest();
                sanPhamRequest.setId(sp.getId());
                sanPhamRequest.setCode(sp.getCode());
                sanPhamRequest.setName(sp.getName());
                sanPhamRequest.setQuantity(sp.getQuantity());
                sanPhamRequest.setCategory(sp.getCategory());
                sanPhamRequest.setStatus(sp.getStatus());
                sanPhamRequest.setCreatedAt(sp.getCreatedAt());
                sanPhamRequest.setUpdatedAt(sp.getUpdatedAt());
                sanPhamRequest.setCreatedBy(sp.getCreatedBy());
                sanPhamRequest.setUpdatedBy(sp.getUpdatedBy());

                // Gán danh sách SPCT cho sản phẩm này
                sanPhamRequest.setListProductDetails(spcts);

                // Thêm vào danh sách sản phẩm trả về
                sanPhamRequestList.add(sanPhamRequest);
            }
        }

        // Sắp xếp theo điều kiện sort
        if (sort != null) {
            switch (sort) {
                case "price-asc":
                    sanPhamRequestList.sort(Comparator.comparing(sp -> {
                        // Ép kiểu về SanPhamRequest
                        BigDecimal gia = sp.getListProductDetails().get(0).getDiscountPrice() != null &&
                                sp.getListProductDetails().get(0).getDiscountPrice().compareTo(BigDecimal.ZERO) != 0
                                ? BigDecimal.valueOf(sp.getListProductDetails().get(0).getDiscountPercentage())
                                : sp.getListProductDetails().get(0).getPrice();
                        return gia;
                    })); // Sắp xếp tăng dần theo giá
                    break;

                case "price-desc":
                    sanPhamRequestList.sort(Comparator.comparing(sp -> {
                        // Ép kiểu về SanPhamRequest
                        SanPhamRequest sanPham = (SanPhamRequest) sp;
                        BigDecimal gia = sanPham.getListProductDetails().get(0).getDiscountPrice() != null &&
                                sanPham.getListProductDetails().get(0).getDiscountPrice().compareTo(BigDecimal.ZERO) != 0
                                ? BigDecimal.valueOf(sanPham.getListProductDetails().get(0).getDiscountPercentage())
                                : sanPham.getListProductDetails().get(0).getPrice();
                        return gia;
                    }).reversed()); // Sắp xếp giảm dần theo giá
                    break;

                case "newest":
                    sanPhamRequestList.sort(Comparator.comparing(sp -> {
                        // Ép kiểu về SanPhamRequest
                        SanPhamRequest sanPham = (SanPhamRequest) sp;
                        return sanPham.getListProductDetails().get(0).getCreatedAt();
                    }).reversed()); // Sắp xếp theo ngày tạo mới nhất
                    break;
            }
        }

        // Trả về danh sách sản phẩm kèm chi tiết
        return ResponseEntity.ok(sanPhamRequestList);
    }

    @GetMapping("/product/{idSP}")
    public ResponseEntity<SanPhamRequest> detailSPCT(@PathVariable("idSP") Integer idSP) {
        Optional<Product> optionalSanPham = sanPhamRepository.findById(idSP);

        if (!optionalSanPham.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Product sanPham = optionalSanPham.get();

        SanPhamRequest sanPhamRequest = new SanPhamRequest();

        sanPhamRequest.setId(sanPham.getId());
        sanPhamRequest.setName(sanPham.getName());
        sanPhamRequest.setQuantity(sanPham.getQuantity());
        sanPhamRequest.setCategory(sanPham.getCategory());
        sanPhamRequest.setStatus(sanPham.getStatus());
        sanPhamRequest.setCreatedAt(sanPham.getCreatedAt());
        sanPhamRequest.setUpdatedAt(sanPham.getUpdatedAt());
        List<ProductDetail> listSPCT = spct_repository.findByIdSP(sanPham.getId());
        sanPhamRequest.setListProductDetails(listSPCT);


        return ResponseEntity.ok(sanPhamRequest);
    }


    //Loc giaBan theo các trường
    @GetMapping("/pro")
    public ResponseEntity<ProductDetail> findByIdMauSacAndIdKichCo(
            @RequestParam(value = "idSP") Integer idSP,
            @RequestParam(value = "idMau") Integer idMau,
            @RequestParam(value = "idSize") Integer idSize
    ) {
        ProductDetail spct = spct_repository.findByIdMauSacAndIdKichCo(idMau, idSize, idSP);
        if (spct == null) {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        return ResponseEntity.ok(spct);
    }

    //    //Hien thi cua client
    @GetMapping("/sp/new")
    public ResponseEntity<List<SanPhamRequest>> getNewProducts() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);

        List<Product> listSP = sanPhamRepository.findAllByNew(oneWeekAgo);

        List<SanPhamRequest> sanPhamRequestList = new ArrayList<>();

        for (Product sp : listSP) {
            SanPhamRequest sanPhamRequest = new SanPhamRequest();

            sanPhamRequest.setId(sp.getId());
            sanPhamRequest.setCode(sp.getCode());
            sanPhamRequest.setName(sp.getName());
            sanPhamRequest.setQuantity(sp.getQuantity());
            sanPhamRequest.setCategory(sp.getCategory());
            sanPhamRequest.setStatus(sp.getStatus());
            sanPhamRequest.setCreatedAt(sp.getCreatedAt());
            sanPhamRequest.setUpdatedAt(sp.getUpdatedAt());
            sanPhamRequest.setCreatedBy(sp.getCreatedBy());
            sanPhamRequest.setUpdatedBy(sp.getUpdatedBy());

            List<ProductDetail> listSPCT = spct_repository.findByIdSP(sp.getId());
            sanPhamRequest.setListProductDetails(listSPCT);

            sanPhamRequestList.add(sanPhamRequest);
        }

        return ResponseEntity.ok(sanPhamRequestList);

    }

    //Thanh tim kiếm của sản phẩm và phần lọc theo san phẩm được thấy
    @GetMapping("/searchSP")
    public ResponseEntity<List<SanPhamRequest>> search(
            @RequestParam(required = false) String key) {
        List<SanPhamRequest> sanPhamRequestList = gioHangService.search(key);
        return ResponseEntity.ok(sanPhamRequestList);
    }

    @GetMapping("/findFilteredSearchProducts")
    public ResponseEntity<List<SanPhamRequest>> findFilteredSearchProducts(
            @RequestParam(required = false) String key,
            @RequestParam(value = "idMS", required = false) Integer idMS,
            @RequestParam(value = "idTH", required = false) Integer idTH,
            @RequestParam(value = "idKC", required = false) Integer idKC,
            @RequestParam(value = "priceRange", required = false) String priceRange,
            @RequestParam(value = "sort", required = false) String sort) {

        // Gọi phương thức tìm kiếm trong dịch vụ với tất cả các tham số
        List<SanPhamRequest> sanPhamRequestList = gioHangService.findFilteredSearchProducts(key, idMS, idTH, idKC, priceRange, sort);

        // Trả về danh sách sản phẩm chi tiết dưới dạng ResponseEntity
        return ResponseEntity.ok(sanPhamRequestList);
    }

    //Phan luu san pham
    @PutMapping("/update/{idKH}")
    public ResponseObject updateKH(@PathVariable Integer idKH, @RequestBody KhachHangRequest request) {
        return new ResponseObject(accountClientService.updateKH(idKH, request));
    }


}
