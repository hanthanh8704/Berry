import numeral from "numeral";

export const formatCurrency = (money) => {
  return numeral(money).format("0,0") + " VND";
};
