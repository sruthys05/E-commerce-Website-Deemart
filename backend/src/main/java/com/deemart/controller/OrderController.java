package com.deemart.controller;

import com.deemart.dto.CreateOrderRequest;
import com.deemart.entity.Order;
import com.deemart.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(@RequestHeader("X-Session-Id") String sessionId) {
        return ResponseEntity.ok(orderService.getUserOrders(sessionId));
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestHeader("X-Session-Id") String sessionId,
            @RequestBody CreateOrderRequest body) {

        double subtotal = body.getSubtotal() == null ? 0.0 : body.getSubtotal();
        double shipping = body.getShipping() == null ? 0.0 : body.getShipping();
        double tax = body.getTax() == null ? 0.0 : body.getTax();
        double discount = body.getDiscount() == null ? 0.0 : body.getDiscount();
        double total = body.getTotal() == null ? 0.0 : body.getTotal();

        String shippingAddress = body.getShippingAddress() == null ? "" : body.getShippingAddress();
        // Payment here is intentionally minimal: frontend only confirms payment received.
        String paymentInfo = body.getPaymentInfo() == null ? "" : body.getPaymentInfo();

        return ResponseEntity.ok(
                orderService.createOrder(sessionId, subtotal, shipping, tax, discount, total, shippingAddress, paymentInfo)
        );
    }
}

