package com.cakeshop.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class OrderResponse {

  private Long id;
  private BigDecimal totalAmount;
  private String status;
  private Instant createdAt;
  private List<OrderSummaryItem> items;

  public OrderResponse() {
  }

  public OrderResponse(Long id, BigDecimal totalAmount, String status, Instant createdAt,
                       List<OrderSummaryItem> items) {
    this.id = id;
    this.totalAmount = totalAmount;
    this.status = status;
    this.createdAt = createdAt;
    this.items = items;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public BigDecimal getTotalAmount() {
    return totalAmount;
  }

  public void setTotalAmount(BigDecimal totalAmount) {
    this.totalAmount = totalAmount;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public List<OrderSummaryItem> getItems() {
    return items;
  }

  public void setItems(List<OrderSummaryItem> items) {
    this.items = items;
  }

  public static class OrderSummaryItem {
    private String name;
    private int quantity;
    private BigDecimal unitPrice;

    public OrderSummaryItem() {
    }

    public OrderSummaryItem(String name, int quantity, BigDecimal unitPrice) {
      this.name = name;
      this.quantity = quantity;
      this.unitPrice = unitPrice;
    }

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    public int getQuantity() {
      return quantity;
    }

    public void setQuantity(int quantity) {
      this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
      return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
      this.unitPrice = unitPrice;
    }
  }
}
