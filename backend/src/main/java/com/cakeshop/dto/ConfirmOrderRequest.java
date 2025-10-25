package com.cakeshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ConfirmOrderRequest {

  @NotNull
  private Long orderId;

  @NotBlank
  private String paymentIntentId;

  public Long getOrderId() {
    return orderId;
  }

  public void setOrderId(Long orderId) {
    this.orderId = orderId;
  }

  public String getPaymentIntentId() {
    return paymentIntentId;
  }

  public void setPaymentIntentId(String paymentIntentId) {
    this.paymentIntentId = paymentIntentId;
  }
}
