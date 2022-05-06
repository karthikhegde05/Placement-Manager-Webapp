package com.example.placementmanager.controller;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;

import com.example.placementmanager.classes.Admin;
import com.example.placementmanager.classes.CompanyDrive;
import com.example.placementmanager.classes.CompanyRecruiter;
import com.example.placementmanager.classes.RegistrationDetails;
import com.example.placementmanager.classes.Student;
import com.example.placementmanager.services.AdminService;
import com.example.placementmanager.services.CompanyDriveService;
import com.example.placementmanager.services.CompanyRecruiterService;
import com.example.placementmanager.services.RegistrationDetailsService;
import com.example.placementmanager.services.StudentService;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins={"http://127.0.0.1:3000/", "http://localhost:3000/", "http://localhost:4200/", "http://localhost:80/", "http://34.127.110.3:4200/"}, maxAge=30)
public class Controller {

    private static final Logger log = LoggerFactory.getLogger(Controller.class);

    private final AdminService adminService;
    private final RegistrationDetailsService regService;
    private final StudentService studService;
    private final CompanyDriveService compService;
    private final CompanyRecruiterService recruiterService;

    public Controller(AdminService adminService, RegistrationDetailsService regService,
                    StudentService studService, CompanyDriveService compService,
                    CompanyRecruiterService recruiterService){
                        this.adminService = adminService;
                        this.regService = regService;
                        this.studService = studService;
                        this.compService = compService;
                        this.recruiterService = recruiterService;
                    }


    // registration (post method) 
    @PostMapping(value="/register")
    public @ResponseBody sndRegAckDto postRegister(@RequestBody rcvRegDto regDto){

        log.info("[Register] - [POST]");

        String userId = regDto.getUserId();
        String email = regDto.getEmail();
        String password = regDto.getPassword();
        String role = regDto.getRole();

        sndRegAckDto ackObj = new sndRegAckDto();
        ackObj.setRegComplete(false);
        ackObj.setAlreadyTaken(false);

        try {
            Optional<RegistrationDetails> reg = regService.getRegById(userId);
            if(reg.isPresent()){
                ackObj.setAlreadyTaken(true);
                return ackObj;
            }
            RegistrationDetails regDetails = new RegistrationDetails(userId, email, password, role);
            regService.saveRegDetails(regDetails);

            switch(role){
                case "admin":
                    Admin nwAdmin = new Admin();
                    nwAdmin.setFirstName(regDto.getFirstName());
                    nwAdmin.setLastName(regDto.getLastName());
                    nwAdmin.setContactNumber(regDto.getContactNumber());
                    nwAdmin.setRegDetails(regDetails);
                    adminService.saveAdmin(nwAdmin);
                    ackObj.setRegComplete(true);
                    break;
                case "student":
                    Student nwStud = new Student();
                    nwStud.setFirstName(regDto.getFirstName());
                    nwStud.setLastName(regDto.getLastName());
                    nwStud.setContactNumber(regDto.getContactNumber());
                    nwStud.setRegDetails(regDetails);
                    studService.saveStudent(nwStud);
                    ackObj.setRegComplete(true);
                    break;
                case "recruiter":
                    CompanyRecruiter nwRecruiter = new CompanyRecruiter();
                    nwRecruiter.setFirstName(regDto.getFirstName());
                    nwRecruiter.setLastName(regDto.getLastName());
                    nwRecruiter.setContactNumber(regDto.getContactNumber());
                    nwRecruiter.setRegDetails(regDetails);
                    recruiterService.saveRecruiter(nwRecruiter);
                    ackObj.setRegComplete(true);
                    break;
                default:
                    ackObj.setRegComplete(false);
                    break;
            }

            return ackObj;
        } 
        catch (Exception err){
            ackObj.setRegComplete(false);
        }

        return ackObj;
    }


