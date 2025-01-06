import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Table, Tooltip, Button } from 'antd';
import '../statisticall/style-dashboard.css';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5percent from '@amcharts/amcharts5/percent';
import moment from 'moment';
import * as request from 'views/utilities/httpRequest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faCalendarWeek, faArrowUpRightDots, faArrowDownWideShort, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const DashBoard = () => {
  const [totalProductDay, setTotalProductDay] = useState([]);
  const [totalProductWeek, setTotalProductWeek] = useState([]);
  const [totalProductMonth, setTotalProductMonth] = useState([]);
  const [totalProductYear, setTotalProductYear] = useState([]);
  const [totalBillToday, setTotalBillToday] = useState([]);
  const [totalBillWeek, setTotalBillWeek] = useState([]);
  const [totalBillMonth, setTotalBillMonth] = useState([]);
  const [totalBillYear, setTotalBillYear] = useState([]);
  const [totalBillAmountDay, setTotalBillAmountDay] = useState([]);
  const [totalBillAmountWeek, setTotalBillAmountWeek] = useState([]);
  const [totalBillAmountMonth, setTotalBillAmountMonth] = useState([]);
  const [totalBillAmountYear, setTotalBillAmountYear] = useState([]);
  const [growthAmountDay, setGrowthAmoutDay] = useState([]);
  const [growthAmountWeek, setGrowthAmoutWeek] = useState([]);
  const [growthAmoutMonth, setGrowthAmoutMonth] = useState([]);
  const [growthAmoutYear, setGrowthAmoutYear] = useState([]);
  const [growthProductDay, setGrowthProductDay] = useState([]);
  const [growthProductWeek, setGrowthProductWeek] = useState([]);
  const [growthProductMonth, setGrowthProductMonth] = useState([]);
  const [growthProductYear, setGrowthProductYear] = useState([]);
  const [growthBillMonth, setGrowthBillMonth] = useState([]);
  const [growthBillDay, setGrowthBillDay] = useState([]);
  const [growthBillWeek, setGrowthBillWeek] = useState([]);
  const [growthBillYear, setGrowthBillYear] = useState([]);
  const [listSellingProduct, setListSellingProduct] = useState([]);
  const [listStockProduct, setListStockProduct] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateProduct, setStartDateProduct] = useState(null);
  const [endDateProduct, setEndDateProduct] = useState(null);
  const [activeButton, setActiveButton] = useState(3);
  const [typeFormat, setTypeFormat] = useState('month');
  const [nameTable, setNameTable] = useState('Tháng Này');

  // Hàm loadData lấy dữ liệu thống kê từ server cho các khoảng thời gian: năm, tháng, tuần, và ngày.
  const loadData = async () => {
    // Call API year
    try {
      const responseYear = await request.get('/statistical/year');
      const dataYear = responseYear.data[0]; // Lấy đối tượng đầu tiên trong mảng
      setTotalBillYear(dataYear.totalBillYear);
      setTotalBillAmountYear(formatCurrency(dataYear.totalBillAmountYear));
      setTotalProductYear(dataYear.totalProductYear);
      console.log('Số lượng đơn hàng năm:', dataYear.totalBillYear);
      console.log('Tổng số tiền năm:', dataYear.totalBillAmountYear);
      console.log('Tổng số sản phẩm bán ra trong năm:', dataYear.totalProductYear);
    } catch (error) {
      console.error('Error fetching year data:', error);
    }

    // Call API month
    try {
      const responseMonth = await request.get('/statistical/month');
      const dataMonth = responseMonth.data[0]; // Lấy đối tượng đầu tiên trong mảng
      setTotalBillMonth(dataMonth.totalBillMonth);
      setTotalBillAmountMonth(formatCurrency(dataMonth.totalBillAmountMonth));
      setTotalProductMonth(dataMonth.totalProductMonth);
      console.log('Số lượng đơn hàng tháng:', dataMonth.totalBillMonth);
      console.log('Tổng số tiền tháng:', dataMonth.totalBillAmountMonth);
      console.log('Tổng số sản phẩm bán ra trong tháng:', dataMonth.totalProductMonth);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu tháng:', err);
    }

    // Call API week
    try {
      const responseWeek = await request.get('/statistical/week');
      const dataWeek = responseWeek.data[0]; // Lấy đối tượng đầu tiên trong mảng
      setTotalBillWeek(dataWeek.totalBillWeek);
      setTotalBillAmountWeek(formatCurrency(dataWeek.totalBillAmountWeek));
      setTotalProductWeek(dataWeek.totalProductWeek);
      console.log('Số lượng đơn hàng tuần:', dataWeek.totalBillWeek);
      console.log('Tổng số tiền tuần:', dataWeek.totalBillAmountWeek);
      console.log('Tổng số sản phẩm bán ra trong tuần:', dataWeek.totalProductWeek);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu tuần:', err);
    }

    // Call API day
    try {
      const responseDay = await request.get('/statistical/day');
      const dataDay = responseDay.data[0]; // Lấy đối tượng đầu tiên trong mảng
      setTotalBillToday(dataDay.totalBillToday);
      setTotalBillAmountDay(formatCurrency(dataDay.totalBillAmountToday));
      setTotalProductDay(dataDay.totalProductDay);
      console.log('Số lượng đơn hàng ngày:', dataDay.totalBillToday);
      console.log('Số lương đơn trong ngày: ', totalBillToday)
      console.log('Tổng số tiền ngày:', dataDay.totalBillAmountToday);
      console.log('Tổng số sản phẩm bán ra trong ngày:', dataDay.totalProductDay);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu ngày:', err);
    }

    // Call API best selling product
    try {
      const response = await request.get('/statistical/best-selling-product', {
        params: { startDate, endDate }
      });
      console.log('Selling 106 : ', response);
      const data = response.data;
      console.log('Selling 108 : ', data);
      data.forEach((item, index) => {
        item.stt = index + 1;
      });

      setListSellingProduct(data);

      console.log('Danh sách sản phẩm bán chạy:', data);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm bán chạy:', err);
    }

    // Call API bill date
    try {
      const responseBillDate = await request.get('/statistical/bill-date', {
        params: { startDate, endDate }
      });
      console.log('responseBillDate : ', responseBillDate);

      // Kiểm tra dữ liệu trả về từ API
      const dataBill = responseBillDate.dataBill;
      console.log('Data bill 127:', dataBill);
      const dataProduct = responseBillDate.dataProduct;
      console.log('Data product 129:', dataProduct);

      const dateBillList = [];
      const dateProductList = [];

      // Xử lý dữ liệu bill
      dataBill.forEach((item) => {
        console.log('Item bill trước xử lý:', item);
        const date = new Date(Number(item.billDate));
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        dateBillList.push({
          totalBillDate: item.totalBillDate,
          billDate: formattedDate
        });
      });

      // Xử lý dữ liệu sản phẩm
      dataProduct.forEach((item) => {
        console.log('Item product trước xử lý:', item);
        const date = new Date(Number(item.billDate));
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        dateProductList.push({
          totalProductDate: item.totalProductDate,
          billDate: formattedDate
        });

        drawChart(Array.from(groupBill.values()), Array.from(groupProduct.values()));
      });

      // Log kết quả để kiểm tra
      console.log('Danh sách đơn hàng theo ngày:', dateBillList);
      console.log('Danh sách sản phẩm theo ngày:', dateProductList);
    } catch (err) {
      console.error('Lỗi khi gọi API bill date:', err);
    }

    // Call API status bill
    try {
      const responseStatusBill = await request.get('/statistical/status-bill', {
        params: { startDate, endDate }
      });
      console.log('Res api status bill:', responseStatusBill);
      const data = responseStatusBill.data;
      console.log('Data hiih : ', data);
      const statusMapping = {
        0: 'Tạo đơn hàng', // 0: Tạo đơn hàng
        1: 'Chờ xác nhận', // 1: Chờ xác nhận
        2: 'Xác nhận', // 2: Xác nhận
        3: 'Chờ vận chuyển', // 3: Chờ vận chuyển
        4: 'Vận chuyển', // 4: Vận chuyển
        5: 'Đã thanh toán', // 5: Đã thanh toán
        6: 'Thành công', // 6: Hoàn thành
        7: 'Đã hủy', // 7: Hủy
        8: 'Yêu cầu hủy',
        9: 'Thay đổi',
        10: 'Trả hàng'
      };

    
      const statusColors = {
        0: '#00D8FF', // Tạo đơn hàng
        1: '#FFCE56', // Chờ xác nhận
        2: '#9C27B0', // Xác nhận
        3: '#DD1B90', // Chờ vận chuyển
        4: '#41B883', // Vận chuyển
        5: '#E46651', // Đã thanh toán
        6: '#4CAF50', // Hoàn thành
        7: '#DD1B16', // Hủy
        8: '#138496',
        9: '#FF4500',
        10: '#6A5ACD'
      };
      const newDataPie = data.map((item) => ({
        category: statusMapping[item.statusBill] || item.statusBill,
        value: item.totalStatusBill,
        color: statusColors[item.statusBill] || item.statusBill
      }));
      drawChartPie(newDataPie);
    } catch (err) {
      console.error('Lỗi khi lấy trạng thái hóa đơn:', err);
    }

    // Call API growth
    try {
      const response = await request.get('/statistical/growth');
      const data = response;
      console.log('Response data growth:', data); // Log toàn bộ dữ liệu response

      // Khởi tạo các biến và dữ liệu cần thiết
      let dataGrowthDay = 0;
      let dataGrowthMonth = 0;
      let dataGrowthYear = 0;
      let dataGrowthBillMonth = 0;
      let dataGrowthProductMonth = 0;
      let dataGrowthBillDay = 0;

      let dataDay = dataGrowth.listDay[0]?.totalBillAmountToday || 0;
      let dataDayPrevious = dataGrowth.listDayPrevious[0]?.totalBillAmountToday || 0;
      let dataMonth = dataGrowth.listMonth[0]?.totalBillAmount || 0;
      let dataMonthPrevious = dataGrowth.listMonthPrevious[0]?.totalBillAmount || 0;
      let dataYear = dataGrowth.listYear[0]?.totalBillAmount || 0;
      let dataYearPrevious = dataGrowth.listYearPrevious[0]?.totalBillAmount || 0;

      let dataProductMonth = dataGrowth.listMonth[0]?.totalProduct || 0;
      let dataProductMonthPrevious = dataGrowth.listMonthPrevious[0]?.totalProduct || 0;

      let dataBillDay = dataGrowth.listDay[0]?.totalBillToday || 0;
      let dataBillDayPrevious = dataGrowth.listDayPrevious[0]?.totalBillToday || 0;

      let dataBillMonth = dataGrowth.listMonth[0]?.totalBill || 0;
      let dataBillMonthPrevious = dataGrowth.listMonthPrevious[0]?.totalBill || 0;


      // Tính toán các tỷ lệ tăng trưởng
      if (dataDayPrevious != null && dataDayPrevious !== 0) {
        dataGrowthDay = ((dataDay - dataDayPrevious) / dataDayPrevious) * 100;
      }
      if (dataMonthPrevious != null && dataMonthPrevious !== 0) {
        dataGrowthMonth = ((dataMonth - dataMonthPrevious) / dataMonthPrevious) * 100;
      }
      if (dataYearPrevious != null && dataYearPrevious !== 0) {
        dataGrowthYear = ((dataYear - dataYearPrevious) / dataYearPrevious) * 100;
      }
      if (dataProductMonthPrevious != null && dataProductMonthPrevious !== 0) {
        dataGrowthProductMonth = ((dataProductMonth - dataProductMonthPrevious) / dataProductMonthPrevious) * 100;
      }
      if (dataBillMonthPrevious != null && dataBillMonthPrevious !== 0) {
        dataGrowthBillMonth = ((dataBillMonth - dataBillMonthPrevious) / dataBillMonthPrevious) * 100;
      }
      if (dataBillDayPrevious != null && dataBillDayPrevious !== 0) {
        dataGrowthBillDay = ((dataBillDay - dataBillDayPrevious) / dataBillDayPrevious) * 100;
      }

      // Log các tỷ lệ tăng trưởng
      console.log('Tăng trưởng ngày:', dataGrowthDay);
      console.log('Tăng trưởng tháng:', dataGrowthMonth);
      console.log('Tăng trưởng năm:', dataGrowthYear);
      console.log('Tăng trưởng sản phẩm tháng:', dataGrowthProductMonth);
      console.log('Tăng trưởng hóa đơn tháng:', dataGrowthBillMonth);
      console.log('Tăng trưởng hóa đơn ngày:', dataGrowthBillDay);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu tăng trưởng:', err);
    }

    // Call API stock
    try {
      const response = await request.get('/statistical/stock');
      const data = response.data;
      console.log('Hihiiiiiiiiiiiiiiiiiiiiii 300 : ', data);
      setListStockProduct(data);
      console.log('List Stock Product:', listStockProduct);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu tồn kho:', err);
    }
  };
  // Gọi loadData khi component được render lần đầu
  useEffect(() => {
    loadData();
  }, []);

  // Hàm formatDate chuyển timestamp thành chuỗi ngày (ngày/tháng/năm).
  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Hàm formatCurrency định dạng số thành tiền tệ VND.
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      currencyDisplay: 'code'
    });
    return formatter.format(value);
  };

  // Hàm formattedPercentage định dạng số thành tỷ lệ phần trăm, với hai số thập phân.
  const formattedPercentage = (number) => {
    const roundedNumber = Math.round(number * 100) / 100;
    return `${roundedNumber} %`;
  };

  // Hàm drawChart tạo biểu đồ tròn hiển thị dữ liệu.
  const drawChartPie = (data) => {
    am5.array.each(am5.registry.rootElements, function (root) {
      if (root) {
        if (root.dom.id == 'chartdivPie') {
          root.dispose();
        }
      }
    });
    let element = document.getElementById('chartdivPie');
    if (element != null) {
      let root = am5.Root.new('chartdivPie');
      root.setThemes([am5themes_Animated.new(root)]);
      root._logo.dispose();

      // Tạo biểu đồ tròn
      var chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout
        })
      );

      // Tạo series cho biểu đồ tròn
      var series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: 'value',
          categoryField: 'category'
        })
      );

      // Gán dữ liệu cho series
      series.data.setAll(data);

      // Tạo legend (chú thích)
      var legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.percent(50),
          x: am5.percent(50),
          marginTop: 15,
          marginBottom: 15
        })
      );

      legend.data.setAll(series.dataItems);

      // Hiệu ứng xuất hiện ban đầu của series
      series.appear(1000, 100);
    }
  };

  // Cấu hình các cột cho bảng sản phẩm đã bán
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt'
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={text} alt="Ảnh sản phẩm" style={{ width: '90px', borderRadius: '10%', height: '90px' }} />
        </div>
      )
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Số lượng đã bán',
      dataIndex: 'sold',
      key: 'sold'
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatCurrency(price) // Hiển thị giá tiền với định dạng VND
    }
  ];

  const columnsStock = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      sorter: (a, b) => a.stt - b.stt,
      width: 50
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={text} alt="Ảnh sản phẩm" style={{ width: '90px', borderRadius: '10%', height: '90px' }} />
        </div>
      )
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Giá Bán',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (text) => formatCurrency(text)
    },
    {
      title: 'Số lượng còn lại',
      dataIndex: 'sold',
      key: 'sold',
      sorter: (a, b) => a.sold - b.sold,
      align: 'center',
      // width: 60
      width: 190
    }
  ];

  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  };

  const handleStartDateProduct = (event) => {
    const startDate = event.target.value;  
    const startDateWithoutTime = moment(startDate).startOf('day').toDate();  
    setStartDateProduct(startDateWithoutTime);
    loadDataProductSelling(startDateWithoutTime, endDateProduct);
    loadDataChartColumn(startDateWithoutTime, endDateProduct);
    loadDataStatusBill(startDateWithoutTime, endDateProduct);
    let endDate = '';
    if (endDateProduct == null) {
      endDate = new Date();
    } else {
      endDate = new Date(endDateProduct);
    }
    setNameTable('Từ ' + moment(startDateWithoutTime).format('YYYY-MM-DD') + ' Đến ' + moment(endDate).format('YYYY-MM-DD'));
  };
  
  const handleEndDateProduct = (event) => {
    const endDate = event.target.value; 
    const endDateWithoutTime = moment(endDate).endOf('day').toDate(); 
    setEndDateProduct(endDateWithoutTime);
    loadDataProductSelling(startDateProduct, endDateWithoutTime);
    loadDataChartColumn(startDateProduct, endDateWithoutTime);
    loadDataStatusBill(startDateProduct, endDateWithoutTime);
    let startDate = '';
    if (startDateProduct == null) {
      startDate = new Date();
    } else {
      startDate = new Date(startDateProduct);
    }
    setNameTable('Từ ' + moment(startDate).format('YYYY-MM-DD') + ' Đến ' + moment(endDateWithoutTime).format('YYYY-MM-DD'));
  };
  

  // Hàm loadDataSellProduct hiển thị danh sách sản phẩm bán chạy
  const loadDataProductSelling = async (startDate, endDate) => {
    try {
      const response = await request.get('/statistical/best-selling-product', {
        params: { startDate, endDate }
      });

      const data = response.data;
      data.forEach((item, index) => {
        item.stt = index + 1;
      });

      setListSellingProduct(data);

      console.log('Danh sách sản phẩm bán chạy:', data);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm bán chạy:', err);
    }
  };

  // Hàm loadDataStatusBill hiển thị danh sách hóa đơn theo trạng thái trong một khoảng thời gian nhất định.
  const loadDataStatusBill = async (startDate, endDate) => {
    try {
      const res = await get.request({
        url: '/statistical/bill-date',
        params: { startDate, endDate }
      });

      const data = res.data.data;
      console.log('Data sell product:', data);

      // Ánh xạ trạng thái hóa đơn sang tên tiếng Việt
      const statusMapping = {
        0: 'Tạo đơn hàng', // 0: Tạo đơn hàng
        1: 'Chờ xác nhận', // 1: Chờ xác nhận
        2: 'Xác nhận', // 2: Xác nhận
        3: 'Chờ vận chuyển', // 3: Chờ vận chuyển
        4: 'Vận chuyển', // 4: Vận chuyển
        5: 'Đã thanh toán', // 5: Đã thanh toán
        6: 'Hoàn thành', // 6: Hoàn thành
        7: 'Hủy' // 7: Hủy
      };

      const statusColors = {
        0: '#00D8FF', // Tạo đơn hàng
        1: '#FFCE56', // Chờ xác nhận
        2: '#9C27B0', // Xác nhận
        3: '#DD1B90', // Chờ vận chuyển
        4: '#41B883', // Vận chuyển
        5: '#E46651', // Đã thanh toán
        6: '#4CAF50', // Hoàn thành
        7: '#DD1B16' // Hủy
      };

      // Xử lý dữ liệu cho biểu đồ
      const newDataPie = data.map((item) => ({
        category: statusMapping[item.statusBill] || item.statusBill,
        value: item.totalStatusBill,
        color: statusColors[item.statusBill] || '#000000'
      }));

      drawChartPie(newDataPie); // Vẽ biểu đồ tròn với dữ liệu đã xử lý
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  // Hàm loadDataChartColumn hiển thị biểu đồ cột cho danh sách hóa đơn và sản phẩm theo ngày
  // const loadDataChartColumn = async (startDate, endDate) => {
  //   try {
  //     const responseBillDate = await request.get('/statistical/bill-date', {
  //       params: { startDate, endDate }
  //     });
  //     console.log('responseBillDate:', responseBillDate);

  //     // Kiểm tra dữ liệu trả về từ API
  //     const dataBill = responseBillDate.dataBill;
  //     const dataProduct = responseBillDate.dataProduct;
  //     console.log('Data bill 1111111zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz:', dataBill);
  //     console.log('Data 1111111zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz342413:', dataProduct);

  //     const dateBillList = [];
  //     const dateProductList = [];

  //     // Xử lý dữ liệu bill
  //     dataBill.forEach((item) => {
  //       console.log('Item bill trước xử lý:', item);
  //       const date = new Date(Number(item.billDate));
  //       const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  //       dateBillList.push({
  //         totalBillDate: item.totalBillDate,
  //         billDate: formattedDate
  //       });
  //     });

  //     // Xử lý dữ liệu sản phẩm
  //     dataProduct.forEach((item) => {
  //       console.log('Item product trước xử lý:', item);
  //       const date = new Date(Number(item.billDate));
  //       const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  //       dateProductList.push({
  //         totalProductDate: item.totalProductDate,
  //         billDate: formattedDate
  //       });
  //     });

  //     // Nhóm dữ liệu theo ngày
  //     const groupBill = new Map();
  //     dateBillList.forEach((item) => {
  //       groupBill.set(item.billDate, (groupBill.get(item.billDate) || 0) + item.totalBillDate);
  //     });

  //     const groupProduct = new Map();
  //     dateProductList.forEach((item) => {
  //       groupProduct.set(item.billDate, (groupProduct.get(item.billDate) || 0) + item.totalProductDate);
  //     });

  //     // Vẽ biểu đồ sau khi xử lý xong dữ liệu
  //     drawChart(Array.from(groupBill.values()), Array.from(groupProduct.values()));

  //     // Log kết quả để kiểm tra
  //     console.log('Danh sách đơn hàng theo ngày:', Array.from(groupBill.entries()));
  //     console.log('Danh sách sản phẩm theo ngày:', Array.from(groupProduct.entries()));
  //   } catch (err) {
  //     console.error('Lỗi khi gọi API bill date:', err);
  //   }
  // };

  const loadDataChartColumn = async (startDate, endDate) => {
    try {
      const responseBillDate = await request.get('/statistical/bill-date', {
        params: { startDate, endDate }
      });
  
      const dataBill = responseBillDate.dataBill;
      const dataProduct = responseBillDate.dataProduct;
      console.log('Data bill 1111111zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz:', dataBill);
      console.log('Data 1111111zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz342413:', dataProduct);

      const dateBillList = [];
      const dateProductList = [];
  
      dataBill.forEach((item) => {
        const date = new Date(Number(item.billDate));
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        dateBillList.push({
          totalBillDate: item.totalBillDate,
          billDate: formattedDate
        });
      });
  
      dataProduct.forEach((item) => {
        const date = new Date(Number(item.billDate));
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        dateProductList.push({
          totalProductDate: item.totalProductDate,
          billDate: formattedDate
        });
      });
  
      const groupBill = new Map();
      dateBillList.forEach((item) => {
        groupBill.set(item.billDate, (groupBill.get(item.billDate) || 0) + item.totalBillDate);
      });
  
      const groupProduct = new Map();
      dateProductList.forEach((item) => {
        groupProduct.set(item.billDate, (groupProduct.get(item.billDate) || 0) + item.totalProductDate);
      });
  
      drawChart(
        Array.from(groupBill, ([billDate, totalBillDate]) => ({ billDate, totalBillDate })),
        Array.from(groupProduct, ([billDate, totalProductDate]) => ({ billDate, totalProductDate }))
      );
  
    } catch (err) {
      console.error('Lỗi khi gọi API bill date:', err);
    }
  };
  

  const drawChart = (dataBill, dataProduct) => {
    var colorsSES11 = "";
    var colorsSES21 = "";

    colorsSES21 = 0xf37021;
    colorsSES11 = 0xffd4a6;

    am5.array.each(am5.registry.rootElements, function (root) {
      if (root) {
        if (root.dom.id == "chartdivChart") {
          root.dispose();
        }
      }
    });
    let element = document.getElementById("chartdivChart");
    if (element != null) {
      am5.ready(function () {
        let root = am5.Root.new("chartdivChart");
        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element

        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([am5themes_Animated.new(root)]);

        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        let chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: root.verticalLayout,
          })
        );

        root._logo.dispose();

        // Add scrollbar
        // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
        chart.set(
          "scrollbarX",
          am5.Scrollbar.new(root, {
            orientation: "horizontal",
          })
        );
        let scrollbarX = chart.get("scrollbarX");

        scrollbarX.thumb.setAll({
          fill: am5.color(0x550000),
          fillOpacity: 0.1,
        });

        scrollbarX.startGrip.setAll({
          visible: true,
        });

        scrollbarX.endGrip.setAll({
          visible: true,
        });

        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/

        let xRenderer = am5xy.AxisRendererX.new(root, {
          minGridDistance: 10,
          cellStartLocation: 0.2,
          cellEndLocation: 0.8,
        });

        xRenderer.labels.template.setAll({
          rotation: -70,
          paddingTop: -20,
          paddingRight: 10,
          fontSize: 10,
        });

        let xAxis = chart.xAxes.push(
          am5xy.CategoryAxis.new(root, {
            categoryField: "billDate",
            maxDeviation: 0,
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {}),
          })
        );
        let xAxis2 = chart.xAxes.push(
          am5xy.CategoryAxis.new(root, {
            categoryField: "billDate",
            maxDeviation: 0,
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {}),
          })
        );
        var nameComp = "Hóa đơn";
        var nameNow = "Sản phẩm";

        xAxis.data.setAll(dataBill);
        xAxis2.data.setAll(dataProduct);

        let yRenderer = am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1,
        });

        let yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            maxDeviation: 1,
            min: 0,
            renderer: yRenderer,
          })
        );
        yAxis.children.moveValue(
          am5.Label.new(root, {
            text: `Số lượng`,
            rotation: -90,
            y: am5.p50,
            centerX: am5.p50,
          }),
          0
        );
        var series1 = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: nameComp,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "totalBillDate",
            categoryXField: "billDate",
            tooltip: am5.Tooltip.new(root, {
              pointerOrientation: "horizontal",
              labelText: "Hóa đơn: {valueY}",
            }),
            fill: am5.color(colorsSES11),
          })
        );

        yRenderer.grid.template.set("strokeOpacity", 0.05);
        yRenderer.labels.template.set("fill", series1.get("fill"));
        yRenderer.setAll({
          stroke: series1.get("fill"),
          strokeOpacity: 1,
          opacity: 1,
        });

        series1.columns.template.setAll({
          width: am5.percent(40),
          tooltipY: am5.percent(30),
          templateField: "columnSettings",
          dx: -25,
        });

        series1.columns.template.set(
          "fillGradient",
          am5.LinearGradient.new(root, {
            stops: [
              {
                color: am5.color(0x297373),
                offset: 0.7,
              },
              {
                color: am5.color(0x946b49),
              },
            ],
            rotation: 90,
          })
        );

        series1.data.setAll(dataBill);

        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

        var series2 = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: nameNow,
            xAxis: xAxis2,
            yAxis: yAxis,
            valueYField: "totalProductDate",
            categoryXField: "billDate",
            clustered: false,
            tooltip: am5.Tooltip.new(root, {
              labelText: "Sản phẩm: {valueY}",
            }),
            fill: am5.color(colorsSES21),
          })
        );

        series2.columns.template.setAll({
          width: am5.percent(35),
          templateField: "columnSettings",
          dx: 0,
        });

        series2.columns.template.set(
          "fillGradient",
          am5.LinearGradient.new(root, {
            stops: [
              {
                color: am5.color(0xff621f),
              },
              {
                color: am5.color(0x946b49),
              },
            ],
            rotation: 90,
          })
        );

        series2.data.setAll(dataProduct);

        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        let cursor = chart.set(
          "cursor",
          am5xy.XYCursor.new(root, {
            behavior: "zoomX",
          })
        );
        cursor.lineY.set("visible", false);

        // Add legend
        // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
        let legend = chart.children.push(
          am5.Legend.new(root, {
            centerX: am5.p50,
            x: am5.p50,
          })
        );
        legend.data.setAll(chart.series.values);

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        chart.appear(1000, 100);
        series1.appear();

        // xAxis.events.once("datavalidated", function (ev) {
        //   ev.target.zoomToIndexes(dataBill.length - 20, dataProduct.length);
        // });
      });
    }
  };

  

  useEffect(() => {

    if (startDate && endDate) {
      loadDataChartColumn(startDate, endDate);
    } else {
      loadDataChartColumn(null, null);
    }
  }, [startDate, endDate]);

  const onChangeValueOption = async (option) => {
    setActiveButton(option); 
    const date = new Date();
    let startDate = '';
    let endDate = '';


    if (option == 1) {
      setNameTable('Hôm Nay');
      setTypeFormat('date');
      startDate = moment(new Date()).format('YYYY-MM-DD');
      endDate = moment(new Date()).format('YYYY-MM-DD');
    } else if (option == 2) {
      date.setDate(date.getDate() - 7);
      startDate = moment(date).format('YYYY-MM-DD');
      endDate = moment(new Date()).format('YYYY-MM-DD');
      setNameTable('Trong 7 Ngày');
      setTypeFormat('week');
    } else if (option == 3) {
      setNameTable('Trong Tháng Này');
      setTypeFormat('month');
    } else if (option == 4) {
      setNameTable('Trong Năm Nay');
      startDate = moment(new Date()).format('YYYY') + '-01-01';
      endDate = moment(new Date()).format('YYYY') + '-12-31';
    } else {
      startDate = moment(date).format('YYYY-MM-DD');
      endDate = moment(new Date()).format('YYYY-MM-DD');
      setTypeFormat('date');
      setNameTable('Từ ' + startDate + ' Đến ' + endDate);
    }

    // Gọi các hàm tải dữ liệu và vẽ biểu đồ với khoảng thời gian đã chọn
    loadDataProductSelling(startDate, endDate);
    loadDataChartColumn(startDate, endDate);
    loadDataStatusBill(startDate, endDate);
  };

  const handleImportFile = async () => {
    try {
      const responseBillDate = await request.get('/statistical/download/xlsx', {
        responseType: 'blob'
      });
      console.log("Data excel : ", responseBillDate);
      toast.success("Xuất file excel thành công");
      
      const blob = new Blob([responseBillDate], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      // Định dạng thời gian mà không sử dụng dấu ":" để tránh lỗi trên một số hệ điều hành
      const createDate = moment(new Date()).format("YYYY-MM-DD_HH-mm-ss");
      console.log("createDate", createDate);
      
      link.href = url;
      link.download = `BaoCaoThongKe_${createDate}.xlsx`; // Đặt tên file
      document.body.appendChild(link); // Thêm vào DOM để hỗ trợ một số trình duyệt
      link.click();
      document.body.removeChild(link); // Xóa khỏi DOM sau khi nhấn
  
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Lỗi khi tải file:", err);
      toast.error("Lỗi khi tải file Excel");
    }
  };  
  

  
  return (
    <div className='bg-white'>
      <div
        className="content-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span
          style={{
            fontSize: '35px',
            fontWeight: 'bold',
            marginTop: '30px',
            marginBottom: '20px',
            fontFamily: 'Times New Roman'
          }}
        >
          THỐNG KÊ
        </span>
      </div>
      <div>
        <Row className="row-header">
          <Col span={11} className="col-header-1">
            <div className="content-header-1">
              <h3 className="color-text-topic-1">Hôm nay</h3>
              <span className="color-text-contentt-1">Doanh thu đơn hàng: {totalBillAmountDay}</span>
              <span className="color-text-content-1">Sản phẩm đã bán: {totalProductDay}</span>
              <h5 className="color-text-content-1">
                Tổng số đơn hàng : {totalBillToday} 
              </h5>
            </div>
          </Col>

          <Col span={11} className="col-header-2">
            <div className="content-header-2">
              <h3 className="color-text-topic-2">Tuần này</h3>
              <span className="color-text-contentt-2">Doanh thu đơn hàng: {totalBillAmountWeek}</span>
              <span className="color-text-content-2">Sản phẩm đã bán: {totalProductWeek}</span>
              <h5 className="color-text-content-2">
                 Tổng số đơn hàng: {totalBillWeek}
              </h5>
            </div>
          </Col>
          <Col span={11} className="col-header-3">
            <div className="content-header-3">
              <h3 className="color-text-topic-3">Tháng này</h3>
              <span className="color-text-contentt-3">Doanh thu đơn hàng: {totalBillAmountMonth}</span>
              <span className="color-text-content-3">Sản phẩm đã bán: {totalProductMonth}</span>
              <h5 className="color-text-content-3">
                Tổng số đơn hàng: {totalBillMonth} 
              </h5>
            </div>
          </Col>
          <Col span={11} className="col-header-4">
            <div className="content-header-4">
              <h3 className="color-text-topic-4">Năm nay</h3>
              <span className="color-text-contentt-4">Doanh thu : {totalBillAmountYear} </span>
              <span className="color-text-content">Sản phẩm : {totalProductYear}</span>
              <h5 className="color-text-content">
                Tổng số đơn hàng : {totalBillYear} 
              </h5>
            </div>
          </Col>
        </Row>

        <Row style={{ marginTop: '300px', marginRight: '1%' }}>
          <Col span={24}>
            <div class="header-date">
              <br />
              <div style={{ position: 'relative' }}>
                <div className="option-time">
                  <Tooltip title="Download Excel Thống kê">
                    <Button
                       onClick={handleImportFile}
                      style={{
                        height: '38px',
                        backgroundColor: 'ButtonShadow'
                      }}
                    >
                      <span>
                        {' '}
                        <VerticalAlignBottomOutlined />
                      </span>
                      <span style={{ marginLeft: '10px' }}>
                        {' '}
                        <FontAwesomeIcon
                          icon={faFileExcel}
                          style={{
                            backgroundColor: 'white',
                            marginRight: '3px'
                          }}
                        />
                      </span>
                      <span> Excel</span>
                    </Button>
                  </Tooltip>
                  <button className="button-time" disabled>
                    Bộ lọc
                  </button>
                  <button className={activeButton === 1 ? 'button-time' : 'button-time-block'} onClick={() => onChangeValueOption(1)}>
                    Ngày
                  </button>
                  <button className={activeButton === 2 ? 'button-time' : 'button-time-block'} onClick={() => onChangeValueOption(2)}>
                    7 Ngày
                  </button>
                  <button className={activeButton === 3 ? 'button-time' : 'button-time-block'} onClick={() => onChangeValueOption(3)}>
                    Tháng
                  </button>
                  <button className={activeButton === 4 ? 'button-time' : 'button-time-block'} onClick={() => onChangeValueOption(4)}>
                    Năm
                  </button>

                  {activeButton === 5 && (
                    <>
                      <Input
                        className="button-time-from"
                        type="date"
                        //  value={new Date().toISOString().split('T')[0]}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={handleStartDateProduct}
                      />

                      <Input
                        className="button-time-to"
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        onChange={handleEndDateProduct}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* <Row className="row-body" justify={'center'}>
          <h2 style={{ marginLeft: 108 }}>Biểu Đồ Thống Kê Hóa Đơn Và Sản Phẩm {nameTable}</h2>
          <Row justify={'center'}>
            <Col>
              <div className="row-body-container">
                <div>
                  <div id="chartdivChart"></div>
                </div>
              </div>
            </Col>
          </Row>
        </Row> */}

        <Row className="row-footer">
          <Col className="row-footer-left">
            <h2 style={{ textAlign: 'center', margin: ' 1%' , fontSize : '25px', fontFamily: 'Times New Roman'}}>Top Sản Phẩm Bán Chạy {nameTable}</h2>
            <Table
              style={{ marginTop: '10px', height: '500px', fontFamily: 'Times New Roman'}}
              dataSource={listSellingProduct}
              rowKey="stt"
              columns={columns}
              pagination={{ pageSize: 3 }}
              scroll={{ y: 685 }}
              rowClassName={getRowClassName}
            />
            {/* <h2 style={{ textAlign: 'center', margin: ' 2%' , fontSize : '25px' , fontFamily: 'Times New Roman'}}>Sản phẩm sắp hết hàng</h2>
            <Table
              style={{ marginTop: '10px', fontFamily: 'Times New Roman'}}
              dataSource={[listStockProduct]}
              rowKey="stt"
              columns={columnsStock}
              pagination={{ pageSize: 3 }}
              scroll={{ y: 685 }}
              rowClassName={getRowClassName}
            /> */}
          </Col>

          <Col className="row-footer-right">
            <Row className="content-1 bg-white">
              <Col style={{ width: '800px', fontFamily: 'Times New Roman' }}>
                <h2 style={{ textAlign: 'center', margin: ' 3%' , fontSize : '25px', fontFamily: 'Times New Roman' }}>Trạng Thái Đơn Hàng {nameTable}</h2>
                <div id="chartdivPie"></div>
              </Col>
            </Row>

            {/* Tốc độ tăng trưởng */}

            <Row className="content-2 bg-white">
              <Col style={{ width: '900px' }}>
                <h2 style={{ textAlign: 'center', margin: ' 3%', color: 'black', fontSize : '25px', fontFamily: 'Times New Roman' }}>Tốc Độ Tăng Trưởng Cửa Hàng</h2>

                {/* Doanh thu tháng */}
                <Row className="content-child ">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h6 className="title">Doanh thu tháng</h6>
                  <h6 className="content-x">{totalBillAmountMonth}</h6>
                  {growthAmoutMonth < formattedPercentage(0) ? (
                    <>
                    <h6 className="content-y" style={{ color: '#00DD00' }}>
                      {' '}
                      <FontAwesomeIcon icon={faArrowUpRightDots} />
                    </h6>
                    <h6 className="content-z" style={{ color: '#00DD00' }}>
                      {' '}
                      {growthAmoutMonth}
                    </h6>
                  </>
                  ) : (
                    <>
                      <h6 className="content-y" style={{ color: '#00DD00' }}>
                        {' '}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#00DD00' }}>
                        {' '}
                        {growthAmoutMonth}
                      </h6>
                    </>
                  )}
                </Row>

                {/* Doanh thu năm */}
                <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h6 className="title">Doanh thu năm</h6>
                  <h6 className="content-x">{totalBillAmountYear}</h6>
                  {growthAmoutYear < formattedPercentage(0) ? (
                    <>
                      <h6 className="content-y" style={{ color: '#00DD00' }}>
                        {' '}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#00DD00' }}>
                        {' '}
                        {growthAmoutYear}
                      </h6>
                    </>
                  ) : (
                    <>
                      <h6 className="content-y" style={{ color: '#00DD00' }}>
                        {' '}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#00DD00' }}>
                        {' '}
                        {growthAmoutYear}
                      </h6>
                    </>
                  )}
                </Row>

                {/* Sản phẩm ngày */}
                {/* <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h6 className="title">Sản phẩm ngày</h6>
                  <h6 className="content-x">{totalProductDay} Sản phẩm</h6>
                  {growthProductDay < formattedPercentage(0) ? (
                    <>
                      <h6 className="content-y">
                        <FontAwesomeIcon icon={faArrowDownWideShort} style={{ color: '#FF0000' }} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#FF0000' }}>
                        {' '}
                        {growthProductDay}
                      </h6>
                    </>
                  ) : (
                    <>
                      <h6 className="content-y" style={{ color: '#00DD00' }}>
                        {' '}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#00DD00' }}>
                        {' '}
                        {growthProductDay}
                      </h6>
                    </>
                  )}
                </Row> */}

                {/* Sản phẩm tuần */}
                {/* <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h6 className="title">Sản phẩm tháng</h6>
                  <h6 className="content-x">{totalProductWeek} Sản phẩm</h6>
                  {growthProductWeek < formattedPercentage(0) ? (
                    <>
                      <h6 className="content-y">
                        <FontAwesomeIcon icon={faArrowDownWideShort} style={{ color: '#FF0000' }} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#FF0000' }}>
                        {' '}
                        {growthProductWeek}
                      </h6>
                    </>
                  ) : (
                    <>
                      <h6 className="content-y" style={{ color: '#00DD00' }}>
                        {' '}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#00DD00' }}>
                        {' '}
                        {growthProductWeek}
                      </h6>
                    </>
                  )}
                </Row> */}

                {/* Sản phẩm tháng */}
                <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h6 className="title">Sản phẩm tháng</h6>
                  <h6 className="content-x">{totalProductMonth} Sản phẩm</h6>
                  {growthProductMonth < formattedPercentage(0) ? (
                    <>
                    <h6 className="content-y" style={{ color: '#00DD00' }}>
                      {' '}
                      <FontAwesomeIcon icon={faArrowUpRightDots} />
                    </h6>
                    <h6 className="content-z" style={{ color: '#00DD00' }}>
                      {' '}
                      {growthAmoutMonth}
                    </h6>
                  </>
                  ) : (
                    <>
                      <h6 className="content-y" style={{ color: '#00DD00' }}>
                        {' '}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#00DD00' }}>
                        {' '}
                        {growthProductMonth}
                      </h6>
                    </>
                  )}
                </Row>

                {/* Sản phẩm năm */}
                <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h6 className="title">Sản phẩm tháng</h6>
                  <h6 className="content-x">{totalProductYear} Sản phẩm</h6>
                  {growthProductYear < formattedPercentage(0) ? (
                    <>
                      <h6 className="content-y" style={{ color: '#00DD00' }}>
                        {' '}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#00DD00' }}>
                        {' '}
                        {growthProductYear}
                      </h6>
                    </>
                  ) : (
                    <>
                      <h6 className="content-y" style={{ color: '#00DD00' }}>
                        {' '}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#00DD00' }}>
                        {' '}
                        {growthProductYear}
                      </h6>
                    </>
                  )}
                </Row>

                {/* Hóa đơn ngày */}
                {/* <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h6 className="title">Hóa đơn ngày</h6>
                  <h6 className="content-x">{totalBillDay} Hóa đơn</h6>
                  {growthBillDay < formattedPercentage(0) ? (
                    <>
                      <h6 className="content-y">
                        <FontAwesomeIcon icon={faArrowDownWideShort} style={{ color: '#FF0000' }} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#FF0000' }}>
                        {' '}
                        {growthBillDay}
                      </h6>
                    </>
                  ) : (
                    <>
                      <h6 className="content-y" style={{ color: '#00DD00' }}>
                        {' '}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#00DD00' }}>
                        {' '}
                        {growthBillDay}
                      </h6>
                    </>
                  )}
                </Row> */}

                {/* Hóa đơn tuần */}
                {/* <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h6 className="title">Hóa đơn tuần</h6>
                  <h6 className="content-x">{totalBillWeek} Hóa đơn</h6>
                  {growthBillWeek < formattedPercentage(0) ? (
                    <>
                      <h6 className="content-y">
                        <FontAwesomeIcon icon={faArrowDownWideShort} style={{ color: '#FF0000' }} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#FF0000' }}>
                        {' '}
                        {growthBillWeek}
                      </h6>
                    </>
                  ) : (
                    <>
                      <h6 className="content-y" style={{ color: '#00DD00' }}>
                        {' '}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#00DD00' }}>
                        {' '}
                        {growthBillWeek}
                      </h6>
                    </>
                  )}
                </Row> */}

                {/* Hóa đơn tháng */}
                <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h6 className="title">Hóa đơn tháng</h6>
                  <h6 className="content-x">{totalBillMonth} Hóa đơn</h6>
                  {growthBillMonth < formattedPercentage(0) ? (
                    <>
                    <h6 className="content-y" style={{ color: '#00DD00' }}>
                      {' '}
                      <FontAwesomeIcon icon={faArrowUpRightDots} />
                    </h6>
                    <h6 className="content-z" style={{ color: '#00DD00' }}>
                      {' '}
                      {growthAmoutMonth}
                    </h6>
                  </>
                  ) : (
                    <>
                      <h6 className="content-y" style={{ color: '#00DD00' }}>
                        {' '}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#00DD00' }}>
                        {' '}
                        {growthBillMonth}
                      </h6>
                    </>
                  )}
                </Row>

                {/* Hóa đơn năm */}
                <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h6 className="title">Hóa đơn tháng</h6>
                  <h6 className="content-x">{totalBillYear} Hóa đơn</h6>
                  {growthBillYear < formattedPercentage(0) ? (
                    <>
                      <h6 className="content-y" style={{ color: '#00DD00' }}>
                        {' '}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#00DD00' }}>
                        {' '}
                        {growthProductYear}
                      </h6>
                    </>
                  ) : (
                    <>
                      <h6 className="content-y" style={{ color: '#00DD00' }}>
                        {' '}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h6>
                      <h6 className="content-z" style={{ color: '#00DD00' }}>
                        {' '}
                        {growthBillYear}
                      </h6>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DashBoard;
