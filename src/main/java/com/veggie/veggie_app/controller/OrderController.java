package com.veggie.veggie_app.controller;

import com.veggie.veggie_app.dto.OrderRequest;
import com.veggie.veggie_app.model.Order;
import com.veggie.veggie_app.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request, Authentication authentication) {
        try {
            // Spring Security automatically extracts the user's email from the valid JWT token!
            String userEmail = authentication.getName();
            Order order = orderService.placeOrder(request, userEmail);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllSystemOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}