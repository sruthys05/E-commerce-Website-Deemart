package com.deemart.service;

import com.deemart.entity.Order;
import com.deemart.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getUserOrders(String sessionId) {
        return orderRepository.findBySessionIdOrderByCreatedAtDesc(sessionId);
    }

    public Order createOrder(String sessionId, double subtotal, double shipping, double tax,
                              double discount, double total, String shippingAddress, String paymentInfo) {
        Order order = new Order();
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setSessionId(sessionId);
        order.setSubtotal(subtotal);
        order.setShipping(shipping);
        order.setTax(tax);
        order.setDiscount(discount);
        order.setTotal(total);
        order.setStatus("confirmed");
        order.setShippingAddress(shippingAddress);
        order.setPaymentInfo(paymentInfo);
        return orderRepository.save(order);
    }
}