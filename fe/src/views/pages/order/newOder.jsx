import React, { useState, useEffect } from 'react';
import * as request from 'views/utilities/httpRequest';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Tabs } from 'antd';
import OrderItem from './oderItem';

function Orders() {
  const [listHoaDon, setListHoaDon] = useState([]);
  const [waitCreate, setWaitCreate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadOrders();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const loadOrders = () => {
    request
      .get(`/bill/new-bill`, {
        params: {
          idEmployee: 1,
          invoiceStatus: 0 
        }
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
      try {
        await request
          .post('/bill', {})
          .then((response) => {
            if (response.status === 200) {
              toast.success('Tạo mới thành công');
              loadOrders();
            }
          })
          .catch((e) => {
            toast.error(e.response.data);
          });
        setWaitCreate(false);
      } catch (e) {}
    }, 3000);
    return () => clearTimeout(timeout);
  };

  return (
    <>
      <div className="d-flex" >
        <div className="flex-grow-1">
          <Button onClick={() => creatOrder()} className="bg-warning text-dark" type="primary" loading={waitCreate}>
            Tạo mới đơn hàng
          </Button>
        </div>
        <div className=""></div>
      </div>
      <div className="mt-3">
        <Tabs>
          {listHoaDon.length > 0 && listHoaDon.map((order, index) => (
            <Tabs.TabPane key={order.code} tab={`Đơn hàng ${index+1} (${order.code})`}>
              <OrderItem props={order} index={index + 1} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </>
  );
}

export default Orders;