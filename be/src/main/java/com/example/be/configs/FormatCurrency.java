package com.example.be.configs;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class FormatCurrency {
    public static String format(BigDecimal amount) {
        // Định dạng tiền tệ cho Việt Nam
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return formatter.format(amount);
    }
}
