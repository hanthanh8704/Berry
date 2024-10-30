package com.example.be.utils.common;

import com.example.be.utils.constant.PaginationConstant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class PageableRequest {

    private int page = PaginationConstant.DEFAULT_PAGE;
    private int sizePage = PaginationConstant.DEFAULT_SIZE;
}