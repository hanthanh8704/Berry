import { request } from "../../utilities/request.js";
export class StatisticalApi {
    static fetchAllStatisticalDay = () => {
      return request({
        method: "GET",
        url: `/api/statistical/day`,
      });
    };
    static fetchAllStatisticalMonth = () => {
      return request({
        method: "GET",
        url: `/api/statistical/month`,
      });
    };
    static fetchAllStatisticalStatusBill = (startDate, endDate) => {
      return request({
        method: "GET",
        url: `/api/statistical/status-bill`,
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });
    };
    static fetchAllStatisticalBestSellingProduct = (startDate, endDate) => {
      return request({
        method: "GET",
        url: `/api/statistical/best-selling-product`,
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });
    };
    static fetchBillByDate = (startDate, endDate) => {
      return request({
        method: "GET",
        url: `/api/statistical/bill-date`,
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });
    };
    static fetchAllStatisticalGrowth = () => {
      return request({
        method: "GET",
        url: `/api/statistical/growth`,
      });
    };
    static fetchAllStatisticalStock = () => {
      return request({
        method: "GET",
        url: `/api/statistical/stock`,
      });
    };

  }