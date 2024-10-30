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
    TRA_HANG(10),
    DA_HUY(7);

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

//    TAO_HOA_DON,
//    CHO_XAC_NHAN,
//    XAC_NHAN,
//    CHO_VAN_CHUYEN,
//    VAN_CHUYEN,
//    DA_THANH_TOAN,
//    THANH_CONG,
//    TRA_HANG,
//    DA_HUY
}

