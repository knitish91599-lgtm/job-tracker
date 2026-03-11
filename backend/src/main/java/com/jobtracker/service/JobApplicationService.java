package com.jobtracker.service;

import com.jobtracker.dto.DashboardStatsDTO;
import com.jobtracker.dto.JobApplicationDTO;
import com.jobtracker.entity.JobApplication;
import com.jobtracker.entity.User;
import com.jobtracker.repository.JobApplicationRepository;
import com.jobtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    private String generateJobId() {
        return "JOB-" + System.currentTimeMillis() % 100000 + "-" +
                String.format("%04d", new Random().nextInt(10000));
    }

    private JobApplicationDTO toDTO(JobApplication entity) {
        JobApplicationDTO dto = new JobApplicationDTO();
        dto.setId(entity.getId());
        dto.setJobId(entity.getJobId());
        dto.setCompanyName(entity.getCompanyName());
        dto.setRole(entity.getRole());
        dto.setJobDescription(entity.getJobDescription());
        dto.setAppliedDateTime(entity.getAppliedDateTime());
        dto.setResumeVersion(entity.getResumeVersion());
        dto.setJobLinkUrl(entity.getJobLinkUrl());
        dto.setEmailUsed(entity.getEmailUsed());
        dto.setStatus(entity.getStatus());
        dto.setPlatform(entity.getPlatform());
        dto.setNotes(entity.getNotes());
        dto.setSalary(entity.getSalary());
        dto.setLocation(entity.getLocation());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    private JobApplication toEntity(JobApplicationDTO dto, User user) {
        JobApplication entity = new JobApplication();
        entity.setCompanyName(dto.getCompanyName());
        entity.setRole(dto.getRole());
        entity.setJobDescription(dto.getJobDescription());
        entity.setAppliedDateTime(dto.getAppliedDateTime() != null ? dto.getAppliedDateTime() : LocalDateTime.now());
        entity.setResumeVersion(dto.getResumeVersion());
        entity.setJobLinkUrl(dto.getJobLinkUrl());
        entity.setEmailUsed(dto.getEmailUsed());
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "Applied");
        entity.setPlatform(dto.getPlatform());
        entity.setNotes(dto.getNotes());
        entity.setSalary(dto.getSalary());
        entity.setLocation(dto.getLocation());
        entity.setUser(user);
        return entity;
    }

    public List<JobApplicationDTO> getAllApplications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return jobApplicationRepository.findByUserOrderByAppliedDateTimeDesc(user)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public JobApplicationDTO getApplication(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        JobApplication job = jobApplicationRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Job application not found"));
        return toDTO(job);
    }

    public JobApplicationDTO createApplication(JobApplicationDTO dto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        JobApplication entity = toEntity(dto, user);
        entity.setJobId(generateJobId());

        JobApplication saved = jobApplicationRepository.save(entity);
        return toDTO(saved);
    }

    public JobApplicationDTO updateApplication(Long id, JobApplicationDTO dto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        JobApplication existing = jobApplicationRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Job application not found"));

        existing.setCompanyName(dto.getCompanyName());
        existing.setRole(dto.getRole());
        existing.setJobDescription(dto.getJobDescription());
        existing.setAppliedDateTime(dto.getAppliedDateTime());
        existing.setResumeVersion(dto.getResumeVersion());
        existing.setJobLinkUrl(dto.getJobLinkUrl());
        existing.setEmailUsed(dto.getEmailUsed());
        existing.setStatus(dto.getStatus());
        existing.setPlatform(dto.getPlatform());
        existing.setNotes(dto.getNotes());
        existing.setSalary(dto.getSalary());
        existing.setLocation(dto.getLocation());

        JobApplication saved = jobApplicationRepository.save(existing);
        return toDTO(saved);
    }

    public void deleteApplication(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        JobApplication job = jobApplicationRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Job application not found"));
        jobApplicationRepository.delete(job);
    }

    public List<JobApplicationDTO> searchApplications(String query, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return jobApplicationRepository
                .findByUserAndCompanyNameContainingIgnoreCaseOrderByAppliedDateTimeDesc(user, query)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<JobApplicationDTO> filterByStatus(String status, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return jobApplicationRepository
                .findByUserAndStatusOrderByAppliedDateTimeDesc(user, status)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public DashboardStatsDTO getDashboardStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalApplications(jobApplicationRepository.countTotalForUser(user));

        Map<String, Long> statusCounts = new HashMap<>();
        List<Object[]> rawCounts = jobApplicationRepository.countByStatusForUser(user);
        for (Object[] row : rawCounts) {
            statusCounts.put((String) row[0], (Long) row[1]);
        }
        stats.setStatusCounts(statusCounts);

        // Count this week and month
        List<JobApplication> allJobs = jobApplicationRepository.findByUserOrderByAppliedDateTimeDesc(user);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekStart = now.with(WeekFields.of(Locale.getDefault()).dayOfWeek(), 1)
                .withHour(0).withMinute(0).withSecond(0);
        LocalDateTime monthStart = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        long weekCount = allJobs.stream()
                .filter(j -> j.getAppliedDateTime() != null && j.getAppliedDateTime().isAfter(weekStart))
                .count();
        long monthCount = allJobs.stream()
                .filter(j -> j.getAppliedDateTime() != null && j.getAppliedDateTime().isAfter(monthStart))
                .count();

        stats.setApplicationsThisWeek(weekCount);
        stats.setApplicationsThisMonth(monthCount);

        return stats;
    }
}
