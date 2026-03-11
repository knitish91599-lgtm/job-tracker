package com.jobtracker.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class JobApplicationDTO {

    private Long id;
    private String jobId;

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Role is required")
    private String role;

    private String jobDescription;
    private LocalDateTime appliedDateTime;
    private String resumeVersion;
    private String jobLinkUrl;
    private String emailUsed;
    private String status;
    private String platform;
    private String notes;
    private String salary;
    private String location;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }

    public LocalDateTime getAppliedDateTime() { return appliedDateTime; }
    public void setAppliedDateTime(LocalDateTime appliedDateTime) { this.appliedDateTime = appliedDateTime; }

    public String getResumeVersion() { return resumeVersion; }
    public void setResumeVersion(String resumeVersion) { this.resumeVersion = resumeVersion; }

    public String getJobLinkUrl() { return jobLinkUrl; }
    public void setJobLinkUrl(String jobLinkUrl) { this.jobLinkUrl = jobLinkUrl; }

    public String getEmailUsed() { return emailUsed; }
    public void setEmailUsed(String emailUsed) { this.emailUsed = emailUsed; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
