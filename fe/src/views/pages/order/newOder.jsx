// import React, { useState, useEffect } from 'react';
// import * as request from 'views/utilities/httpRequest'; // Đảm bảo request hỗ trợ delete
// import { Button, Tabs, message } from 'antd';
// import OrderItem from './oderItem';

// function Orders() {
//   const [listHoaDon, setListHoaDon] = useState([]);
//   const [waitCreate, setWaitCreate] = useState(false);
//   const [hoveredTab, setHoveredTab] = useState(null);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       loadOrders();
//     }, 1000);
//     return () => clearTimeout(timeout);
//   }, []);

//   const loadOrders = () => {
//     request
//       .get(`/bill/new-bill`, {
//         params: {
//           idEmployee: 1,
//           invoiceStatus: 0,
//         },
//       })
//       .then((response) => {
//         setListHoaDon(response);
//         console.log(response);
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   };

//   const creatOrder = () => {
//     if (listHoaDon.length >= 5) {
//       message.warning('Bạn chỉ có thể tạo tối đa 5 đơn hàng.');
//       return;
//     }
  
//     setWaitCreate(true);
//       request
//         .post('/bill', {})
//         .then((response) => {
//           if (response.status === 200) {
//             message.success('Tạo mới thành công');
//             loadOrders();
//           }
//         })
//         .catch((e) => {
//           message.error(e.response.data || 'Có lỗi xảy ra khi tạo đơn hàng.');
//         })
//         .finally(() => {
//           setWaitCreate(false);
//         });
//   };

//   const removeOrder = (targetKey) => {
//     request
//       .remove(`/bill/${targetKey}`) // Đảm bảo API hỗ trợ DELETE
//       .then((response) => {
//         if (response.status === 200) {
//           message.success('Xóa đơn hàng thành công');
//           loadOrders();
//         } else {
//           message.warning('Không thể xóa đơn hàng, vui lòng thử lại sau');
//         }
//       })
//       .catch((error) => {
//         console.error('Lỗi khi xóa đơn hàng:', error);
//         if (error.response && error.response.data) {
//           message.error(`Lỗi: ${error.response.data}`);
//         } else {
//           message.error('Đã xảy ra lỗi, vui lòng thử lại sau');
//         }
//       });
//   };

//   return (
//     <>
//       <div className="d-flex">
//         <div className="flex-grow-1">
//           <Button onClick={() => creatOrder()} className="bg-warning text-dark" type="primary" loading={waitCreate}>
//             Tạo mới đơn hàng
//           </Button>
//         </div>
//         <div></div>
//       </div>
//       <div className="mt-3">
//         <Tabs>
//           {listHoaDon.length > 0 &&
//             listHoaDon.map((order, index) => (
//               <Tabs.TabPane
//                 key={order.code}
//                 tab={
//                   <div
//                     onMouseEnter={() => setHoveredTab(order.code)}
//                     onMouseLeave={() => setHoveredTab(null)}
//                     style={{ display: 'flex', alignItems: 'center' }}
//                   >
//                     <span>{`Đơn hàng ${index + 1} (${order.code})`}</span>
//                     {hoveredTab === order.code && (
//                       <Button
//                         type="text"
//                         danger
//                         size="small"
//                         onClick={() => removeOrder(order.id)} // Sửa targetKey thành order.id
//                         style={{ marginLeft: 8 }}
//                       >
//                         X
//                       </Button>
//                     )}
//                   </div>
//                 }
//               >
//                 <OrderItem props={order} index={index + 1} onSuccess={() => loadOrders()} />
//               </Tabs.TabPane>
//             ))}
//         </Tabs>
//       </div>
//     </>
//   );
// }

// export default Orders;


import React, { useState, useEffect } from 'react';
import * as request from 'views/utilities/httpRequest'; // Đảm bảo request hỗ trợ delete
import { Button, Tabs, message } from 'antd';
import OrderItem from './oderItem'; // Đảm bảo đường dẫn đúng

function Orders() {
  const [listHoaDon, setListHoaDon] = useState([]);
  const [waitCreate, setWaitCreate] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadOrders();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const token = localStorage.getItem('token');
  // Lấy dữ liệu từ localStorage
  const idNhanVienInt = localStorage.getItem('employeeId');

  const loadOrders = () => {
    request
      .get(`/bill/new-bill`, {
        params: {
          idEmployee: idNhanVienInt,
          invoiceStatus: 0,
        },
      })
      .then((response) => {
        setListHoaDon(response);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const creatOrder = () => {
    setWaitCreate(true);
    const timeout = setTimeout(async () => {
      const requestData = {
        employeeId: idNhanVienInt, // Lấy từ state
      };
      try {
        await request
          .post('/bill', requestData)
          .then((response) => {
            if (response.status === 200) {
              message.success('Tạo mới thành công');
              loadOrders();
            }
          })
          .catch((e) => {
            message.error(e.response.data || 'Đã xảy ra lỗi');
          });
        setWaitCreate(false);
      } catch (e) {}
    }, 1000);
    return () => clearTimeout(timeout);
  };

  const removeOrder = (targetKey) => {
    request
      .remove(`/bill/${targetKey}`) // Đảm bảo API hỗ trợ DELETE
      .then((response) => {
        if (response.status === 200) {
          message.success('Xóa đơn hàng thành công');
          loadOrders();
        } else {
          message.warning('Không thể xóa đơn hàng, vui lòng thử lại sau');
        }
      })
      .catch((error) => {
        console.error('Lỗi khi xóa đơn hàng:', error);
        if (error.response && error.response.data) {
          message.error(`Lỗi: ${error.response.data}`);
        } else {
          message.error('Đã xảy ra lỗi, vui lòng thử lại sau');
        }
      });
  };

  const tabsItems = listHoaDon.map((order, index) => ({
    key: order.code,
    label: (
      <div
        onMouseEnter={() => setHoveredTab(order.code)}
        onMouseLeave={() => setHoveredTab(null)}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <span>{`Đơn hàng ${index + 1} (${order.code})`}</span>
        {hoveredTab === order.code && (
          <Button
            type="text"
            danger
            size="small"
            onClick={() => removeOrder(order.id)} // Sửa targetKey thành order.id
            style={{ marginLeft: 8 }}
          >
            X
          </Button>
        )}
      </div>
    ),
    children: <OrderItem props={order} index={index + 1} onSuccess={() => loadOrders()} />,
  }));

  return (
    <>
      <div className="d-flex">
        <div className="flex-grow-1">
          <Button onClick={() => creatOrder()} className="bg-warning text-dark" type="primary" loading={waitCreate}>
            Tạo mới đơn hàng
          </Button>
        </div>
      </div>
      <div className="mt-3">
        <Tabs items={tabsItems} />
      </div>
    </>
  );
}

export default Orders;
