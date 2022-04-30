package com.example.placementmanager;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.example.placementmanager.classes.CompanyDrive;
import com.example.placementmanager.controller.Controller;
import com.example.placementmanager.services.AdminService;
import com.example.placementmanager.services.CompanyDriveService;
import com.example.placementmanager.services.CompanyRecruiterService;
import com.example.placementmanager.services.RegistrationDetailsService;
import com.example.placementmanager.services.StudentService;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;


@WebMvcTest(controllers = Controller.class)
public class ControllerTest {  
    @MockBean
    private AdminService adminService;
    @MockBean
    private RegistrationDetailsService regService;
    @MockBean
    private StudentService studService;
    @MockBean
    private CompanyDriveService compService;
    @MockBean
    private CompanyRecruiterService recruiterService;

    @Autowired
    private MockMvc mockMvc;



    @Test
    @DisplayName("Should get all the available drives for a given adminId endpoint - /api/drive-list/{objId}")
    public void fetchDrivesTest() throws Exception{
        LocalDate date = LocalDate.now();
        CompanyDrive cp = new CompanyDrive("google", "software", date);
        
        Mockito.when(compService.getAllComp()).thenReturn(List.of(cp));

        
        mockMvc.perform(MockMvcRequestBuilders.get("/api/drive-list/{objId}", "1"))
            .andExpect(MockMvcResultMatchers.status().is(200))
            .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.nullObj", Matchers.is(false)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.companies[0].name", Matchers.is("google")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.companies[0].stream", Matchers.is("software")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.companies[0].deadlineDate", Matchers.is(date.toString())));
    }

    @Test
    @DisplayName("Should get all the details regarding the company for a given companyId endpoint - /api/company-home/{compId}")
    public void fetchCompHomeTest() throws Exception{
        LocalDate date = LocalDate.now();
        CompanyDrive cp = new CompanyDrive("google", "software", date);
        
        Mockito.when(compService.getCompById((long)1)).thenReturn(Optional.of(cp));

        

        mockMvc.perform(MockMvcRequestBuilders.get("/api/company-home/{compId}", "1"))
            .andExpect(MockMvcResultMatchers.status().is(200))
            .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.nullObj", Matchers.is(false)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.companyDetails.name", Matchers.is("google")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.companyDetails.stream", Matchers.is("software")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.companyDetails.deadlineDate", Matchers.is(date.toString())));
    }


}
