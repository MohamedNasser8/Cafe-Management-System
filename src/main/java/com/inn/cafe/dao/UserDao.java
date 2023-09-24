package com.inn.cafe.dao;

import com.inn.cafe.POJO.User;
import com.inn.cafe.wrapper.UserWrapper;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserDao extends JpaRepository<User,Integer> {

    Optional<User> findByEmailId(@Param("email") String email);
    @Query("select new com.inn.cafe.wrapper.UserWrapper(u.id,u.name,u.contactNumber,u.email,u.status) from User u where u.role='user'")
    List<UserWrapper> getAllUsers();

    @Query("select u.email from User u where u.role='admin'")
    List<String> getAllAdmins();

    @Transactional
    @Modifying
    @Query("update User u set u.status=:status where u.id=:id")
    Integer updateStatus(@Param("status")String status,@Param("id") Integer id);
}