    // login (post method)
    @PostMapping(value="/login")
    public @ResponseBody sndProfileDto checkLogin(@RequestBody rcvLgDto lgDto){

        log.info("[Login] - [POST]");

        String userId = lgDto.getUserId();
        String passwrd = lgDto.getPassword();

        sndProfileDto ackObj = new sndProfileDto();

        Optional<RegistrationDetails> regDetails = regService.getRegById(userId);
        if(regDetails.isEmpty()){
            ackObj.setNullObj(true);
            return ackObj;
        }
        
        if(!regDetails.get().getPassword().equals(passwrd)){
            ackObj.setNullObj(true);
            return ackObj;
        }

        ackObj.setNullObj(false);
        ackObj.setUserId(regDetails.get().getUserId());
        ackObj.setRole(regDetails.get().getRole());
        String role = regDetails.get().getRole();
        
        switch(role){
            case "admin":
                ackObj.setObjId(adminService.getAdminByReg(regDetails.get()).get(0).getAdminId());
                break;
            case "student":
                ackObj.setObjId(studService.getStudentByReg(regDetails.get()).get(0).getStudentId());
                break;
            case "recruiter":
                CompanyRecruiter recruiter = recruiterService.getRecruiterByReg(regDetails.get()).get(0);
                List<CompanyDrive> companies = recruiter.getLstCompanies();
                List<Long> companyIds = new ArrayList<Long>();
                for(CompanyDrive e: companies)
                    companyIds.add(e.getCompanyId());
                ackObj.setCompanyIds(companyIds);
                ackObj.setObjId(recruiterService.getRecruiterByReg(regDetails.get()).get(0).getRecruiterId());
                break;
            default:
                ackObj.setNullObj(true);
                break;
        }

        return ackObj;
    }


    // --- admin home page ---
    // get ongoing drive list (get method)
    @GetMapping(value="/drive-list/{objId}")
    public @ResponseBody sndDriveLstDto fetchDrives(@PathVariable String objId){

        log.info("[Fetch Company Drives] - [GET]");

        Long adminId = Long.parseLong(objId);

        List<CompanyDrive> companies = compService.getAllComp();

        sndDriveLstDto ackObj = new sndDriveLstDto();
        ackObj.setNullObj(true);

        if(companies.isEmpty())
            return ackObj;
        
        ackObj.setNullObj(false);
        ackObj.setCompanies(companies);

        return ackObj;
    }

    // create new drive (post method)
    @PostMapping(value="/create-new-drive")
    public @ResponseBody sndCrtDriveAckDto createDrive(@RequestBody rcvCrtDriveDto rcvObj){

        log.info("[Create New Drive] - [POST]");

        String name = rcvObj.getCompanyName();
        String stream = rcvObj.getCompanyStream();

        List<String> recruiters = rcvObj.getRecId();

        LocalDate deadlineDate = LocalDate.parse(rcvObj.getDeadlineDate());

        sndCrtDriveAckDto ackObj = new sndCrtDriveAckDto(false, false);

        List<CompanyDrive> compLst = compService.getByNameAndStream(name, stream);
        if(!compLst.isEmpty()){
            ackObj.setAlreadyTaken(true);
            return ackObj;
        }

        CompanyDrive companyObj = new CompanyDrive(name, stream, deadlineDate);

        List<CompanyRecruiter> cr = new ArrayList<CompanyRecruiter>();
        for(String recruiter: recruiters){
            Optional<RegistrationDetails> regDet = regService.getRegById(recruiter);
            if(regDet.isEmpty())break;
            List<CompanyRecruiter> rec = recruiterService.getRecruiterByReg(regDet.get());
            for(CompanyRecruiter person: rec){
                companyObj.addRecruiter(person);
                cr.add(person);
            }
        }

        // for(CompanyRecruiter person: cr){
        //     person.addCompany(companyObj);
        // }


        compService.saveCompany(companyObj);
        ackObj.setCreateDriveComplete(true);

        return ackObj;
    }

