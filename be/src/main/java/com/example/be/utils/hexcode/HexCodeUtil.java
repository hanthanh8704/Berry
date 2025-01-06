package com.example.be.utils.hexcode;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

public class HexCodeUtil {

    private static final Map<String, String> colorMap = new HashMap<>();

    static {
        // Bản đồ ánh xạ tên màu (tiếng Việt và tiếng Anh) với mã màu tương ứng
        colorMap.put("red", "#FF0000");
        colorMap.put("green", "#00FF00");
        colorMap.put("blue", "#0000FF");
        colorMap.put("yellow", "#FFFF00");
        colorMap.put("black", "#000000");
        colorMap.put("white", "#FFFFFF");
        colorMap.put("pink", "#FFC0CB");
        colorMap.put("purple", "#800080");
        colorMap.put("orange", "#FFA500");
        // Thêm các màu khác nếu cần
        colorMap.put("đỏ", "#FF0000");
        colorMap.put("xanh", "#00FF00");
        colorMap.put("xanh dương", "#0000FF");
        colorMap.put("vàng", "#FFFF00");
        colorMap.put("đen", "#000000");
        colorMap.put("trắng", "#FFFFFF");
        colorMap.put("hồng", "#FFC0CB");
        colorMap.put("tím", "#800080");
        colorMap.put("cam", "#FFA500");
    }

    public static String generateHexCodeFromName(String colorName) {
        String normalizedColorName = normalizeColorName(colorName.toLowerCase());

        if (colorMap.containsKey(normalizedColorName)) {
            return colorMap.get(normalizedColorName);
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(colorName.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                hexString.append(String.format("%02x", b));
            }
            return "#" + hexString.toString().substring(0, 6);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Không thể tạo hexCode từ tên màu", e);
        }
    }

    private static String normalizeColorName(String colorName) {
        colorName = colorName.replace("á", "a").replace("à", "a").replace("ả", "a")
                .replace("ã", "a").replace("ạ", "a").replace("ă", "a")
                .replace("â", "a").replace("é", "e").replace("è", "e")
                .replace("ẻ", "e").replace("ẽ", "e").replace("ẹ", "e")
                .replace("ê", "e").replace("í", "i").replace("ì", "i")
                .replace("ỉ", "i").replace("ĩ", "i").replace("ị", "i")
                .replace("ó", "o").replace("ò", "o").replace("ỏ", "o")
                .replace("õ", "o").replace("ọ", "o").replace("ô", "o")
                .replace("ơ", "o").replace("ú", "u").replace("ù", "u")
                .replace("ủ", "u").replace("ũ", "u").replace("ụ", "u")
                .replace("ư", "u").replace("ý", "y").replace("ỳ", "y")
                .replace("ỷ", "y").replace("ỹ", "y").replace("ỵ", "y");

        return colorName;
    }
}
