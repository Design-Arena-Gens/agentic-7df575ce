package com.cakeshop.service;

import com.cakeshop.dto.CheckoutRequest;
import com.cakeshop.dto.OrderItemRequest;
import com.cakeshop.entity.Cake;
import com.cakeshop.exception.BadRequestException;
import com.cakeshop.exception.NotFoundException;
import com.cakeshop.repository.CakeRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

  private final CakeRepository cakeRepository;
  private final String stripeSecretKey;

  public PaymentService(CakeRepository cakeRepository,
                        @Value("${app.stripe.secret-key:}") String stripeSecretKey) {
    this.cakeRepository = cakeRepository;
    this.stripeSecretKey = stripeSecretKey;
  }

  @PostConstruct
  public void configureStripe() {
    if (stripeSecretKey != null && !stripeSecretKey.isBlank()) {
      Stripe.apiKey = stripeSecretKey;
    }
  }

  public PaymentIntent createPaymentIntent(CheckoutRequest request) {
    if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
      throw new BadRequestException("Stripe secret key is not configured");
    }

    long amountInCents = calculateAmount(request);

    Map<String, Object> params = new HashMap<>();
    params.put("amount", amountInCents);
    params.put("currency", "usd");
    params.put("automatic_payment_methods", Map.of("enabled", true));

    if (request.getReceiptEmail() != null) {
      params.put("receipt_email", request.getReceiptEmail());
    }

    try {
      return PaymentIntent.create(params);
    } catch (StripeException e) {
      throw new BadRequestException("Stripe error: " + e.getMessage());
    }
  }

  private long calculateAmount(CheckoutRequest request) {
    BigDecimal total = BigDecimal.ZERO;
    for (OrderItemRequest item : request.getItems()) {
      Cake cake = cakeRepository.findById(item.getCakeId())
          .orElseThrow(() -> new NotFoundException("Cake not found: " + item.getCakeId()));
      BigDecimal line = cake.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
      total = total.add(line);
    }
    return total.multiply(BigDecimal.valueOf(100))
        .setScale(0, RoundingMode.HALF_UP)
        .longValueExact();
  }
}
