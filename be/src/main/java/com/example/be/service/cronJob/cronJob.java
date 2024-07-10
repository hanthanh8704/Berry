package com.example.be.service.cronJob;

import com.example.be.service.DotGiamGiaService;
import com.example.be.service.PhieuGiamGiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling // chạy ngầm
public class cronJob {
    @Autowired
    private DotGiamGiaService dotGiamGiaService;

    @Scheduled(cron = "0 0/30 * * * ?")// 2s chạy một lần
//    @Scheduled(cron = "*/2 * * * * *") // Chạy mỗi 2 giây
    public void autoUpdateStatusPromotionDetail() {
        try {
            dotGiamGiaService.updateStatusDotGiamGiaDetail();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Scheduled(cron = "0 0/30 * * * ?")// 2s chạy một lần
    public void autoUpdateStatusPromotion() {
        try {
            dotGiamGiaService.updateStatusPromotion();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Autowired
    private PhieuGiamGiaService voucherService;

    @Scheduled(cron = "*/2000000000 * * * * ?")// 2s chạy một lần
    public void autoUpdateStatusVoucher() {
        try {
            voucherService.updateStatusVoucher();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