    // delete drive (post method)
    @PostMapping(value="/delete-drive")
    public @ResponseBody sndAckDto deleteDrive(@RequestBody rcvDelDriveDto rcvObj){

        log.info("[Delete Drive] - [POST]");

        String name = rcvObj.getCompanyName();
        String stream = rcvObj.getCompanyStream();

        sndAckDto ackObj = new sndAckDto(false);

        List<CompanyDrive> compLst = compService.getByNameAndStream(name, stream);
        
        if(compLst.isEmpty()){
            return ackObj;
        }
        
        compService.deleteCompById(compLst.get(0).getCompanyId());
        ackObj.setAck(true);
        return ackObj;
    }


    // --- company home page ---
    // get details of ongoing drive (get method)
    @GetMapping(value="/company-home/{compId}")
    public @ResponseBody sndCompDetailsDto fetchCompHome(@PathVariable String compId){

        log.info("[Fetch Company Home] - [GET]");

        Long companyId = Long.parseLong(compId);

        sndCompDetailsDto ackObj = new sndCompDetailsDto();
        ackObj.setNullObj(true);

        Optional<CompanyDrive> company = compService.getCompById(companyId);

        if(company.isEmpty())
            return ackObj;

        ackObj.setNullObj(false);
        ackObj.setCompanyDetails(company.get());

        return ackObj;
    }

    // edit detail info (post method)
    @PostMapping(value="/company-details-update")
    public @ResponseBody sndAckDto updCompDetails(@RequestBody rcvCompDetailsDto rcvObj){

        log.info("[Update Company Details] - [POST]");

        Long companyId = Long.parseLong(rcvObj.getCompanyId());

        compService.updateCompDetails(companyId, rcvObj.getMeetingLink(), rcvObj.getTestLink(),rcvObj.getInfo(), rcvObj.getJobDescription(), rcvObj.getJobPay());

        sndAckDto ackObj = new sndAckDto();
        ackObj.setAck(true);
        return ackObj;
    }

    
    // reject students / delete from the selected students (post method)
    @PostMapping(value="/company-reject-student/")
    public @ResponseBody sndAckDto rejectCompStudent(@RequestBody rcvStudentCompDto rcvObj){

        log.info("[Reject Student] - [POST]");

        Long companyId = Long.parseLong(rcvObj.getCompanyId());
        Long studentId = Long.parseLong(rcvObj.getStudentId());

        sndAckDto ackObj = new sndAckDto();
        ackObj.setAck(false);

        Optional<CompanyDrive> company = compService.getCompById(companyId);
        if(company.isEmpty())
            return ackObj;

        compService.deleteStudinCompany(companyId,studentId);
        ackObj.setAck(true);
        return ackObj;
    }


    // --- student home page ---
    // list of company drives (get method)
    @GetMapping(value="/student-company-drives/{objId}")
    public @ResponseBody sndStDriveLstDto  fetchStCompDrives(@PathVariable String objId){

        log.info("[Fetch Student Company Drives] - [GET]");

        Long studentId = Long.parseLong(objId);

        sndStDriveLstDto ackObj = new sndStDriveLstDto();
        ackObj.setNullObj(true);

        Optional<Student> stud = studService.getStudentById(studentId);

        if(stud.isEmpty())
            return ackObj;

        List<CompanyDrive> appComps = stud.get().getLstCompanyDrives();
        Set<Long> stAppComps = new TreeSet<Long>();
        for(CompanyDrive cp: appComps){
            compDriveDto dto = new compDriveDto();
            dto.setApplied(true);
            dto.setCompany(cp);
            ackObj.setNullObj(false);
            ackObj.addCompanies(dto);
            stAppComps.add(cp.getCompanyId());
        }

        List<CompanyDrive> allComps = compService.getGreaterDate(LocalDate.now());
        for(CompanyDrive cp: allComps){
            if(stAppComps.contains(cp.getCompanyId()))continue;
            compDriveDto dto = new compDriveDto();
            dto.setApplied(false);
            dto.setCompany(cp);
            ackObj.setNullObj(false);
            ackObj.addCompanies(dto);
        }


        return ackObj;
    }

