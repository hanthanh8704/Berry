import axios from "axios";

const httpRequest = axios.create({
  baseURL: "http://localhost:8080",
});

export class BillApi {
  static fetchAll = (filter) => {
    return httpRequest.get(`/admin/bill`, {
      params: {
        startTimeString: filter.startTimeString,
        endTimeString: filter.endTimeString,
        status: filter.status,
        endDeliveryDateString: filter.endDeliveryDateString,
        startDeliveryDateString: filter.startDeliveryDateString,
        key: filter.key,
        employees: filter.employees,
        user: filter.user,
        phoneNumber: filter.phoneNumber,
        type: filter.type,
        page: filter.page,
      }
    });
  };

  static fetchAllBillAtCounter = () => {
    return httpRequest.get(`/admin/bill/details-invoices-counter`);
  };

  static fetchAllFilePdfByIdBill = (data) => {
    return httpRequest.put(`/admin/bill/invoice-all-pdf`, data);
  };

  static fetchCountPayMentPostpaidByIdBill = (id) => {
    return httpRequest.get(`/admin/bill/count-paymet-post-paid/${id}`);
  };

  static fetchHtmlIdBill = (id, totalExcessMoney) => {
    return httpRequest.get(`/admin/bill/invoice-pdf/${id}/${totalExcessMoney}`);
  };

  static fetchDataUsers = () => {
    return httpRequest.get(`/admin/bill/user-bill`);
  };

  static fetchAllProductsInBillByIdBill = (data) => {
    return httpRequest.get(`/admin/bill-detail`, { params: data });
  };

  static fetchDetailBill = (id) => {
    return httpRequest.get(`/admin/bill/detail/${id}`);
  };

  static fetchAllHistoryInBillByIdBill = (id) => {
    return httpRequest.get(`/admin/bill-history/${id}`);
  };

  static changeStatusBill = (id, data) => {
    return httpRequest.put(`/admin/bill/change-status/${id}`, null, { params: data });
  };

  static rollBackStatusBill = (id, data) => {
    return httpRequest.put(`/admin/bill/roll-back-bill/${id}`, null, { params: data });
  };

  static updateBill = (id, data) => {
    return httpRequest.put(`/admin/bill/update-offline/${id}`, data);
  };

  static updateBillWait = (data) => {
    return httpRequest.put(`/admin/bill/update-bill-wait`, data);
  };

  static changeCancelStatusBill = (id, data) => {
    return httpRequest.put(`/admin/bill/cancel-status/${id}`, null, { params: data });
  };

  static createBillWait = (data) => {
    return httpRequest.post(`/admin/bill`, data);
  };

  static getAllBillWait = () => {
    return httpRequest.get(`/admin/bill/details-invoices-counter`);
  };

  static getDetaiProductInBill = (id) => {
    return httpRequest.get(`/admin/bill-detail/detail/${id}`);
  };

  static addProductInBill = (data) => {
    return httpRequest.post(`/admin/bill-detail/add-product`, data);
  };

  static removeProductInBill = (id, idProduct, note) => {
    return httpRequest.delete(`/admin/bill-detail/remove/${id}/${idProduct}`, { params: { note } });
  };

  static fetchAllStatusBill = () => {
    return httpRequest.get(`/admin/bill/status-bill`);
  };

  static updateProductInBill = (id, data) => {
    return httpRequest.put(`/admin/bill-detail/${id}`, data);
  };

  static refundProduct = (data) => {
    return httpRequest.put(`/admin/bill-detail/refund`, data);
  };

  static changeStatusAllBillByIds = (data) => {
    return httpRequest.put(`/admin/bill/change-status-bill`, data);
  };

  static getCodeBill = () => {
    return httpRequest.get(`/admin/bill/code-bill`);
  };

  static ChangeAllEmployeeInBill = (data) => {
    return httpRequest.put(`/admin/bill/change-all-employee`, data);
  };

  static ChangeEmployeeInBill = (data) => {
    return httpRequest.put(`/admin/bill/change-employee`, data);
  };

  static BillGiveBackInformation = (codeBill) => {
    return httpRequest.get(`/admin/bill/give-back-information?codeBill=${codeBill}`);
  };

  static BillGiveBack = (idBill) => {
    return httpRequest.get(`/admin/bill/give-back`, { params: { idBill } });
  };

  static UpdateBillGiveBack = (data) => {
    return httpRequest.post(`/admin/bill/give-back`, data);
  };

  static UpdateShipBill = (data) => {
    return httpRequest.post(`/admin/bill/ship-bill`, data);
  };

  static sendMailGiveBack = (id) => {
    return httpRequest.post(`/admin/bill/send-mail-give-back/${id}`);
  };
}
