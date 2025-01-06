package com.example.be.controllers.client;

import com.example.be.dto.admin.request.statistical.FindBillDateRequest;
import com.example.be.dto.admin.response.statistical.StatisticalBestSellingProductResponse;
import com.example.be.dto.client.request.CustomerRequestClient;
import com.example.be.dto.client.request.ProductRequestClient;
import com.example.be.dto.client.response.SellingProductDetailResponse;
import com.example.be.entities.Product;
import com.example.be.entities.ProductDetail;
import com.example.be.repositories.client.ProductDetalRepositoryClient;
import com.example.be.repositories.client.ProductRepositoryClient;
import com.example.be.services.StaticService;
import com.example.be.services.client.AccountServiceClient;

import com.example.be.services.client.CartService;
import com.example.be.utils.common.ResponseObject;
import com.example.be.utils.exception.RestApiException;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@CrossOrigin("*")
@RestController
@RequestMapping("/api/client")
public class ClientController {
    @Autowired
    ProductDetalRepositoryClient spct_repository;
    @Autowired
    ProductRepositoryClient sanPhamRepository;

    CartService gioHangService;
    StaticService statisticalService;
    AccountServiceClient accountClientService;

    //Làm lại
    @GetMapping("/products/{idDM}")
    public ResponseEntity<List<ProductRequestClient>> getAllProductsById(@PathVariable("idDM") Integer idDM) {
        // Lấy danh sách sản phẩm theo id danh mục, sắp xếp theo ngày tạo
        List<Product> sanPhamList = sanPhamRepository.findAllByIdDanhMuc(idDM);

        // Khởi tạo danh sách chứa ProductRequestClient
        List<ProductRequestClient> sanPhamRequestList = new ArrayList<>();

        // Duyệt qua danh sách sản phẩm
        for (Product sp : sanPhamList) {
            List<ProductDetail> spctList = spct_repository.findByIdSP(sp.getId());

            if (spctList.isEmpty()) {
                continue; // Bỏ qua nếu không có ProductDetail
            }

            Map<String, List<ProductDetail>> groupedSPCT = new HashMap<>();
            for (ProductDetail spct : spctList) {
                String key = spct.getBrand() + "-" + spct.getSleeve() + "-" + spct.getCollar() + "-" + spct.getMaterial();
                groupedSPCT.computeIfAbsent(key, k -> new ArrayList<>()).add(spct);
            }

            // Xử lý từng nhóm SPCT
            for (Map.Entry<String, List<ProductDetail>> entry : groupedSPCT.entrySet()) {
                List<ProductDetail> spcts = entry.getValue();
                spcts.sort((d1, d2) -> d2.getCreatedAt().compareTo(d1.getCreatedAt())); // Sắp xếp theo ngày tạo
                ProductDetail latestSPCT = spcts.get(0); // Lấy SPCT mới nhất

                // Tạo đối tượng ProductRequestClient
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

                sanPhamRequest.setListProductDetails(Collections.singletonList(latestSPCT));
                sanPhamRequestList.add(sanPhamRequest);
            }
        }

        return ResponseEntity.ok(sanPhamRequestList);
    }

