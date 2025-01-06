class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    // Chuyển tin nhắn về dạng chữ thường
    const lowerCaseMessage = message.toLowerCase();

    // Kiểm tra nội dung tin nhắn và gọi hành động tương ứng
    if (lowerCaseMessage.includes("xin chào") || lowerCaseMessage.includes("chào")) {
      this.actionProvider.greet();
    } else if (lowerCaseMessage.includes("giúp")) {
      this.actionProvider.handleHelp();
    } else if (lowerCaseMessage.includes("sản phẩm")) {
      this.actionProvider.handleProductQuery();
    } else if (lowerCaseMessage.includes("kích thước")) {
      this.actionProvider.handleSizeQuery();
    } else if (lowerCaseMessage.includes("màu sắc") || lowerCaseMessage.includes("màu")) {
      this.actionProvider.handleColorQuery();
    } else if (lowerCaseMessage.includes("chất liệu")) {
      this.actionProvider.handleMaterialQuery();
    } else if (lowerCaseMessage.includes("thương hiệu")) {
      this.actionProvider.handleBrandQuery();
    } else if (lowerCaseMessage.includes("cổ áo")) {
      this.actionProvider.handleCollarQuery();
    } else if (lowerCaseMessage.includes("tay áo")) {
      this.actionProvider.handleSleeveQuery();
    } else if (lowerCaseMessage.includes("giao hàng")) {
      if (lowerCaseMessage.includes("tài khoản")) {
        this.actionProvider.handleAccountRequirement();
      } else {
        this.actionProvider.handleShippingQuery();
      }
    } else if (lowerCaseMessage.includes("giảm giá")) {
      if (lowerCaseMessage.includes("công khai")) {
        this.actionProvider.handlePublicDiscountQuery();
      } else if (lowerCaseMessage.includes("cá nhân")) {
        this.actionProvider.handlePersonalDiscountQuery();
      } else {
        this.actionProvider.handleDiscountQuery();
      }
    } else if (lowerCaseMessage.includes("thanh toán")) {
      this.actionProvider.handlePaymentQuery();
    } else {
      this.actionProvider.defaultResponse();
    }
  }
}

export default MessageParser;
