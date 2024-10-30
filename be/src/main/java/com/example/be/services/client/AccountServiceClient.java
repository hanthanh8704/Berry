package com.example.be.services.client;

import com.example.be.dto.client.request.CustomerRequestClient;
import org.springframework.stereotype.Service;

@Service
public interface AccountServiceClient {
    CustomerRequestClient updateKH(Integer idKH , CustomerRequestClient request);
}
