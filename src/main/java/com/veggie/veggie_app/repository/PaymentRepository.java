package com.veggie.veggie_app.repository;

import com.veggie.veggie_app.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}