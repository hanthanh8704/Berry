package com.example.connectdb.dto.request.productDetail;

import com.example.connectdb.util.common.PageableRequest;
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
    private String mausac;
    private String kichco;
    private String tayao;
    private String sanpham;
    private String chatlieu;
    private String coao;
    private List<String> sanphams;
    private List<String> mausacs;
    private List<String> kichcos;
    private List<String> tayaos;
    private List<String> chatlieus;
    private List<String> coaos;
    private Boolean deleted;
    private String ten;

}
