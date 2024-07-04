package com.example.connectdb.dto.request.productDetail;

import com.example.connectdb.util.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class FindShirtDetailRequest extends PageableRequest {
    private Integer id;
    private String mausac;
    private String kichco;
    private String tayao;
    private String sanpham;
    private List<String> sanphams;
    private List<String> mausacs;
    private List<String> kichcos;
    private List<String> tayaos;
    private Boolean deleted;
    private String ten;


}
