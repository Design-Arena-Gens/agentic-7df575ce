package com.cakeshop.service;

import com.cakeshop.dto.CheckoutRequest;
import com.cakeshop.dto.OrderItemRequest;
import com.cakeshop.dto.OrderResponse;
import com.cakeshop.entity.Cake;
import com.cakeshop.entity.Order;
import com.cakeshop.entity.OrderItem;
import com.cakeshop.entity.User;
import com.cakeshop.exception.BadRequestException;
import com.cakeshop.exception.NotFoundException;
import com.cakeshop.repository.CakeRepository;
import com.cakeshop.repository.OrderRepository;
import com.cakeshop.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

  private final OrderRepository orderRepository;
  private final UserRepository userRepository;
  private final CakeRepository cakeRepository;

  public OrderService(OrderRepository orderRepository,
                      UserRepository userRepository,
                      CakeRepository cakeRepository) {
    this.orderRepository = orderRepository;
    this.userRepository = userRepository;
    this.cakeRepository = cakeRepository;
  }

  @Transactional
  public Order createOrder(String userEmail, CheckoutRequest request, String paymentIntentId, String status) {
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    if (request.getItems() == null || request.getItems().isEmpty()) {
      throw new BadRequestException("Order must contain at least one item");
    }

    Order order = new Order();
    order.setUser(user);
    order.setStatus(status);

    BigDecimal total = BigDecimal.ZERO;
    for (OrderItemRequest itemRequest : request.getItems()) {
      Cake cake = cakeRepository.findById(itemRequest.getCakeId())
          .orElseThrow(() -> new NotFoundException("Cake not found: " + itemRequest.getCakeId()));

      OrderItem item = new OrderItem();
      item.setOrder(order);
      item.setCake(cake);
      item.setQuantity(itemRequest.getQuantity());
      item.setUnitPrice(cake.getPrice());

      order.getItems().add(item);

      BigDecimal lineAmount = cake.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
      total = total.add(lineAmount);
    }

    order.setTotalAmount(total);
    order.setPaymentIntentId(paymentIntentId);

    return orderRepository.save(order);
  }

  @Transactional(readOnly = true)
  public List<OrderResponse> listOrders(String userEmail) {
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    return orderRepository.findAllByUser(user).stream()
        .map(order -> new OrderResponse(
            order.getId(),
            order.getTotalAmount(),
            order.getStatus(),
            order.getCreatedAt(),
            order.getItems().stream()
                .map(item -> new OrderResponse.OrderSummaryItem(
                    item.getCake().getName(),
                    item.getQuantity(),
                    item.getUnitPrice()))
                .collect(Collectors.toList())
        ))
        .collect(Collectors.toList());
  }

  @Transactional
  public void confirmOrder(String userEmail, Long orderId, String paymentIntentId) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new NotFoundException("Order not found"));

    if (!order.getUser().getEmail().equals(userEmail)) {
      throw new BadRequestException("Order does not belong to user");
    }

    if (order.getPaymentIntentId() == null || !order.getPaymentIntentId().equals(paymentIntentId)) {
      throw new BadRequestException("Payment intent mismatch");
    }

    order.setStatus("PAID");
    orderRepository.save(order);
  }
}
