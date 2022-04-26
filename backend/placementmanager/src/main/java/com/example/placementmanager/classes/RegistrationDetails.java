package com.example.placementmanager.classes;

import javax.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter @Getter @NoArgsConstructor
public class RegistrationDetails {
    // @SequenceGenerator(
	// 	name = "registration_details_sequence",
	// 	sequenceName = "registration_details_sequence",
	// 	allocationSize = 1
	// )
	// @GeneratedValue(
	// 	strategy = GenerationType.SEQUENCE,
	// 	generator = "registration_details_sequence"
	// )
    @Id
    private String userId;

    private String email;
    private String password;
    private String role;

    public RegistrationDetails(String userId, String email, String password, String role){
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
