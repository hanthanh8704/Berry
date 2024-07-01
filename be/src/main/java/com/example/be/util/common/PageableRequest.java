package com.example.be.util.common;


import com.example.be.util.constant.PaginationConstant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class PageableRequest {

    private int page = PaginationConstant.DEFAULT_PAGE;
    private int sizePage = PaginationConstant.DEFAULT_SIZE;
}