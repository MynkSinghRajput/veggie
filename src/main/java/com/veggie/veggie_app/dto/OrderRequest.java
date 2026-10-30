package com.veggie.veggie_app.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {

    private Long userId;

    private List<OrderItemRequest> items;

    // =========================
    // DELIVERY DETAILS
    // =========================

    private String deliveryName;

    private String deliveryContact;

    private String houseNumber;

    private String street;

    private String area;

    private String city;

    private String state;

    private String pincode;

    private String deliveryInstructions;
}