package com.inn.cafe.POJO;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.io.Serializable;

@Data
@Entity
@Table(name = "Bill")
@DynamicUpdate
@DynamicInsert
public class Bill implements Serializable {

    private static final long serialVersionId=1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "uuid")
    private String uuid;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "contactnumber")
    private String contactNumber;

    @Column(name = "paymentmethod")
    private String paymentMethod;

    @Column(name = "totalamount")
    private Integer totalAmount;

    @Column(name = "productdetails",columnDefinition = "json")
    private String productDetails;

    @Column(name = "createdby")
    private String createdBy;

}
