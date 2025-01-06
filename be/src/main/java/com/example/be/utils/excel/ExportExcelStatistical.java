package com.example.be.utils.excel;

import com.example.be.dto.admin.response.statistical.StatisticaYearResponse;
import com.example.be.dto.admin.response.statistical.StatisticalDayResponse;
import com.example.be.dto.admin.response.statistical.StatisticalMonthlyResponse;
import com.example.be.dto.admin.response.statistical.StatisticalWeekResponse;
import com.example.be.repositories.admin.BillRepository;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.*;

@Service
public class ExportExcelStatistical {

    @Value("${jxls.template.path}")
    private String templatePath;
    Integer year = 2024;
    @Autowired
    private BillRepository billRepository;
    private long currentTimeMillis = System.currentTimeMillis();
    private Date currentDate = new Date(currentTimeMillis);

    /**
     * Phương thức tải template Excel và điền dữ liệu thống kê hàng ngày và hàng tháng vào file Excel.
     * @param templateName Tên của template file
     * @return ByteArrayOutputStream Chứa dữ liệu Excel sau khi được điền đầy đủ
     * @throws IOException Nếu xảy ra lỗi khi đọc/ghi file
     */

    public ByteArrayOutputStream downloadExcel(String templateName) throws IOException {
        InputStream in = null;
        ByteArrayOutputStream out = null;
        try {
            out = new ByteArrayOutputStream();
            in = new FileInputStream(ResourceUtils.getFile(templatePath + templateName));
            List<StatisticalDayResponse> statisticalDayList = billRepository.getAllStatisticalDay(getStartOfToday(), getEndOfToday());
            List<StatisticalWeekResponse> statisticalWeekList = billRepository.getAllStatisticalWeek(getStartOfWeek(),getEndOfWeek());
            List<StatisticalMonthlyResponse> statisticalMonthList = billRepository.getAllStatisticalMonthly(getStartOfMonth(), getEndOfMonth());
            List<StatisticaYearResponse> statisticalYearList = billRepository.getAllStatisticalYear(2024);
//            System.out.println("Dataa Day :" + statisticalDayList);
            Map<String, Object> map = new HashMap<>();
            map.put("apiData", statisticalDayList);
            map.put("apiData2", statisticalWeekList);
            map.put("apiData3", statisticalMonthList);
            map.put("apiData4", statisticalYearList);

            XLXUtils.exportExcel(in, out, map);

        } catch (IOException e) {
            throw e;
        } finally {
            try {
                if (out != null) {
                    out.flush();
                    out.close();
                }
                if (in != null) {
                    in.close();
                }
            } catch (IOException e) {
                throw e;
            }
        }
        return out; // Trả về dữ liệu file Excel đã xuất
    }
    /**
     * Phương thức tính thời gian bắt đầu của ngày hiện tại.
     * Thiết lập thời gian về 00:00:00.000 (đầu ngày).
     * @return Thời gian bắt đầu của ngày hiện tại tính bằng milliseconds từ epoch.
     */
    private java.util.Date getStartOfToday() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    /**
     * Phương thức tính thời gian kết thúc của ngày hiện tại.
     * Thiết lập thời gian về 23:59:59.999 (cuối ngày).
     * @return Thời gian kết thúc của ngày hiện tại tính bằng milliseconds từ epoch.
     */
    private java.util.Date getEndOfToday() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    /**
     * Phương thức tính thời gian bắt đầu của tháng hiện tại.
     * Thiết lập ngày về ngày 1 của tháng và thời gian về 00:00:00.000.
     * @return Thời gian bắt đầu của tháng hiện tại tính bằng milliseconds từ epoch.
     */
    private java.util.Date getStartOfMonth() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    /**
     * Phương thức tính thời gian kết thúc của tháng hiện tại.
     * Thiết lập ngày về ngày cuối cùng của tháng và thời gian về 23:59:59.999.
     * @return Thời gian kết thúc của tháng hiện tại tính bằng milliseconds từ epoch.
     */
    private java.util.Date getEndOfMonth() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    private java.util.Date getStartOfWeek() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    private java.util.Date getEndOfWeek() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    /**
     * Phương thức tính thời gian bắt đầu của năm hiện tại.
     * Thiết lập ngày về ngày 1 của tháng 1 và thời gian về 00:00:00.000.
     * @return Thời gian bắt đầu của năm hiện tại tính
     */
    private java.util.Date getStartOfYear() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_YEAR, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    /**
     * Phương thức tính thời gian kết thúc của năm hiện tại.
     * Thiết lập ngày về ngày cuối cùng của tháng 12 và thời gian về 23:59:59.999.
     * @return Thời gian kết thúc của năm hiện tại t
     */

    private java.util.Date getEndOfYear() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_YEAR, calendar.getActualMaximum(Calendar.DAY_OF_YEAR));
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    /**
     * Lớp phụ `CustomBillCanceled` được sử dụng để lưu trữ thông tin hóa đơn đã hủy
     * với các trường dữ liệu cần thiết cho việc xuất báo cáo Excel.
     */

    @Setter
    @Getter
    @ToString
    @AllArgsConstructor
    @NoArgsConstructor
    public class CustomBillCanceled {

        private String code;
        private String customer;
        private String employee;
        private String voucher;
        private String invoiceType;
        private String address;
        private BigDecimal discountAmount;
        private BigDecimal totalMoney;
        private String updatedAt;
        private String note;
    }
}
