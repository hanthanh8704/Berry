package com.example.be.services.cronJob;//package com.example.be.services.cronJob;

import com.example.be.services.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling // chạy ngầm
public class cronJob {
    @Autowired
    private PromotionService dotGiamGiaService;
//    @Autowired
//    private GioHangService gioHangService;

//    @Scheduled(cron = "*/2 * * * * *") // Chạy mỗi 2 giây
//    public void autoUpdateStatusPromotionDetail() {
//        try {
//            dotGiamGiaService.updateStatusDotGiamGiaDetail();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }

    @Scheduled(cron = "*/30 * * * * *") // Chạy mỗi 2 giây
//    @Scheduled(cron = "*/2 * * * * *") // Chạy mỗi 2 giây
    public void autoUpdateStatusPromotion() {
        try {
            dotGiamGiaService.updateStatusPromotion();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

//    @Scheduled(cron = "*/2 * * * * *") // Chạy mỗi 2 giây
//    public void autoDeleteAllGioHang() {
//        try {
//            gioHangService.deleteAll();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//    @Scheduled(cron = "*/2 * * * * *") // Chạy mỗi 2 giây
//    public void AutoUpdateSoLuongSP() {
//        try {
//            gioHangService.autoUpdateSoLuongSP();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
}
