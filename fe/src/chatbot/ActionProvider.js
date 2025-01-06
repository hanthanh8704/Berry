import { createChatBotMessage } from "react-chatbot-kit";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  greet() {
    const message = this.createChatBotMessage("Xin chào! Tôi là trợ lý của bạn. Hôm nay bạn cần gì? Tôi có thể giúp bạn tìm kiếm thông tin hoặc giải đáp thắc mắc.");
    this.updateChatbotState(message);
  }

  handleHelp() {
    const message = this.createChatBotMessage("Chào bạn, tôi có thể giúp bạn với các câu hỏi về sản phẩm, kích thước, giá cả và khuyến mãi. Bạn cần hỏi gì?");
    this.updateChatbotState(message);
  }

  handleProductQuery() {
    const message = this.createChatBotMessage("Sản phẩm của chúng tôi có nhiều màu sắc và kích thước khác nhau. Bạn có thể chọn theo sở thích hoặc tham khảo bảng kích thước trên trang.");
    this.updateChatbotState(message);
  }

  handleSizeQuery() {
    const message = this.createChatBotMessage("Chúng tôi cung cấp nhiều kích thước từ S đến XXL. Bạn có thể tham khảo bảng kích thước để chọn lựa phù hợp với mình.");
    this.updateChatbotState(message);
  }

  handleShippingQuery() {
    const message = this.createChatBotMessage("Chúng tôi cung cấp dịch vụ giao hàng miễn phí cho đơn hàng từ 500.000đ trở lên. Bạn sẽ nhận hàng trong vòng 3-5 ngày làm việc.");
    this.updateChatbotState(message);
  }

  handleReturnQuery() {
    const message = this.createChatBotMessage("Nếu bạn không hài lòng với sản phẩm, bạn có thể đổi trả trong vòng 14 ngày kể từ ngày nhận hàng. Vui lòng giữ lại hóa đơn và sản phẩm còn nguyên vẹn.");
    this.updateChatbotState(message);
  }

  handlePaymentQuery() {
    const message = this.createChatBotMessage("Chúng tôi chấp nhận thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng và thanh toán khi nhận hàng.");
    this.updateChatbotState(message);
  }

  handleDiscountQuery() {
    const message = this.createChatBotMessage("Bạn có thể nhận khuyến mãi và giảm giá nếu đăng ký nhận email của chúng tôi hoặc tham gia chương trình khách hàng thân thiết.");
    this.updateChatbotState(message);
  }

  defaultResponse() {
    const message = this.createChatBotMessage("Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi lại không?");
    this.updateChatbotState(message);
  }
  handleColorQuery() {
    const message = this.createChatBotMessage("Chúng tôi có nhiều màu sắc để bạn lựa chọn, bao gồm: đỏ, xanh, trắng, đen, và nhiều màu khác.");
    this.updateChatbotState(message);
  }

  handleMaterialQuery() {
    const message = this.createChatBotMessage("Sản phẩm của chúng tôi được làm từ nhiều chất liệu như cotton, polyester, lụa, và nhiều loại vải khác.");
    this.updateChatbotState(message);
  }

  handleBrandQuery() {
    const message = this.createChatBotMessage("Chúng tôi cung cấp sản phẩm từ các thương hiệu nổi tiếng như XYZ, ABC, và nhiều thương hiệu khác.");
    this.updateChatbotState(message);
  }

  handleCollarQuery() {
    const message = this.createChatBotMessage("Chúng tôi có các kiểu cổ áo như cổ tròn, cổ polo, cổ chữ V, và nhiều kiểu khác.");
    this.updateChatbotState(message);
  }

  handleSleeveQuery() {
    const message = this.createChatBotMessage("Các sản phẩm có nhiều kiểu tay áo như tay ngắn, tay dài, không tay, và tay lửng.");
    this.updateChatbotState(message);
  }

  handlePublicDiscountQuery() {
    const message = this.createChatBotMessage("Giảm giá công khai hiện có: giảm 10% toàn bộ sản phẩm trong tuần này.");
    this.updateChatbotState(message);
  }

  handlePersonalDiscountQuery() {
    const message = this.createChatBotMessage("Giảm giá cá nhân sẽ áp dụng cho tài khoản đã đăng ký. Hãy đăng nhập để kiểm tra ưu đãi riêng của bạn!");
    this.updateChatbotState(message);
  }

  handleAccountRequirement() {
    const message = this.createChatBotMessage("Để sử dụng dịch vụ giao hàng, bạn cần tạo tài khoản và cung cấp địa chỉ giao hàng chính xác.");
    this.updateChatbotState(message);
  }

  updateChatbotState(message) {
    // Cập nhật trạng thái chatbot
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

export default ActionProvider;
