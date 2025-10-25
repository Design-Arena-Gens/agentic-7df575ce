package com.cakeshop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class OrderItemRequest {

  @NotNull
  private Long cakeId;

  @Min(1)
  private int quantity;

  public Long getCakeId() {
    return cakeId;
  }

  public void setCakeId(Long cakeId) {
    this.cakeId = cakeId;
  }

  public int getQuantity() {
    return quantity;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }
}