    // apply for a company drive (post method)
    @PostMapping(value="/student-apply-drive")
    public @ResponseBody sndAckDto applyCompany(@RequestBody rcvStudentCompDto rcvObj){

        log.info("[Apply for Drive] - [POST]");

        Long companyId = Long.parseLong(rcvObj.getCompanyId());
        Long studentId = Long.parseLong(rcvObj.getStudentId());

        sndAckDto ackObj = new sndAckDto();
        ackObj.setAck(false);

        Optional<CompanyDrive> company = compService.getCompById(companyId);

        if(company.isEmpty())
            return ackObj;

        Optional<Student> stud = studService.getStudentById(studentId);
        if(stud.isEmpty())
            return ackObj;

        stud.get().addLstCompanyDrives(company.get());
        studService.updateStudentByCompany(stud.get().getStudentId(), company.get().getCompanyId());
        ackObj.setAck(true);
        return ackObj;
    }


    // --- student profile page ---
    // list of student details along with email and password (get method)
    @GetMapping(value="/student-profile-details/{studId}")
    public @ResponseBody sndStudProfDto fetchStudProfile(@PathVariable String studId){

        log.info("[Fetch Student Profile Details] - [GET]");

        Long studentId = Long.parseLong(studId);

        sndStudProfDto ackObj = new sndStudProfDto();
        ackObj.setNullObj(true);

        Optional<Student> student = studService.getStudentById(studentId);
        if(student.isEmpty())
            return ackObj;
        
        ackObj.setNullObj(false);
        ackObj.setFirstName(student.get().getFirstName());
        ackObj.setLastName(student.get().getLastName());
        ackObj.setRollNumber(student.get().getRollNumber());
        ackObj.setBatch(student.get().getBatch());
        ackObj.setContactNumber(student.get().getContactNumber());
        ackObj.setCgpa(student.get().getCgpa());
        ackObj.setSoftwareResume(student.get().getSoftwareResume());
        ackObj.setDatascienceResume(student.get().getDatascienceResume());
        ackObj.setEceResume(student.get().getEceResume());
        ackObj.setUserId(student.get().getRegDetails().getUserId());
        ackObj.setPassword(student.get().getRegDetails().getPassword());

        return ackObj;
    }

    // editing of email , password, uploading resumes (post method)
    @PostMapping(value="/student-profile-update/{objId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public @ResponseBody sndAckDto updateStudProf(@ModelAttribute rcvStudProfDto obj, @PathVariable String objId){

        log.info("[Update Student Profile] - [POST]");

        Long studentId = Long.parseLong(objId);

        sndAckDto ackObj = new sndAckDto();
        ackObj.setAck(false);

        byte[] softFileContent;
        byte[] dataFileContent;
        byte[] eceFileContent;
        try{
            softFileContent = obj.getSoftwareResume().getBytes();
            dataFileContent = obj.getDatascienceResume().getBytes();
            eceFileContent = obj.getEceResume().getBytes();
        }
        catch(IOException e){
            ackObj.setAck(false);
            return ackObj;
        }

        try{
            studService.updateStudentProfile(studentId, obj.getFirstName(), obj.getLastName(), 
            softFileContent, dataFileContent, eceFileContent);
        }
        catch(IOException e){
            ackObj.setAck(false);
            return ackObj;
        }

        ackObj.setAck(true);
        return ackObj;
    }

  


    // --- recruiter home page ---
    // list of company drives that he/she is incharge of (get method)
    @GetMapping(value="/recruiter-drives/{objId}")
    public @ResponseBody sndDriveLstDto fetchRecDrives(@PathVariable String objId){

        log.info("[Fetch Recruiter Drives] - [GET]");

        Long recruiterId = Long.parseLong(objId);
        
        sndDriveLstDto ackObj = new sndDriveLstDto();
        ackObj.setNullObj(true);

        Optional<CompanyRecruiter> opt = recruiterService.getRecruiterById(recruiterId);
        if(opt.isEmpty()){
            return ackObj;
        }

        CompanyRecruiter recruiter = opt.get();
        ackObj.setNullObj(false);
        ackObj.setCompanies(recruiter.getLstCompanies());

        return ackObj;
    }
    
