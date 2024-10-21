import moment from "moment";
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline'; // Sử dụng import có tên

import { FaFileSignature } from "react-icons/fa";
import { BiSolidTruck } from "react-icons/bi";
import { MdPayment } from "react-icons/md";
import { AiFillCarryOut, AiFillFile } from "react-icons/ai";
import { GiReturnArrow } from "react-icons/gi";
import { BsFileEarmarkExcelFill } from "react-icons/bs";
import "./timeline.css";

const TimeLine = ({ listStatus, data, statusPresent }) => {

  const showIcon = (statusBill) => {
    switch (statusBill) {
      case "TAO_HOA_DON":
        return <AiFillFile />;
      case "CHO_XAC_NHAN":
        return <FaFileSignature />;
      case "VAN_CHUYEN":
      case "CHO_VAN_CHUYEN":
        return <BiSolidTruck />;
      case "DA_THANH_TOAN":
        return <MdPayment />;
      case "THANH_CONG":
        return <AiFillCarryOut />;
      case "TRA_HANG":
        return <GiReturnArrow />;
      default:
        return <BsFileEarmarkExcelFill />;
    }
  };

  // Kiểm tra dữ liệu và trả về thông báo nếu không có dữ liệu
  // if (data.length === 0) {
  //   return <div>Không có dữ liệu lịch sử hóa đơn.</div>;
  // }
  console.log("Timeline",TimelineEvent); // In ra để kiểm tra

  return (
    <div className="container" style={{ width: "100%", margin: "10px" }}>
      <Timeline minEvents={statusPresent !== "THANH_CONG" ? "DA_THANH_TOAN" : "CHO_XAC_NHAN" } placeholder>
        {data
          .filter((history) => history.status !== null)
          .map((item) => (
            <TimelineEvent
              key={item.id} // Thêm key nếu có thể
              color={item.status !== "DA_HUY" ? "#0099FF" : "#FF0000"}
              icon={showIcon(item.status)}
              title={
                item.status === "TAO_HOA_DON" ? "Hóa đơn chờ" :
                item.status === "CHO_XAC_NHAN" ? "Chờ xác nhận" :
                item.status === "XAC_NHAN" ? "Đã xác nhận" :
                item.status === "CHO_VAN_CHUYEN" ? "Chờ vận chuyển" :
                item.status === "VAN_CHUYEN" ? "Đang vận chuyển" :
                item.status === "DA_THANH_TOAN" ? "Đã thanh toán" :
                item.status === "TRA_HANG" ? "Trả hàng" :
                item.status === "THANH_CONG" ? "Thành công" :
                "Đã hủy"
              }
              subtitle={moment(item.createdAt).format("HH:mm:ss DD-MM-YYYY")}
            />
          ))}
      </Timeline>
    </div>
  );
}

export default TimeLine;
