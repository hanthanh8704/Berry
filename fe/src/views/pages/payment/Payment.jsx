import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as httpRequest from 'views/utilities/httpRequest';

export default function Payment() {
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        async function check() {
            const paymentReturn = JSON.parse(
                localStorage.getItem("checkout") || "{}"
            );

            const requestData = {};
            for (const [key, value] of new URLSearchParams(window.location.search)) {
                requestData[key] = value;
            }
            requestData.vnp_TxnRef = paymentReturn.idTransaction ? paymentReturn.idTransaction : null;
            try {
                const response = await axios.get(`http://localhost:8080/api/vn-pay/payment-return`,
                    { params: requestData }
                );

                if (isMounted) {
                    if (response.data) {
                        const response = await httpRequest.put(`/bill/${paymentReturn.id}`, {...paymentReturn, tradingCode: requestData.vnp_BankTranNo});
                        if (response.status) {
                            toast.success("Đặt hàng thành công!!!");
                            navigate('/orders');
                        }
                    } else {
                        localStorage.removeItem("checkout");
                        toast.error("Thanh toán thất bại, vui lòng thử lại!");
                        navigate('/orders');
                    }
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

        check();
        return () => {
            isMounted = false;
        };
    }, [navigate]);

    return <></>;
}
