package com.inn.cafe.dao;

import com.inn.cafe.POJO.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface UserDao extends JpaRepository<User,Integer> {

    Optional<User> findByEmailId(@Param("email") String email);
}
