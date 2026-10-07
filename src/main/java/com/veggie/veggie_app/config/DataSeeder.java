package com.veggie.veggie_app.config;

import com.veggie.veggie_app.model.Category;
import com.veggie.veggie_app.model.Product;
import com.veggie.veggie_app.repository.CategoryRepository;
import com.veggie.veggie_app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only insert data if the database is completely empty
        if (productRepository.count() == 0) {
            Category veggies = new Category(null, "Vegetables", "Fresh organic vegetables", null);
            categoryRepository.save(veggies);

            productRepository.save(new Product(null, "Organic Tomatoes", "Fresh, juicy organic vine tomatoes.", new BigDecimal("4.99"), 100, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80", veggies));
            productRepository.save(new Product(null, "Crispy Carrots", "Crunchy farm-fresh carrots.", new BigDecimal("2.49"), 150, "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80", veggies));
            productRepository.save(new Product(null, "Green Broccoli", "High in fiber and vitamins.", new BigDecimal("3.99"), 50, "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500&q=80", veggies));
            productRepository.save(new Product(null, "Red Bell Peppers", "Sweet and crisp red peppers.", new BigDecimal("1.99"), 80, "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&q=80", veggies));

            System.out.println("Database seeded with fresh vegetables!");
        }
    }
}