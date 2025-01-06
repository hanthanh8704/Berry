package com.example.be.app.client_app.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientProductRequest {
    private String id;
    private String brand;
    private String material;
    private String color;
    private String sole;
    private String category;
    private String nameProductDetail;
}
