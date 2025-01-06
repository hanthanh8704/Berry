package com.example.be.utils.constant;

/**
 * @author hanthanh
 */
public enum StatusBill {
    TAO_HOA_DON(0),
    CHO_XAC_NHAN(1),
    XAC_NHAN(2),
    CHO_VAN_CHUYEN(3),
    VAN_CHUYEN(4),
    DA_THANH_TOAN(5),
    THANH_CONG(6),
    DA_HUY(7),
    YEU_CAU_HUY(8),
    THAY_DOI(9),
    TRA_HANG(10);
    private int value;

    StatusBill(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static StatusBill fromValue(int value) {
        for (StatusBill status : StatusBill.values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("No enum constant for value: " + value);
    }


}

