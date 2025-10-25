package com.cakeshop.controller;

import com.cakeshop.dto.CakeResponse;
import com.cakeshop.service.CakeService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cakes")
public class CakeController {

  private final CakeService cakeService;

  public CakeController(CakeService cakeService) {
    this.cakeService = cakeService;
  }

  @GetMapping
  public List<CakeResponse> listCakes(@RequestParam(required = false) String name,
                                      @RequestParam(required = false) BigDecimal minPrice,
                                      @RequestParam(required = false) BigDecimal maxPrice,
                                      @RequestParam(required = false) Boolean featured) {
    return cakeService.listCakes(name, minPrice, maxPrice, featured);
  }

  @GetMapping("/{id}")
  public CakeResponse getCake(@PathVariable Long id) {
    return cakeService.getCake(id);
  }
}