    @GetMapping(value="/ping")
    public @ResponseBody String ping(){

        return "pong";
    }


    // --- recruiter profile page ---
    // list of recruiter details along with email and password (get method)
    // @GetMapping(value="/recruiter-profile/{objId}")
    // public @ResponseBody sndRecProfDto fetchRecProfile(@PathVariable String objId){
        
    // }

    // editing of email, password (post method)

}


// DTO
@Data
@Setter @Getter @AllArgsConstructor
class rcvLgDto{
    private String userId;
    private String password;
}

@Data
@Setter @Getter @AllArgsConstructor
class rcvRegDto{
    private String userId;
    private String email;
    private String password;
    private String role;
    private String firstName;
    private String lastName;
    private String contactNumber;
}

@Data
@Setter @Getter @AllArgsConstructor
class rcvCrtDriveDto{
    private String companyName;
    private String companyStream;
    private String deadlineDate;
    private List<String> recId; // List of userId of recruiters
}

@Data
@Setter @Getter @AllArgsConstructor
class rcvDelDriveDto{
    private String companyName;
    private String companyStream;
}


@Data
@Setter @Getter @AllArgsConstructor
class rcvStudentCompDto{
    private String companyId;
    private String studentId;
}

@Data
@Setter @Getter @AllArgsConstructor @NoArgsConstructor
class rcvStudProfDto{

    private String userId;
    private String password;
    private String firstName;
    private String lastName;
    private String rollNumber;
    private String batch;
    private String contactNumber;
    private Double cgpa;
    private MultipartFile softwareResume;
    private MultipartFile datascienceResume;
    private MultipartFile eceResume;
}


@Data
@Setter @Getter @AllArgsConstructor @NoArgsConstructor
class rcvCompDetailsDto{
    private String companyId;
    private String meetingLink;
    private String testLink;
    private String info;
    private String jobDescription;
    private String jobPay;
}

@Data
@Setter @Getter @AllArgsConstructor @NoArgsConstructor
class sndProfileDto{
    private Boolean nullObj;
    private String role;
    private String userId;
    private Long objId; // could be either one of adminId, recruiterId, studentId
    private List<Long> companyIds ; // will be null if admin, student object and >= 1 for recruiter
}

@Data
@Setter @Getter @AllArgsConstructor @NoArgsConstructor
class sndRegAckDto{
    private Boolean regComplete;
    private Boolean alreadyTaken;
}

@Data
@Setter @Getter @AllArgsConstructor @NoArgsConstructor
class sndCrtDriveAckDto{
    private Boolean createDriveComplete;
    private Boolean alreadyTaken;
}

@Data
@Setter @Getter @AllArgsConstructor @NoArgsConstructor
class sndAckDto{
    private Boolean ack;
}

@Data
@Setter @Getter @AllArgsConstructor @NoArgsConstructor
class sndDriveLstDto{
    private Boolean nullObj;
    private List<CompanyDrive> companies;
}

@Data
@Setter @Getter @AllArgsConstructor @NoArgsConstructor
class compDriveDto{
    private Boolean applied;
    private CompanyDrive company;
}

@Data
@Setter @Getter @AllArgsConstructor @NoArgsConstructor
class sndStDriveLstDto{
    private Boolean nullObj;
    private List<compDriveDto> companies;

    void addCompanies(compDriveDto cp){
        if(this.companies==null)this.companies = new ArrayList<compDriveDto>();
        companies.add(cp);
    }
}

@Data
@Setter @Getter @AllArgsConstructor @NoArgsConstructor
class sndCompDetailsDto{
    private Boolean nullObj;
    private CompanyDrive companyDetails;
}


@Data
@Setter @Getter @AllArgsConstructor @NoArgsConstructor
class sndStudProfDto{
    private Boolean nullObj;

    private String userId;
    private String password;
    private String firstName;
    private String lastName;
    private String rollNumber;
    private String batch;
    private String contactNumber;
    private Double cgpa;
    private byte[] softwareResume;
    private byte[] datascienceResume;
    private byte[] eceResume;
}
