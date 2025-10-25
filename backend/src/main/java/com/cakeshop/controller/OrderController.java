package com.cakeshop.controller;

import com.cakeshop.dto.CheckoutRequest;
import com.cakeshop.dto.ConfirmOrderRequest;
import com.cakeshop.dto.OrderResponse;
import com.cakeshop.dto.PaymentIntentResponse;
import com.cakeshop.entity.Order;
import com.cakeshop.exception.UnauthorizedException;
import com.cakeshop.service.OrderService;
import com.cakeshop.service.PaymentService;
import com.stripe.model.PaymentIntent;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

  private final OrderService orderService;
  private final PaymentService paymentService;

  public OrderController(OrderService orderService, PaymentService paymentService) {
    this.orderService = orderService;
    this.paymentService = paymentService;
  }

  @PostMapping("/checkout")
  public ResponseEntity<PaymentIntentResponse> checkout(@RequestBody @Valid CheckoutRequest request,
                                                         Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new UnauthorizedException("Authentication required");
    }

    PaymentIntent intent = paymentService.createPaymentIntent(request);
    Order order = orderService.createOrder(authentication.getName(), request, intent.getId(), "PENDING_PAYMENT");
    return ResponseEntity.ok(new PaymentIntentResponse(intent.getClientSecret(), order.getId()));
  }

  @PostMapping("/confirm")
  public ResponseEntity<Void> confirm(@RequestBody @Valid ConfirmOrderRequest request,
                                      Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new UnauthorizedException("Authentication required");
    }

    orderService.confirmOrder(authentication.getName(), request.getOrderId(), request.getPaymentIntentId());
    return ResponseEntity.ok().build();
  }

  @GetMapping
  public List<OrderResponse> listOrders(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new UnauthorizedException("Authentication required");
    }

    return orderService.listOrders(authentication.getName());
  }
}
