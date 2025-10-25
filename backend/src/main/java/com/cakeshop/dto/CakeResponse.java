package com.cakeshop.dto;

import java.math.BigDecimal;
import java.util.Set;

public class CakeResponse {

  private Long id;
  private String name;
  private String description;
  private BigDecimal price;
  private String imageUrl;
  private boolean featured;
  private String flavor;
  private Set<String> tags;

  public CakeResponse() {
  }

  public CakeResponse(Long id, String name, String description, BigDecimal price,
                      String imageUrl, boolean featured, String flavor, Set<String> tags) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
    this.featured = featured;
    this.flavor = flavor;
    this.tags = tags;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public boolean isFeatured() {
    return featured;
  }

  public void setFeatured(boolean featured) {
    this.featured = featured;
  }

  public String getFlavor() {
    return flavor;
  }

  public void setFlavor(String flavor) {
    this.flavor = flavor;
  }

  public Set<String> getTags() {
    return tags;
  }

  public void setTags(Set<String> tags) {
    this.tags = tags;
  }
}
