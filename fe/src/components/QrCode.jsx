// import React, { useState,useEffect } from 'react';
// import { Button, Modal } from 'antd';
// import QrReader from 'react-qr-scanner';

// function QrCodeScanner({ onQrSuccess }) {
//   const [isCameraOn, setIsCameraOn] = useState(false);
//   const [result, setResult] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal

//   const handleScan = (data) => {
//     if (data) {
//       setResult(data);
//       console.log("Kết quả:", data.text);
//       onQrSuccess(data.text);
//       handleCancel();
//        // Gửi kết quả ra ngoài
//     }
//   };
  

//   const handleError = (err) => {
//     console.error("Lỗi khi quét QR:", err);
//   };

//   const previewStyle = {
//     height: 240,
//     width: 260,
//     transform: "scaleX(-1)", // Lật ảnh để giống camera trước
//   };

//   // Hàm mở/đóng modal
//   const showModal = () => setIsModalVisible(true);
//   const handleCancel = () => {setIsModalVisible(false); 
//     // setIsCameraOn((prev) => !prev);
//   }

//   // const processResult = () => {
//   //   if (result) {
//   //     console.log("Kết quả:", result.text);
//   //     onQrSuccess(result.text);
//   //     // Thực hiện các hành động khác với `result.text`
//   //   }
//   // };

//   // useEffect(() => {
//   //   processResult();
//   // }, [result]);

//   return (
//     <div>
//       <Button onClick={showModal} type="primary">
//         Quét QR
//       </Button>

//       {/* Modal chứa QR scanner */}
//       <Modal
//         title="QR Code Scanner"
//         visible={isModalVisible}
//         onCancel={() => {handleCancel()}}
//         footer={null} // Tắt footer
//         width={320}
//       >
//         <div>
//           <Button 
//         onClick={() => {
//           setIsCameraOn((prev) => !prev); // Bật/tắt camera
//         }} 
//         style={{ marginBottom: 10 }}
//       >
//         {isCameraOn ? "Tắt Camera" : "Mở Camera"}
//       </Button>
//           {isCameraOn==true && (
//             <QrReader
//               delay={1000}
//               style={previewStyle}
//               onError={handleError}
//               onScan={handleScan}
//             />
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default QrCodeScanner;

import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import QrReader from 'react-qr-scanner';

function QrCodeScanner({ onQrSuccess }) {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isScanning, setIsScanning] = useState(false); // Cờ kiểm soát việc quét

  const handleScan = (data) => {
    if (data && !isScanning) { // Kiểm tra cờ trước khi xử lý
      setIsScanning(true); // Ngăn việc quét thêm lần nữa
      console.log("Kết quả:", data.text);
      onQrSuccess(data.text); // Gửi kết quả ra ngoài
      handleCancel(); // Đóng modal và tắt camera
    }
  };

  const handleError = (err) => {
    console.error("Lỗi khi quét QR:", err);
  };

  const previewStyle = {
    height: 260,
    width: 260,
    transform: "scaleX(-1)", // Lật ảnh để giống camera trước
  };

  const showModal = () => {
    setIsModalVisible(true);
    setIsCameraOn(true); // Bật camera
    setIsScanning(false); // Reset cờ quét khi mở modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal
    setIsCameraOn(false); // Tắt camera
    setIsScanning(false); // Reset cờ quét khi đóng modal
  };

  return (
    <div>
      <Button 
        onClick={showModal} 
        style={{ marginBottom: 10 }}
      >
        {isCameraOn ? "Tắt QR" : "Quét QR"}
      </Button>

      {/* Modal chứa QR scanner */}
      <Modal
        title="QR Code Scanner"
        visible={isModalVisible}
        onCancel={handleCancel} // Đóng modal
        footer={null} // Tắt footer
        width={320}
      >
        <div>
          {isCameraOn && (
            <QrReader
              delay={500} // Độ trễ giữa các lần quét (ms)
              style={previewStyle}
              onError={handleError}
              onScan={handleScan} // Gọi hàm khi quét
            />
          )}
        </div>
      </Modal>
    </div>
  );
}

export default QrCodeScanner;
