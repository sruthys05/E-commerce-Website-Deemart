package com.deemart.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Positive
    private double price;

    private Double oldPrice;
    private String discount;
    private int rating;
    private String img;
    private String badge;

    @Column(length = 500)
    private String description;

    @Column(length = 50)
    private String category;

    private boolean featured;
    private boolean bestSelling;
    private boolean flashSale;

    private int stock;

    public Product() {}

    public Product(String name, double price, Double oldPrice, String discount, int rating, String img, String badge, String description, String category) {
        this.name = name;
        this.price = price;
        this.oldPrice = oldPrice;
        this.discount = discount;
        this.rating = rating;
        this.img = img;
        this.badge = badge;
        this.description = description;
        this.category = category;
        this.stock = 50;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public Double getOldPrice() { return oldPrice; }
    public void setOldPrice(Double oldPrice) { this.oldPrice = oldPrice; }
    public String getDiscount() { return discount; }
    public void setDiscount(String discount) { this.discount = discount; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getImg() { return img; }
    public void setImg(String img) { this.img = img; }
    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public boolean isBestSelling() { return bestSelling; }
    public void setBestSelling(boolean bestSelling) { this.bestSelling = bestSelling; }
    public boolean isFlashSale() { return flashSale; }
    public void setFlashSale(boolean flashSale) { this.flashSale = flashSale; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}