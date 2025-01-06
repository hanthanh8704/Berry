package com.example.be.utils.websockets;


import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@Slf4j
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    /**
     * @Configuration: Đánh dấu lớp này như một lớp cấu hình trong Spring.
     * @EnableWebSocketMessageBroker: Kích hoạt khả năng sử dụng WebSocket với STOMP và
     * các cấu hình liên quan tới message broker trong Spring.
     */

    /**
     * Phương thức này đăng ký các điểm kết nối STOMP (một giao thức WebSocket) mà client có thể kết nối đến.
     * registry.addEndpoint("/shirt-ws"): Đăng ký endpoint WebSocket với tên là /shirt-ws, mà client có thể kết nối đến.
     * .setAllowedOrigins("http://localhost:3000/", "http://192.168.11.103:8080/"): Chỉ định các domain (các địa chỉ nguồn)
     * được phép kết nối đến WebSocket. Đây là biện pháp bảo mật, giúp ngăn chặn các kết nối từ các nguồn không được phép.
     * .withSockJS(): Cho phép sử dụng SockJS để fallback trong trường hợp WebSocket không hỗ trợ hoặc bị chặn.
     */

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/shoes-websocket-endpoint")
                .setAllowedOrigins("http://localhost:3000/",
                        "http://192.168.11.103:8080/"
                )
                .withSockJS();
    }


    /**
     * Cấu hình message broker, đây là nơi các tin nhắn sẽ được gửi đi và nhận lại.
     * registry.enableSimpleBroker("/topic"): Kích hoạt một message broker đơn giản, nơi các client có thể
     * đăng ký (subscribe) tới các chủ đề bắt đầu bằng /topic.
     * registry.setApplicationDestinationPrefixes("/app"): Xác định các prefix cho các destination mà client
     * có thể gửi tin nhắn tới (thường dùng để gọi các phương thức trên server).
     */
    // Khi cấu hình


    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }
}
