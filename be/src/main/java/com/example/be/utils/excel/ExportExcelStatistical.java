package com.example.be.utils.excel;


import com.example.be.dto.admin.response.bill.BillResponse;
import com.example.be.repositories.admin.BillRepository;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.stream.Collectors;

@Service
public class ExportExcelStatistical {  //XuấtExcelThống kê
//
//    @Value("${jxls.template.path}")
//    private String templatePath;
//
//    @Autowired
//    private BillRepository billRepository;
//
//    private long currentTimeMillis = System.currentTimeMillis();
//    private Date currentDate = new Date(currentTimeMillis);

//    public ByteArrayOutputStream downloadExcel(String templateName) throws IOException {
//        InputStream in = null;
//        ByteArrayOutputStream out = null;
//        try {
//            out = new ByteArrayOutputStream();
//            in = new FileInputStream(ResourceUtils.getFile(templatePath  + templateName));
//
//            List<StatisticalDayResponse> statisticalDayList = billRepository.getAllStatisticalDay(getStartOfToday(), getEndOfToday());
//            List<StatisticalMonthlyResponse> statisticalMonthList = billRepository.getAllStatisticalMonthly(getStartMonth(), getEndMonth());
//            List<CustomBillCanceled> listBillCanceled = billRepository.getBillCanceled()
//                    .stream().map(billCanceled ->{
//                        CustomBillCanceled bill = new CustomBillCanceled(billCanceled);
//                        return bill;
//                    }).collect(Collectors.toList());
//
//
//            Map<String, Object> map = new HashMap<>();
//            map.put("apiData", statisticalDayList);
//            map.put("apiData2", statisticalMonthList);
//            map.put("apiData3", listBillCanceled);
//
//            XLXUtils.exportExcel(in, out, map);
//
//        } catch (IOException e) {
//            throw e;
//        } finally {
//            try {
//                if (out != null) {
//                    out.flush();
//                    out.close();
//                }
//                if (in != null) {
//                    in.close();
//                }
//            } catch (IOException e) {
//                throw e;
//            }
//        }
//        return out;
//    }
//
//    public Long getStartOfToday() {
//        Calendar calendarStart = Calendar.getInstance();
//        calendarStart.setTimeZone(TimeZone.getTimeZone("UTC"));
//        calendarStart.setTime(currentDate);
//        calendarStart.set(Calendar.HOUR_OF_DAY, 0);
//        calendarStart.set(Calendar.MINUTE, 0);
//        calendarStart.set(Calendar.SECOND, 0);
//        calendarStart.set(Calendar.MILLISECOND, 0);
//        return calendarStart.getTimeInMillis();
//    }
//
//    public Long getEndOfToday() {
//        Calendar calendarEnd = Calendar.getInstance();
//        calendarEnd.setTimeZone(TimeZone.getTimeZone("UTC"));
//        calendarEnd.setTime(currentDate);
//        calendarEnd.set(Calendar.HOUR_OF_DAY, 23);
//        calendarEnd.set(Calendar.MINUTE, 59);
//        calendarEnd.set(Calendar.SECOND, 59);
//        calendarEnd.set(Calendar.MILLISECOND, 999);
//        return calendarEnd.getTimeInMillis();
//    }
//
//    public Long getStartMonth() {
//        Calendar calendarStart = Calendar.getInstance();
//        calendarStart.setTimeZone(TimeZone.getTimeZone("UTC"));
//        calendarStart.setTime(currentDate);
//        calendarStart.set(Calendar.DAY_OF_MONTH, 1);
//        calendarStart.set(Calendar.HOUR_OF_DAY, 0);
//        calendarStart.set(Calendar.MINUTE, 0);
//        calendarStart.set(Calendar.SECOND, 0);
//        calendarStart.set(Calendar.MILLISECOND, 0);
//        return calendarStart.getTimeInMillis();
//    }
//
//    public Long getEndMonth() {
//        Calendar calendarEnd = Calendar.getInstance();
//        calendarEnd.setTimeZone(TimeZone.getTimeZone("UTC"));
//        calendarEnd.setTime(currentDate);
//        calendarEnd.set(Calendar.DAY_OF_MONTH, calendarEnd.getActualMaximum(Calendar.DAY_OF_MONTH));
//        calendarEnd.set(Calendar.HOUR_OF_DAY, 23);
//        calendarEnd.set(Calendar.MINUTE, 59);
//        calendarEnd.set(Calendar.SECOND, 59);
//        calendarEnd.set(Calendar.MILLISECOND, 999);
//        return calendarEnd.getTimeInMillis();
//    }
//
//    @Setter
//    @Getter
//    @ToString
//    public class CustomBillCanceled{
//
//        private String code;
//        private String userName;
//        private String nameEmployees;
//        private String type;
//        private BigDecimal totalMoney;
//        private String lastModifiedDate;
//        private String note;
//
//        public CustomBillCanceled(BillResponse response) {
//            this.code = response.getCode();
//            this.userName = response.getRecipientName();
//            this.nameEmployees = response.getEmployee();
//            this.type = response.getInvoiceType();
//            this.totalMoney = response.getTotalMoney();
//            this.lastModifiedDate = String.valueOf(LocalDateTime.now());
//            this.note = response.getNote();
//        }
//    }

}

