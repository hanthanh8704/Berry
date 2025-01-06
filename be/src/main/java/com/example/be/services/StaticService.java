package com.example.be.services;


import com.example.be.dto.admin.request.statistical.FindBillDateRequest;
import com.example.be.dto.admin.response.statistical.StatisticalBestSellingProductResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface StaticService {
    List<StatisticalBestSellingProductResponse> getAllStatisticalBestSellingProduct(FindBillDateRequest findBillDateRequest);
    List<StatisticalBestSellingProductResponse> getAllStatisticalBestSellingProductFindFiltered(FindBillDateRequest findBillDateRequest, Integer idKC, Integer idTH, Integer idMS, String price);

}

