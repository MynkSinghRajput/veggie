package com.veggie.veggie_app.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long userId; // In Phase 3, we will extract this from the JWT instead!
    private List<OrderItemRequest> items;
}