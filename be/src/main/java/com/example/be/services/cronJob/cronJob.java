package com.example.be.services.cronJob;//package com.example.be.services.cronJob;

import com.example.be.services.PromotionService;
import com.example.be.services.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
public class cronJob {
    @Autowired
    private PromotionService dotGiamGiaService;
  //  @Autowired
//    private GioHangService gioHangService;

//    @Scheduled(cron = "*/2 * * * * *") // Chạy mỗi 2 giây
//    public void autoUpdateStatusPromotionDetail() {
//        try {
//            dotGiamGiaService.updateStatusDotGiamGiaDetail();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//
//    @Scheduled(cron = "*/30 * * * * *") // Chạy mỗi 30 giây
//    @Scheduled(cron = "*/2 * * * * *") // Chạy mỗi 2 giây
//    public void autoUpdateStatusPromotion() {
//        try {
//            dotGiamGiaService.updateStatusPromotion();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }

    @Autowired
    private VoucherService voucherService;


    //    @Scheduled(cron = "0 0 0 * * ?") // Chạy vào lúc 00:00:00 mỗi ngày
//    @Scheduled(cron = "*/2 * * * * ?") // Chạy vào lúc 00:00:00 mỗi ngày
//    public void createScheduledVoucher() {
//        System.out.println(".");
//        try {
//            voucherService.updateStatusVoucher();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }

}
