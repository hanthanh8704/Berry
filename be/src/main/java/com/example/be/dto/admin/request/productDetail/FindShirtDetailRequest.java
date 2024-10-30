package com.example.be.dto.admin.request.productDetail;

import com.example.be.utils.common.PageableRequest;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@Builder
public class FindShirtDetailRequest extends PageableRequest {
    private Integer id;
    private String color; // mausac
    private String size; // kichco
    private String sleeve; // tayao
    private String product; // sanpham
    private String material; // chatlieu
    private String collar; // coao
    private String brand; // thuonghieu
    private  String category;

    private List<String> products; // sanphams
    private List<String> colors; // mausacs
    private List<String> sizes; // kichcos
    private List<String> sleeves; // tayaos
    private List<String> materials; // chatlieus
    private List<String> collars; // coaos
    private List<String> brands; // thuonghieus
    private  List<String> categorys;
    private Boolean deleted = false;
    private String name; // ten

}
