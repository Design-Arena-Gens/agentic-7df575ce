package com.cakeshop.repository;

import com.cakeshop.entity.Order;
import com.cakeshop.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findAllByUser(User user);
}
