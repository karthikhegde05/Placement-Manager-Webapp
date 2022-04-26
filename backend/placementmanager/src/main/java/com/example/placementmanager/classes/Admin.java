package com.example.placementmanager.classes;

import javax.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter @Getter @NoArgsConstructor
public class Admin {
    @SequenceGenerator(
        name = "admin_sequence",
        sequenceName = "admin_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "admin_sequence"
    )
    @Id
    private Long adminId;

    private String firstName;
    private String lastName;
    private String rollNumber;
    private String batch;
    private String contactNumber;
    
    @OneToOne(targetEntity = RegistrationDetails.class)
    @JoinColumn(name="user_id")
    private RegistrationDetails regDetails;

    public Admin(String firstName, String lastName, String rollNumber, String batch, String contactNumber){
        this.firstName = firstName;
        this.lastName = lastName;
        this.rollNumber = rollNumber;
        this.batch = batch;
        this.contactNumber = contactNumber;
    }
}
