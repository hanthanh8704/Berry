package com.example.be.controllers.client;
import com.example.be.dto.client.request.CustomerRequestClient;
import com.example.be.dto.client.request.ProductRequestClient;
import com.example.be.entities.Product;
import com.example.be.entities.ProductDetail;
import com.example.be.repositories.client.ProductRepositoryClient;
import com.example.be.services.client.AccountServiceClient;

import com.example.be.services.client.CartService;
import jakarta.validation.Valid;
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
public class ClientController {
    @Autowired
    private ProductRepositoryClient spct_repository;
    @Autowired
    private ProductRepositoryClient sanPhamRepository;
    private CartService gioHangService;

    private AccountServiceClient accountClientService;

    //Làm lại
    @GetMapping("/products/{idDM}")
    public ResponseEntity<List<ProductRequestClient>> getAllProductsById(@PathVariable("idDM") Integer idDM) {
        // Lấy thông tin sản phẩm chính theo id danh mục
        List<Product> sanPhamList = sanPhamRepository.findAllByIdDanhMuc(idDM);

        // Kiểm tra nếu không có sản phẩm nào
        if (sanPhamList.isEmpty()) {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không có sản phẩm
        }

        // Khởi tạo danh sách chứa SanPhamRequest
        List<ProductRequestClient> sanPhamRequestList = new ArrayList<>();

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
                ProductRequestClient sanPhamRequest = new ProductRequestClient();
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
    public ResponseEntity<List<ProductRequestClient>> findFilteredProducts(
            @RequestParam(value = "idMS", required = false) Integer idMS,
            @PathVariable(required = false) Integer idDM,
            @RequestParam(value = "idTH", required = false) Integer idTH,
            @RequestParam(value = "idKC", required = false) Integer idKC,
            @RequestParam(value = "priceRange", required = false) String priceRange,
            @RequestParam(value = "sort", required = false) String sort) {

        List<Product> sanPhamList = sanPhamRepository.findAllByIdDanhMuc(idDM);

        // Khởi tạo danh sách chứa SanPhamRequest
        List<ProductRequestClient> sanPhamRequestList = new ArrayList<>();

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
                ProductRequestClient sanPhamRequest = new ProductRequestClient();
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
                        ProductRequestClient sanPham = (ProductRequestClient) sp;
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
                        ProductRequestClient sanPham = (ProductRequestClient) sp;
                        return sanPham.getListProductDetails().get(0).getCreatedAt();
                    }).reversed()); // Sắp xếp theo ngày tạo mới nhất
                    break;
            }
        }

        // Trả về danh sách sản phẩm kèm chi tiết
        return ResponseEntity.ok(sanPhamRequestList);
    }

    @GetMapping("/product/{idSP}")
    public ResponseEntity<ProductRequestClient> detailSPCT(@PathVariable("idSP") Integer idSP) {
        Optional<Product> optionalSanPham = sanPhamRepository.findById(idSP);

        if (!optionalSanPham.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Product sanPham = optionalSanPham.get();

        ProductRequestClient sanPhamRequest = new ProductRequestClient();

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
    public ResponseEntity<List<ProductRequestClient>> getNewProducts() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);

        List<Product> listSP = spct_repository.findAllByNewProduct(oneWeekAgo);

        List<ProductRequestClient> sanPhamRequestList = new ArrayList<>();

        for (Product sp : listSP) {
            ProductRequestClient sanPhamRequest = new ProductRequestClient();

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

            List<ProductDetail> listSPCT = spct_repository.findAllByNewProductDetail(oneWeekAgo, sp.getId());
            sanPhamRequest.setListProductDetails(listSPCT);

            sanPhamRequestList.add(sanPhamRequest);
        }

        return ResponseEntity.ok(sanPhamRequestList);

    }

    //Thanh tim kiếm của sản phẩm và phần lọc theo san phẩm được thấy
    @GetMapping("/searchSP")
    public ResponseEntity<List<ProductRequestClient>> search(
            @RequestParam(required = false) String key) {
        List<ProductRequestClient> sanPhamRequestList = gioHangService.search(key);
        return ResponseEntity.ok(sanPhamRequestList);
    }

    @GetMapping("/findFilteredSearchProducts")
    public ResponseEntity<List<ProductRequestClient>> findFilteredSearchProducts(
            @RequestParam(required = false) String key,
            @RequestParam(value = "idMS", required = false) Integer idMS,
            @RequestParam(value = "idTH", required = false) Integer idTH,
            @RequestParam(value = "idKC", required = false) Integer idKC,
            @RequestParam(value = "priceRange", required = false) String priceRange,
            @RequestParam(value = "sort", required = false) String sort) {

        // Gọi phương thức tìm kiếm trong dịch vụ với tất cả các tham số
        List<ProductRequestClient> sanPhamRequestList = gioHangService.findFilteredSearchProducts(key, idMS, idTH, idKC, priceRange, sort);

        // Trả về danh sách sản phẩm chi tiết dưới dạng ResponseEntity
        return ResponseEntity.ok(sanPhamRequestList);
    }

    //Phan luu san pham

    @PutMapping("/update/{idKH}")
    public CustomerRequestClient updateKH(@PathVariable Integer idKH, @ModelAttribute @Valid CustomerRequestClient request) {
        return accountClientService.updateKH(idKH, request);
    }
}
