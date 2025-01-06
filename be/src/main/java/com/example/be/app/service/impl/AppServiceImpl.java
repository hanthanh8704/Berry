package com.example.be.app.service.impl;

import com.example.be.app.dto.request.AppBillRequest;
import com.example.be.app.dto.response.GetProductDetailBillResponse;
import com.example.be.app.service.AppService;
import com.example.be.dto.admin.request.bill.BillRequest;
import com.example.be.dto.admin.request.bill.CreateBillRequest;
import com.example.be.entities.Bill;
import com.example.be.entities.BillDetail;
import com.example.be.entities.ProductDetail;
import com.example.be.repositories.admin.BillDetailRepository;
import com.example.be.repositories.admin.BillRepository;
import com.example.be.repositories.admin.ProductDetailRepository;
import com.example.be.repositories.admin.ShirtDetailRepository;
import com.example.be.utils.constant.StartusBillDetail;
import com.example.be.utils.constant.StatusBill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppServiceImpl implements AppService {
    private final ShirtDetailRepository PrDetail;
    private final BillDetailRepository billDetailRepository;
    private final BillRepository billRepository;

    @Autowired
    public AppServiceImpl(ShirtDetailRepository PrDetail, BillDetailRepository billDetailRepository, BillRepository billRepository) {
        this.PrDetail = PrDetail;
        this.billDetailRepository = billDetailRepository;
        this.billRepository = billRepository;
    }

    // Hàm này dùng để hiển thị danh sách sản phẩm

    @Override
    public List<GetProductDetailBillResponse> getProductDetailBillSell(Integer id) {
        return PrDetail.getlistProductBilllSell(id);
    }

    // Hàm dùng để tăng số lượng sản phẩm bên trong giỏ hàng
    @Override
    public Boolean increaseQuantityBillDetail(Integer idBillDetail, Integer idPrDetail) {
        Optional<BillDetail> optionalBillDetail = billDetailRepository.findById(idBillDetail);
        if (optionalBillDetail.isPresent()) {
            BillDetail billDetail = optionalBillDetail.get();
            billDetail.setQuantity(billDetail.getQuantity() + 1);
            billDetailRepository.save(billDetail);
            Optional<ProductDetail> optionalProductDetail = PrDetail.findById(idPrDetail);
            if (optionalProductDetail.isPresent()) {
                ProductDetail productDetail = optionalProductDetail.get();
                productDetail.setQuantity(productDetail.getQuantity() - 1);
                PrDetail.save(productDetail);
            } else {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Boolean decreaseQuantityBillDetail(Integer idBillDetail, Integer idPrDetail) {
        Optional<BillDetail> optionalBillDetail = billDetailRepository.findById(idBillDetail);
        if (optionalBillDetail.isPresent()) {
            BillDetail billDetail = optionalBillDetail.get();
            billDetail.setQuantity(billDetail.getQuantity() - 1);
            billDetailRepository.save(billDetail);
            Optional<ProductDetail> optionalProductDetail = PrDetail.findById(idPrDetail);
            if (optionalProductDetail.isPresent()) {
                ProductDetail productDetail = optionalProductDetail.get();
                productDetail.setQuantity(productDetail.getQuantity() + 1);
                PrDetail.save(productDetail);
            } else {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Boolean inputQuantityBillDetail(Integer idBillDetail, Integer idProDetail, Integer quantity) {
        Optional<BillDetail> optionalBillDetail = billDetailRepository.findById(idBillDetail);
        Optional<ProductDetail> optionalProductDetail = PrDetail.findById(idProDetail);
        if (optionalProductDetail.isPresent()) {
            if (optionalBillDetail.isPresent()) {
                ProductDetail productDetail = optionalProductDetail.get();
                BillDetail billDetail1 = optionalBillDetail.get();
                productDetail.setQuantity(productDetail.getQuantity() + billDetail1.getQuantity() - quantity);
                billDetail1.setQuantity(quantity);
                billDetailRepository.save(billDetail1);
                PrDetail.save(productDetail);
            } else {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    @Override
    public BillDetail addBillDetail(AppBillRequest request, Integer id) {
        BillDetail existingBillDetail = billDetailRepository.findByProductIdAndBillId(
                request.getProductDetailId(),
                request.getBillId()
        );

        if (existingBillDetail != null) {
            int newQuantity = existingBillDetail.getQuantity() + request.getQuantity();
            existingBillDetail.setQuantity(newQuantity);
            return billDetailRepository.save(existingBillDetail);
        } else {
            ProductDetail productDetail = PrDetail.findById(request.getProductDetailId()).orElse(null);
            Bill bill = billRepository.findById(request.getBillId()).orElse(null);

            BillDetail billDetail = new BillDetail();
            billDetail.setQuantity(request.getQuantity());
            billDetail.setProductDetail(productDetail);
            billDetail.setPrice(request.getPrice());
            billDetail.setBill(bill);
            billDetail.setStatus(StatusBill.THANH_CONG);
            return billDetailRepository.save(billDetail);
        }
    }


    @Override
    public Boolean rollBackQuantityProductDetail(Integer idBill, Integer idPrDetail) {
        Optional<ProductDetail> optionalProductDetail = PrDetail.findById(idPrDetail);
        if (optionalProductDetail.isPresent()) {
            ProductDetail productDetail = optionalProductDetail.get();
            Integer quantity = billDetailRepository.quantityProductDetail(idBill, productDetail.getId());
            productDetail.setQuantity(productDetail.getQuantity() + quantity);
            PrDetail.save(productDetail);
            Integer idBillDetail = billDetailRepository.idBillDetailProductDetail(idBill, productDetail.getId());
            billDetailRepository.deleteById(idBillDetail);
            return true;
        } else {
            return false;
        }
    }
}
