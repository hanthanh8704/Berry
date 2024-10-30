package com.example.be.services.client.cronJobClient;
import com.example.be.services.PromotionService;
import com.example.be.services.client.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
@Component
@EnableScheduling // chạy ngầm
public class CustomerLe {
    @Autowired
    private CartService cartService;
    @Scheduled(cron = "*/30 * * * * *") // Chạy mỗi 2 giây
//    @Scheduled(cron = "*/2 * * * * *") // Chạy mỗi 2 giây
    public void autoUpdateStatusPromotion() {
        try {
            cartService.autoDeleteCustomerLe();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}