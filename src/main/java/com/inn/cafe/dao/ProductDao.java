package com.inn.cafe.dao;

import com.inn.cafe.POJO.Product;
import com.inn.cafe.wrapper.ProductWrapper;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductDao extends JpaRepository<Product,Integer> {
    @Query("select new com.inn.cafe.wrapper.ProductWrapper(p.id,p.name,p.description,p.price,p.status,p.category.id,p.category.name) from Product p ")
    List<ProductWrapper> getAllProducts();

    @Query("update Product p set p.status=:status where p.id=:id")
    @Modifying
    @Transactional
    Integer updateProductStatus(@Param("status") String status,@Param("id") int id);

    @Query("select new com.inn.cafe.wrapper.ProductWrapper(p.id,p.name) from Product p where p.category.id=:id and p.status='true'")
    List<ProductWrapper> getByProductCategory(Integer id);
    @Query("select new com.inn.cafe.wrapper.ProductWrapper(p.id,p.name,p.description,p.price) from Product p where p.id=:id")
    ProductWrapper getProductById(Integer id);
}
