package com.cakeshop.dto;

public class PaymentIntentResponse {

  private String clientSecret;
  private Long orderId;

  public PaymentIntentResponse() {
  }

  public PaymentIntentResponse(String clientSecret, Long orderId) {
    this.clientSecret = clientSecret;
    this.orderId = orderId;
  }

  public String getClientSecret() {
    return clientSecret;
  }

  public void setClientSecret(String clientSecret) {
    this.clientSecret = clientSecret;
  }

  public Long getOrderId() {
    return orderId;
  }

  public void setOrderId(Long orderId) {
    this.orderId = orderId;
  }
}
