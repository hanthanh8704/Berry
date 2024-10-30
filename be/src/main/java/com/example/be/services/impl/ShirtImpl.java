package com.example.be.services.impl;

import com.example.be.dto.admin.request.product.ShirtRequest;
import com.example.be.dto.admin.request.product.ShirtSearchRequest;
import com.example.be.dto.admin.response.ShirtReponse;
import com.example.be.repositories.admin.ShirtRepository;
import com.example.be.services.ShirtService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.converter.ProductConverter;
import com.example.be.utils.exception.RestApiException;
import com.example.be.utils.security.config.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

import com.example.be.entities.*;

@Service
public class ShirtImpl implements ShirtService {

    private String genCode() {
        String prefix = "SP00";
        int x = 1;
        String code = prefix + x;
        while (shirtRepository.existsByCode(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }

    private final ShirtRepository shirtRepository;
    private final ProductConverter productConverter;

    @Override
    public boolean existsByTenIgnoreCase(String ten) {
        return shirtRepository.existsByNameIgnoreCase(ten);
    }

    @Autowired
    public ShirtImpl(ShirtRepository shirtRepository, ProductConverter productConverter) {
        this.shirtRepository = shirtRepository;
        this.productConverter = productConverter;
    }

    @Override
    public PageableObject<ShirtReponse> getAll(ShirtSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        ShirtSearchRequest customRequest = ShirtSearchRequest.builder()
                .name(request.getName()) // Đổi từ 'ten' thành 'name'
                .color(request.getColor()) // Đổi từ 'mauSac' thành 'color'
                .size(request.getSize()) // Đổi từ 'kichCo' thành 'size'
                .material(request.getMaterial()) // Đổi từ 'chatLieu' thành 'material'
                .brand(request.getBrand()) // Đổi từ 'thuongHieu' thành 'brand'
                .sleeve(request.getSleeve()) // Đổi từ 'tayAo' thành 'sleeve'
                .collar(request.getCollar()) // Đổi từ 'coAo' thành 'collar'
                .category(request.getCategory())
                .minPrice(request.getMinPrice())
                .maxPrice(request.getMaxPrice())
                .status(request.getStatus()) // Đổi từ 'trangThai' thành 'status'
                .build();

        return new PageableObject<>(shirtRepository.getAllProducts(customRequest, pageable));
    }

    @Override
    public Product getOne(Integer id) {
        return shirtRepository.findByIdProduct(id);
    }

    //    @Override
//    public Product create(ShirtRequest request) {
//        if (shirtRepository.existsByNameIgnoreCase(request.getName())) {
//            throw new RestApiException(request.getName() + " đã tồn tại!");
//        }
//        request.setCode(genCode());
//        Product sanPham = productConverter.convertRequestToEntity(request);
//        return shirtRepository.save(sanPham);
//
//    }
    @Override
    public Product create(ShirtRequest request) {
        // Kiểm tra xem sản phẩm đã tồn tại chưa
        if (shirtRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RestApiException(request.getName() + " đã tồn tại!");
        }
        request.setCode(genCode());
        Product sanPham = productConverter.convertRequestToEntity(request);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String employeeName = userDetails.getEmployeeName();
            sanPham.setCreatedBy(employeeName);
        } else {
            // Xử lý trường hợp người dùng không hợp lệ hoặc chưa đăng nhập
            throw new RestApiException("Người dùng không hợp lệ hoặc chưa đăng nhập.");
        }

        return shirtRepository.save(sanPham);
    }


    @Override
    public Product update(Integer id, ShirtRequest request) {
        // Tìm sản phẩm hiện có bằng ID
        Product existingProduct = shirtRepository.findByIdProduct(id); // Đổi từ 'findByIdSp' thành 'findByIdProduct'

        // Nếu sản phẩm không tồn tại, ném ra ngoại lệ
        if (existingProduct == null) {
            throw new RestApiException("Sản phẩm không tồn tại với ID: " + id);
        }

        // Kiểm tra xem sản phẩm với tên mới đã tồn tại hay chưa (không phân biệt chữ hoa, chữ thường), nhưng bỏ qua tên của sản phẩm hiện tại
        if (!existingProduct.getName().equalsIgnoreCase(request.getName()) // Đổi từ 'getTen' thành 'getName'
                && shirtRepository.existsByNameIgnoreCase(request.getName())) { // Đổi từ 'existsByTenIgnoreCase' thành 'existsByNameIgnoreCase'
            throw new RestApiException("Tên sản phẩm " + request.getName() + " đã tồn tại!"); // Đổi từ 'ten' thành 'name'
        }

        // Chuyển đổi yêu cầu thành thực thể và cập nhật sản phẩm hiện có
        Product updatedProduct = productConverter.convertRequestToEntity(request); // Đổi từ 'sanPham' thành 'product'
        updatedProduct.setId(existingProduct.getId()); // Đảm bảo ID vẫn giữ nguyên
        updatedProduct.setCode(existingProduct.getCode()); // Đảm bảo mã sản phẩm vẫn giữ nguyên // Đổi từ 'setMa' thành 'setCode'

//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
//            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
//            String employeeName = userDetails.getEmployeeName();
//            updatedProduct.setCreatedBy(employeeName);
//            updatedProduct.setUpdatedBy(employeeName);
//        } else {
//            // Xử lý trường hợp người dùng không hợp lệ hoặc chưa đăng nhập
//            throw new RestApiException("Người dùng không hợp lệ hoặc chưa đăng nhập.");
//        }
        // Lưu sản phẩm đã cập nhật
        return shirtRepository.save(updatedProduct); // Đổi từ 'sanPham' thành 'product'
    }


    @Override
    public Product changeStatus(Integer id) {
        return null;
    }

    @Override
    public List<ShirtReponse> getTopSell(Integer top) {
        return null;
    }
}
