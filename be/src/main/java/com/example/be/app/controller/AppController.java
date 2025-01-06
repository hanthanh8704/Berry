package com.example.be.app.controller;


import com.example.be.app.dto.request.AppBillRequest;
import com.example.be.app.repository.AppOrderBillRepository;
import com.example.be.app.service.AppService;
import com.example.be.utils.common.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("api/app")
public class AppController {
    @Autowired
    private AppOrderBillRepository billOrderRepository;

    @Autowired
    private AppService getSell;


    /**
     *  Lấy thông tin hóa đơn dựa trên một chuỗi tìm kiếm (text),
     *  có thể là mã hóa đơn, trạng thái hóa đơn hoặc thông tin liên quan.
     */

    @GetMapping("/get-order/{text}")
    public ResponseObject getBillOrder(@PathVariable("text") String text) {
        return new ResponseObject(billOrderRepository.findBillApp(text));
    }

    /**
     * Lấy danh sách chi tiết sản phẩm trong một hóa đơn,
     * bao gồm thông tin như tên sản phẩm, số lượng, giá bán, và các thuộc tính khác, dựa trên ID của hóa đơn.
     */

    @GetMapping("/get-product-detail-bill/{id}")
    public ResponseObject getAllProductDetailBill(@PathVariable Integer id) {
        return new ResponseObject(getSell.getProductDetailBillSell(id));
    }

    /**
     * Tăng số lượng của một sản phẩm cụ thể trong chi tiết hóa đơn dựa trên idBillDetail.
     * Đồng thời giảm số lượng tồn kho của sản phẩm (idPrDetail) trong kho hàng.
     */
    @PutMapping("/increase-quantity-bill-detail")
    public ResponseObject increaseQuantityBillDetail(@RequestParam("idBillDetail") Integer idBillDetail, @RequestParam("idPrDetail") Integer idPrDetail) {
        return new ResponseObject(getSell.increaseQuantityBillDetail(idBillDetail, idPrDetail));
    }

    /**
     * Giảm số lượng của một sản phẩm trong chi tiết hóa đơn (idBillDetail).
     * Đồng thời tăng số lượng tồn kho của sản phẩm (idPrDetail) trong kho hàng.
     */

    @PutMapping("/decrease-quantity-bill-detail")
    public ResponseObject decreaseQuantityBillDetail(@RequestParam("idBillDetail") Integer idBillDetail, @RequestParam("idPrDetail") Integer idPrDetail) {
        return new ResponseObject(getSell.decreaseQuantityBillDetail(idBillDetail, idPrDetail));
    }

    /**
     * Hoàn lại số lượng sản phẩm từ chi tiết hóa đơn vào kho hàng.
     * Thường sử dụng trong trường hợp hủy hóa đơn hoặc sản phẩm bị trả lại.
     */
    @PutMapping("/roll-back-quantity-product-detail")
    public ResponseObject rollBackQuantityProductDetail(@RequestParam("idBill") Integer idBill, @RequestParam("idPrDetail") Integer idPrDetail) {
        return new ResponseObject(getSell.rollBackQuantityProductDetail(idBill, idPrDetail));
    }

    /**
     * Thêm một sản phẩm mới vào chi tiết hóa đơn (id) dựa trên thông tin từ yêu cầu AppBillRequest.
     * Thường sử dụng khi cần bổ sung sản phẩm vào một hóa đơn hiện tại.
     */

    @PostMapping("/add-product-sell/{id}")
    public ResponseObject addProductSell(@RequestBody AppBillRequest request, @PathVariable Integer id) {
        return new ResponseObject(getSell.addBillDetail(request, id));
    }

    /**
     * Cập nhật trực tiếp số lượng của một sản phẩm trong chi tiết hóa đơn (idBillDetail).
     * Đồng thời, điều chỉnh số lượng tồn kho của sản phẩm (idPrDetail) trong kho dựa trên thay đổi này.
     */

    @PutMapping("/input-quantity-bill-detail")
    public ResponseObject inputQuantityBillDetail(@RequestParam("idBillDetail") Integer idBillDetail, @RequestParam("idPrDetail") Integer idPrDetail, @RequestParam("quantity") Integer quantity) {
        return new ResponseObject(getSell.inputQuantityBillDetail(idBillDetail, idPrDetail, quantity));
    }
}