    //Hien thi ao nam dep
    @GetMapping("/products/male")
    public ResponseEntity<List<ProductRequestClient>> getAllProductsMale() {
        // Lấy thông tin sản phẩm chính theo id danh mục
        List<Product> sanPhamList = sanPhamRepository.findAllByIdDanhMuc(1);

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

    //Hien thi ao nu dep
    @GetMapping("/products/female")
    public ResponseEntity<List<ProductRequestClient>> getAllProductsFemale() {
        // Lấy thông tin sản phẩm chính theo id danh mục
        List<Product> sanPhamList = sanPhamRepository.findAllByIdDanhMuc(2);

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

    //Hiển thị những sản phẩm có đợt giảm giá là 50
    @GetMapping("/products/promotion")
    public ResponseEntity<List<ProductRequestClient>> getAllProductsPromotion() {
        List<ProductRequestClient> sanPhamRequestList = new ArrayList<>();
        List<Product> products = sanPhamRepository.findProductsWithDiscount(50); // Truy vấn sản phẩm có giảm giá 50%

        for (Product sp : products) {
            // Lấy danh sách SPCT tương ứng với sản phẩm
            List<ProductDetail> spctList = spct_repository.findProductDetailsWithDiscount(50);
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

    @GetMapping("/search/products/promotion")
    public ResponseEntity<List<ProductRequestClient>> findFilteredProductsPromotion(
            @RequestParam(value = "idMS", required = false) Integer idMS,
            @RequestParam(value = "idTH", required = false) Integer idTH,
            @RequestParam(value = "idKC", required = false) Integer idKC,
            @RequestParam(value = "priceRange", required = false) String priceRange,
            @RequestParam(value = "sort", required = false) String sort) {

        // Lấy danh sách sản phẩm có giảm giá 50%
        List<Product> sanPhamList = sanPhamRepository.findProductsWithDiscount(50);

        // Khởi tạo danh sách trả về
        List<ProductRequestClient> sanPhamRequestList = new ArrayList<>();

        for (Product sp : sanPhamList) {
            // Lọc các chi tiết sản phẩm có giảm giá 50%
            List<ProductDetail> spctList = spct_repository.findFilteredProductsPromotionWithDiscount(
                    idMS, sp.getId(), idTH, idKC, priceRange);

            // Nếu không có sản phẩm chi tiết, bỏ qua
            if (spctList.isEmpty()) continue;

            // Nhóm các sản phẩm chi tiết theo thuộc tính
            Map<String, List<ProductDetail>> groupedSPCT = new HashMap<>();
            for (ProductDetail spcts : spctList) {
                String key = spcts.getBrand() + "-" + spcts.getMaterial() + "-" +
                        spcts.getCollar() + "-" + spcts.getSleeve();
                groupedSPCT.computeIfAbsent(key, k -> new ArrayList<>()).add(spcts);
            }

            // Tạo danh sách sản phẩm từ các nhóm
            for (Map.Entry<String, List<ProductDetail>> entry : groupedSPCT.entrySet()) {
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
                sanPhamRequest.setListProductDetails(entry.getValue());

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

    @GetMapping("/search/products-new")
    public ResponseEntity<List<ProductRequestClient>> findFilteredProductsNew(
            @RequestParam(value = "idMS", required = false) Integer idMS,
            @RequestParam(value = "idTH", required = false) Integer idTH,
            @RequestParam(value = "idKC", required = false) Integer idKC,
            @RequestParam(value = "priceRange", required = false) String priceRange,
            @RequestParam(value = "sort", required = false) String sort) {

        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);

        List<Product> listSP = sanPhamRepository.findAllByNewProduct(oneWeekAgo);

        List<ProductRequestClient> sanPhamRequestList = new ArrayList<>();

        for (Product sp : listSP) {
            // Lọc các chi tiết sản phẩm có giảm giá 50%
            List<ProductDetail> spctList = spct_repository.findFilteredProductsNewWithDiscount(
                    idMS, sp.getId(), idTH, idKC, priceRange, oneWeekAgo);

            // Nếu không có sản phẩm chi tiết, bỏ qua
            if (spctList.isEmpty()) continue;

            // Nhóm các sản phẩm chi tiết theo thuộc tính
            Map<String, List<ProductDetail>> groupedSPCT = new HashMap<>();
            for (ProductDetail spcts : spctList) {
                String key = spcts.getBrand() + "-" + spcts.getMaterial() + "-" +
                        spcts.getCollar() + "-" + spcts.getSleeve();
                groupedSPCT.computeIfAbsent(key, k -> new ArrayList<>()).add(spcts);
            }

            // Tạo danh sách sản phẩm từ các nhóm
            for (Map.Entry<String, List<ProductDetail>> entry : groupedSPCT.entrySet()) {
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
                sanPhamRequest.setListProductDetails(entry.getValue());

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
            List<ProductDetail> spctList = spct_repository.findFilteredProducts(idMS, sp.getId(), idTH, idKC, priceRange);

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

    @GetMapping("/product/{idSPCT}")
    public ResponseEntity<ProductRequestClient> detailSPCT(@PathVariable("idSPCT") Integer idSPCT) {

        ProductDetail productDetail = spct_repository.findById(idSPCT).get();
        List<ProductDetail> listSPCT = spct_repository.findByIdSPAndAttributes(productDetail.getProduct().getId(),
                productDetail.getMaterial().getId(), productDetail.getBrand().getId(), productDetail.getCollar().getId()
                , productDetail.getSleeve().getId());

        // Tạo ProductRequestClient từ thông tin sản phẩm
        ProductRequestClient sanPhamRequest = new ProductRequestClient();
        sanPhamRequest.setId(productDetail.getProduct().getId());
        sanPhamRequest.setName(productDetail.getProduct().getName());
        sanPhamRequest.setQuantity(productDetail.getProduct().getQuantity());
        sanPhamRequest.setCategory(productDetail.getProduct().getCategory());
        sanPhamRequest.setStatus(productDetail.getProduct().getStatus());
        sanPhamRequest.setCreatedAt(productDetail.getProduct().getCreatedAt());
        sanPhamRequest.setUpdatedAt(productDetail.getProduct().getUpdatedAt());
        sanPhamRequest.setListProductDetails(listSPCT); // Gán danh sách đã làm phẳng

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
    @GetMapping("/new-product")
    public ResponseEntity<List<ProductRequestClient>> getNewProducts() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);

        List<Product> listSP = sanPhamRepository.findAllByNewProduct(oneWeekAgo);

        List<ProductRequestClient> sanPhamRequestList = new ArrayList<>();

        for (Product sp : listSP) {

            List<ProductDetail> listSPCT = spct_repository.findAllByNewProductDetail(oneWeekAgo, sp.getId());
            Map<String, List<ProductDetail>> groupedSPCT = new HashMap<>();

            for (ProductDetail spct : listSPCT) {
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
                sanPhamRequest.setListProductDetails(spcts);
                sanPhamRequestList.add(sanPhamRequest);
            }
        }

        return ResponseEntity.ok(sanPhamRequestList);

    }

    @GetMapping("/best-selling-product")
    public List<SellingProductDetailResponse> getAllProductDetailSelling(FindBillDateRequest req) {
        // Lấy danh sách sản phẩm thống kê
        List<StatisticalBestSellingProductResponse> statisticalResponses = statisticalService.getAllStatisticalBestSellingProduct(req);
        List<SellingProductDetailResponse> responseDTOs = new ArrayList<>();

        // Khởi tạo nhóm bên ngoài vòng lặp
        Map<String, SellingProductDetailResponse> groupedResponses = new HashMap<>();

        // Duyệt qua từng sản phẩm trong thống kê
        for (StatisticalBestSellingProductResponse productResponse : statisticalResponses) {
            // Lấy thông tin chi tiết của sản phẩm từ thống kê
            ProductDetail productDetail = spct_repository.findById(productResponse.getIdProductDetail())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết sản phẩm"));

            // Tạo khóa nhóm dựa trên brand, sleeve, collar, material
            String key = productDetail.getProduct() + "-" + productDetail.getBrand() + "-" +
                    productDetail.getSleeve() + "-" +
                    productDetail.getCollar() + "-" +
                    productDetail.getMaterial();

            // Nếu key đã tồn tại, cộng dồn số lượng và doanh thu
            if (groupedResponses.containsKey(key)) {
                SellingProductDetailResponse existingResponse = groupedResponses.get(key);

                // Cộng dồn số lượng bán và doanh thu
                existingResponse.setSold(existingResponse.getSold().add(productResponse.getSold())); // BigDecimal cộng dồn
                existingResponse.setSales(existingResponse.getSales().add(productResponse.getSales())); // BigDecimal cộng dồn

                // Thêm chi tiết sản phẩm vào danh sách
                existingResponse.getListProductDetails().add(productDetail);
            } else {
                // Nếu chưa tồn tại, tạo mới DTO
                SellingProductDetailResponse dto = new SellingProductDetailResponse();
                dto.setStt(productResponse.getStt());
                dto.setImage(productResponse.getImage());
                dto.setName(productResponse.getName());
                dto.setPrice(productResponse.getPrice());
                dto.setSold(productResponse.getSold()); // BigDecimal gán giá trị ban đầu
                dto.setSales(productResponse.getSales()); // BigDecimal gán giá trị ban đầu
                dto.setIdProduct(productResponse.getIdProduct());
                dto.setListProductDetails(new ArrayList<>(List.of(productDetail)));
                groupedResponses.put(key, dto);
            }
        }

        // Thêm tất cả nhóm đã xử lý vào danh sách kết quả
        responseDTOs.addAll(groupedResponses.values());

        return responseDTOs;
    }


    @GetMapping("/search/products-best-selling")
    public ResponseEntity<List<SellingProductDetailResponse>> findFilteredProductsSell(
            @RequestParam(value = "idMS", required = false) Integer idMS,
            @RequestParam(value = "idTH", required = false) Integer idTH,
            @RequestParam(value = "idKC", required = false) Integer idKC,
            @RequestParam(value = "priceRange", required = false) String priceRange,
            @RequestParam(value = "sort", required = false) String sort, FindBillDateRequest req) {

        // Lấy danh sách sản phẩm thống kê
        List<StatisticalBestSellingProductResponse> statisticalResponses = statisticalService.getAllStatisticalBestSellingProductFindFiltered(req, idKC, idTH, idMS, priceRange);
        List<SellingProductDetailResponse> responseDTOs = new ArrayList<>();

        // Khởi tạo nhóm bên ngoài vòng lặp
        Map<String, SellingProductDetailResponse> groupedResponses = new HashMap<>();

        // Duyệt qua từng sản phẩm trong thống kê
        for (StatisticalBestSellingProductResponse productResponse : statisticalResponses) {
            // Lấy thông tin chi tiết của sản phẩm từ thống kê
            ProductDetail productDetail = spct_repository.findById(productResponse.getIdProductDetail())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết sản phẩm"));

            // Tạo khóa nhóm dựa trên brand, sleeve, collar, material
            String key = productDetail.getProduct() + "-" + productDetail.getBrand() + "-" +
                    productDetail.getSleeve() + "-" +
                    productDetail.getCollar() + "-" +
                    productDetail.getMaterial();

            // Nếu key đã tồn tại, cộng dồn số lượng và doanh thu
            if (groupedResponses.containsKey(key)) {
                SellingProductDetailResponse existingResponse = groupedResponses.get(key);

                // Cộng dồn số lượng bán và doanh thu
                existingResponse.setSold(existingResponse.getSold().add(productResponse.getSold())); // BigDecimal cộng dồn
                existingResponse.setSales(existingResponse.getSales().add(productResponse.getSales())); // BigDecimal cộng dồn

                // Thêm chi tiết sản phẩm vào danh sách
                existingResponse.getListProductDetails().add(productDetail);
            } else {
                // Nếu chưa tồn tại, tạo mới DTO
                SellingProductDetailResponse dto = new SellingProductDetailResponse();
                dto.setStt(productResponse.getStt());
                dto.setImage(productResponse.getImage());
                dto.setName(productResponse.getName());
                dto.setPrice(productResponse.getPrice());
                dto.setSold(productResponse.getSold()); // BigDecimal gán giá trị ban đầu
                dto.setSales(productResponse.getSales()); // BigDecimal gán giá trị ban đầu
                dto.setIdProduct(productResponse.getIdProduct());
                dto.setListProductDetails(new ArrayList<>(List.of(productDetail)));
                groupedResponses.put(key, dto);
            }
        }

        responseDTOs.addAll(groupedResponses.values());

        // Sắp xếp theo điều kiện sort
        if (sort != null) {
            switch (sort) {
                case "price-asc":
                    responseDTOs.sort(Comparator.comparing(sp -> {
                        // Ép kiểu về SanPhamRequest
                        BigDecimal gia = sp.getListProductDetails().get(0).getDiscountPrice() != null &&
                                sp.getListProductDetails().get(0).getDiscountPrice().compareTo(BigDecimal.ZERO) != 0
                                ? BigDecimal.valueOf(sp.getListProductDetails().get(0).getDiscountPercentage())
                                : sp.getListProductDetails().get(0).getPrice();
                        return gia;
                    })); // Sắp xếp tăng dần theo giá
                    break;

                case "price-desc":
                    responseDTOs.sort(Comparator.comparing(sp -> {
                        // Ép kiểu về SanPhamRequest
                        SellingProductDetailResponse sanPham = (SellingProductDetailResponse) sp;
                        BigDecimal gia = sanPham.getListProductDetails().get(0).getDiscountPrice() != null &&
                                sanPham.getListProductDetails().get(0).getDiscountPrice().compareTo(BigDecimal.ZERO) != 0
                                ? BigDecimal.valueOf(sanPham.getListProductDetails().get(0).getDiscountPercentage())
                                : sanPham.getListProductDetails().get(0).getPrice();
                        return gia;
                    }).reversed()); // Sắp xếp giảm dần theo giá
                    break;

                case "newest":
                    responseDTOs.sort(Comparator.comparing(sp -> {
                        // Ép kiểu về SanPhamRequest
                        SellingProductDetailResponse sanPham = (SellingProductDetailResponse) sp;
                        return sanPham.getListProductDetails().get(0).getCreatedAt();
                    }).reversed()); // Sắp xếp theo ngày tạo mới nhất
                    break;
            }
        }

        // Trả về danh sách sản phẩm kèm chi tiết
        return ResponseEntity.ok(responseDTOs);
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
    public ResponseEntity<ResponseObject> updateKH(@PathVariable Integer idKH, @ModelAttribute CustomerRequestClient request) {
        try {
            // Gọi service để cập nhật khách hàng
            CustomerRequestClient updatedCustomer = accountClientService.updateKH(idKH, request);
            return ResponseEntity.ok(new ResponseObject(updatedCustomer));
        } catch (RestApiException e) {
            // Trả về lỗi với thông điệp chi tiết
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseObject(e.getMessage()));
        }
    }

    //Cua dat
    @GetMapping("/product-details/{idSP}/suggestions")
    public ResponseEntity<List<ProductRequestClient>> getSuggestedProductsBySize(@PathVariable("idSP") Integer idSP) {
        // Lấy thông tin sản phẩm chính theo id danh mục
        Product sanPham = sanPhamRepository.findAllByIdSPCT(idSP);
        List<Product> sanPhamList = sanPhamRepository.findAllByIdDanhMuc(sanPham.getCategory().getId());
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

}
