import numeral from "numeral";

const FormatCurrency1 = ({value}) => {
  // Định dạng số tiền thành tiền tệ Việt Nam (đ)
  return numeral(value).format("0,0");
};

export default FormatCurrency1;