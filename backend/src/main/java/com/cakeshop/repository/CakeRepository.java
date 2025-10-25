package com.cakeshop.repository;

import com.cakeshop.entity.Cake;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CakeRepository extends JpaRepository<Cake, Long>, JpaSpecificationExecutor<Cake> {

  @Query("SELECT c FROM Cake c WHERE (:featured IS NULL OR c.featured = :featured) "
      + "AND (:minPrice IS NULL OR c.price >= :minPrice) "
      + "AND (:maxPrice IS NULL OR c.price <= :maxPrice) "
      + "AND (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')))")
  List<Cake> advancedSearch(@Param("featured") Boolean featured,
                            @Param("minPrice") BigDecimal minPrice,
                            @Param("maxPrice") BigDecimal maxPrice,
                            @Param("name") String name);
}
