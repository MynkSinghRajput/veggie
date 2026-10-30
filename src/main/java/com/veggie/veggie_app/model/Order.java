package com.veggie.veggie_app.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private String status;

    // =========================
    // DELIVERY DETAILS
    // =========================

    @Column(nullable = false)
    private String deliveryName;

    @Column(nullable = false)
    private String deliveryContact;

    @Column(nullable = false)
    private String houseNumber;

    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private String area;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String pincode;

    @Column(length = 500)
    private String deliveryInstructions;

    // =========================
    // ORDER ITEMS
    // =========================

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<OrderItem> orderItems;

    @Column(updatable = false)
    private LocalDateTime orderDate = LocalDateTime.now();

    @OneToOne(mappedBy = "order", fetch = FetchType.LAZY)
    private Payment payment;
}