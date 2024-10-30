package com.example.be.dto.admin.request.address;



import com.example.be.utils.common.PageableRequest;
import com.example.be.utils.constant.StatusCustomer;
import lombok.Getter;
import lombok.Setter;

/**
 * @author hanthanh
 */
@Getter
@Setter
public class FindAddressRequest extends PageableRequest {

    private String line;

    private String district;

    private String province;

    private String ward;

    private StatusCustomer status;

    private String id_user;

}
