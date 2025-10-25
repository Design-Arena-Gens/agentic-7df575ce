package com.cakeshop.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class CheckoutRequest {

  @NotEmpty
  @Valid
  private List<OrderItemRequest> items;

  private String paymentMethodId;

  private String receiptEmail;

  public List<OrderItemRequest> getItems() {
    return items;
  }

  public void setItems(List<OrderItemRequest> items) {
    this.items = items;
  }

  public String getPaymentMethodId() {
    return paymentMethodId;
  }

  public void setPaymentMethodId(String paymentMethodId) {
    this.paymentMethodId = paymentMethodId;
  }

  public String getReceiptEmail() {
    return receiptEmail;
  }

  public void setReceiptEmail(String receiptEmail) {
    this.receiptEmail = receiptEmail;
  }
}
