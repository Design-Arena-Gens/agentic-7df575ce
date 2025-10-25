package com.cakeshop.service;

import com.cakeshop.dto.CakeResponse;
import com.cakeshop.entity.Cake;
import com.cakeshop.exception.NotFoundException;
import com.cakeshop.repository.CakeRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class CakeService {

  private final CakeRepository cakeRepository;

  public CakeService(CakeRepository cakeRepository) {
    this.cakeRepository = cakeRepository;
  }

  public List<CakeResponse> listCakes(String name, BigDecimal minPrice, BigDecimal maxPrice, Boolean featured) {
    List<Cake> cakes = cakeRepository.advancedSearch(featured, minPrice, maxPrice, name);
    return cakes.stream()
        .map(cake -> new CakeResponse(
            cake.getId(),
            cake.getName(),
            cake.getDescription(),
            cake.getPrice(),
            cake.getImageUrl(),
            cake.isFeatured(),
            cake.getFlavor(),
            cake.getTags()))
        .collect(Collectors.toList());
  }

  public CakeResponse getCake(Long id) {
    Cake cake = cakeRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Cake not found"));
    return new CakeResponse(
        cake.getId(),
        cake.getName(),
        cake.getDescription(),
        cake.getPrice(),
        cake.getImageUrl(),
        cake.isFeatured(),
        cake.getFlavor(),
        cake.getTags());
  }
}
