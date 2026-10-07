package com.veggie.veggie_app.service;

import com.veggie.veggie_app.dto.OrderItemRequest;
import com.veggie.veggie_app.dto.OrderRequest;
import com.veggie.veggie_app.model.Order;
import com.veggie.veggie_app.model.OrderItem;
import com.veggie.veggie_app.model.Product;
import com.veggie.veggie_app.model.User;
import com.veggie.veggie_app.repository.OrderRepository;
import com.veggie.veggie_app.repository.ProductRepository;
import com.veggie.veggie_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // @Transactional ensures that if any part of the order fails (like out of stock),
    // the entire process rolls back, preventing partial database updates.
    @Transactional
    public Order placeOrder(OrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Check if we have enough vegetables in stock
            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Deduct the purchased quantity from our stock
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            // Create the order item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());

            orderItems.add(orderItem);

            // Calculate running total: (Price * Quantity)
            BigDecimal itemTotal = product.getPrice().multiply(new BigDecimal(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        // Saving the order also saves the OrderItems because of CascadeType.ALL in our Entity!
        return orderRepository.save(order);
    }
}