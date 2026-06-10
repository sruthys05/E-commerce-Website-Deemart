package com.deemart.config;

import com.deemart.entity.Product;
import com.deemart.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return;

        // Flash Sale Products
        productRepository.save(createProduct("HAVIT HV-G92 Gamepad", 120, 160.0, "-40%", 88,
                "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=270&h=250&fit=crop", null, "High quality gaming gamepad", "Gaming", true, false, false));
        productRepository.save(createProduct("IPS LCD Gaming Monitor", 370, 400.0, "-30%", 99,
                "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=270&h=250&fit=crop", null, "27 inch IPS LCD monitor", "Electronics", true, false, false));
        productRepository.save(createProduct("AK-900 Wired Keyboard", 960, 1160.0, null, 75,
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=270&h=250&fit=crop", null, "Mechanical wired keyboard with RGB", "Electronics", true, false, false));
        productRepository.save(createProduct("S-Series Comfort Chair", 375, 400.0, "-25%", 99,
                "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=270&h=250&fit=crop", null, "Ergonomic office chair", "Furniture", true, false, false));
        productRepository.save(createProduct("The north coat", 260, 360.0, null, 65,
                "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=270&h=250&fit=crop", null, "Premium winter coat", "Fashion", true, false, false));

        // Best Selling Products
        productRepository.save(createProduct("Gucci duffle bag", 960, 1160.0, null, 65,
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=270&h=250&fit=crop", null, "Luxury Gucci duffle bag", "Fashion", false, true, false));
        productRepository.save(createProduct("RGB liquid CPU Cooler", 160, 170.0, null, 65,
                "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=270&h=250&fit=crop", null, "High performance liquid cooler", "Electronics", false, true, false));
        productRepository.save(createProduct("Small BookSelf", 360, null, null, 65,
                "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=270&h=250&fit=crop", null, "Compact bookshelf for home", "Furniture", false, true, false));

        // Featured / Explore Products
        productRepository.save(createProduct("Breed Dry Dog Food", 100, null, null, 35,
                "https://images.unsplash.com/photo-1568572933382-74d440642117?w=270&h=250&fit=crop", null, "Nutritious dry dog food", "Pet Supplies", false, false, true));
        productRepository.save(createProduct("CANON EOS DSLR Camera", 360, null, null, 95,
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=270&h=250&fit=crop", null, "Professional DSLR camera", "Electronics", false, false, true));
        productRepository.save(createProduct("ASUS FHD Gaming Laptop", 700, null, null, 325,
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=270&h=250&fit=crop", null, "High performance gaming laptop", "Electronics", false, false, true));
        productRepository.save(createProduct("Curology Product Set", 500, null, null, 145,
                "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=270&h=250&fit=crop", null, "Skincare product set", "Beauty", false, false, true));
        productRepository.save(createProduct("Kids Electric Car", 960, null, null, 65,
                "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=270&h=250&fit=crop", "NEW", "Electric ride-on car for kids", "Toys", false, false, true));
        productRepository.save(createProduct("Jr. Zoom Soccer Cleats", 1160, null, null, 35,
                "https://images.unsplash.com/photo-1511882150382-421056c89033?w=270&h=250&fit=crop", null, "Professional soccer cleats", "Sports", false, false, true));
        productRepository.save(createProduct("GP11 Shooter USB Gamepad", 660, null, null, 55,
                "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=270&h=250&fit=crop", null, "USB gamepad for PC gaming", "Gaming", false, false, true));
        productRepository.save(createProduct("Quilted Satin Jacket", 660, null, null, 55,
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=270&h=250&fit=crop", null, "Stylish quilted satin jacket", "Fashion", false, false, true));

        // Additional products
        productRepository.save(createProduct("PlayStation 5", 499, null, null, 250,
                "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=270&h=250&fit=crop", null, "Next-gen gaming console", "Gaming", false, false, true));
        productRepository.save(createProduct("Wireless Headphones", 299, 350.0, "-15%", 180,
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=270&h=250&fit=crop", null, "Premium wireless headphones", "Electronics", false, false, false));
        productRepository.save(createProduct("Smart Watch", 199, 250.0, "-20%", 140,
                "https://images.unsplash.com/photo-1546868871-af0de0ae72c7?w=270&h=250&fit=crop", null, "Feature-rich smartwatch", "Electronics", false, false, false));
    }

    private Product createProduct(String name, double price, Double oldPrice, String discount, int rating,
                                   String img, String badge, String description, String category,
                                   boolean flashSale, boolean bestSelling, boolean featured) {
        Product p = new Product(name, price, oldPrice, discount, rating, img, badge, description, category);
        p.setFlashSale(flashSale);
        p.setBestSelling(bestSelling);
        p.setFeatured(featured);
        p.setStock(50);
        return p;
    }
}