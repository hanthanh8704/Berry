package com.example.be.services.client;

import com.example.be.dto.client.request.*;
import com.example.be.entities.Address;
import com.example.be.entities.Customer;
import com.example.be.entities.Voucher;
import com.example.be.utils.common.ResponseObject;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CartService {
    List<CartDetailRequest> getAll(Integer idKH); //Lấy gia giỏ hàng chi tiết của khách hàng
    Customer autoCreateCustomerLe();//Ham nay de tạo bản ghi cho khách hàng lẻ
    void autoDeleteCustomerLe();//Ham nay de xóa khách hàng lẻ khi không thanh toán trong vòng 1 tiếng
    ResponseObject create(CartRequest request);

    CartRequest muaHang(CartRequest request);

    ResponseObject thanhToan(BillRequestClient request);

    ResponseObject delete(Integer id);

    CustomerRequestClient detail(Integer idKH);

    Address selectedDiaChi(Integer idDC);

    ResponseObject deleteAll();

    ResponseObject update(Integer id, CartRequest request);

    ResponseObject createDiaChi(AddressRequestClient request);

    Address updateDiaChiMD(Integer idDC);

    ResponseObject updateSoLuong(Integer id, CartRequest request);

    List<ProductRequestClient> search(String key);
    List<ProductRequestClient> findFilteredSearchProducts(String key, Integer idMS , Integer idTH ,Integer idKC ,String priceRange ,String sort);

    List<Voucher> getAllByPublic();

    Voucher selectedPhieuGiamGia(Integer idDC);
    List<Voucher> getAllByCaNhan(Integer idKH);
    Voucher detailVoucher(Integer idP);
    List<BillRequestClient> getAllDonMua(Integer idKH);
}
