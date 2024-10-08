package com.poly.backend.service.cronJob;



import com.poly.backend.service.DotGiamGiaService;
import com.poly.backend.service.client.GioHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling // chạy ngầm
public class cronJob {


    @Autowired
    private DotGiamGiaService dotGiamGiaService;
    @Autowired
    private GioHangService gioHangService;

    @Scheduled(cron = "*/2 * * * * *") // Chạy mỗi 2 giây
    public void autoUpdateStatusPromotionDetail() {
        try {
            dotGiamGiaService.updateStatusDotGiamGiaDetail();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Scheduled(cron = "*/2 * * * * *") // Chạy mỗi 2 giây
    public void autoUpdateStatusPromotion() {
        try {
            dotGiamGiaService.updateStatusPromotion();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Scheduled(cron = "*/2 * * * * *") // Chạy mỗi 2 giây
    public void autoDeleteAllGioHang() {
        try {
            gioHangService.deleteAll();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}