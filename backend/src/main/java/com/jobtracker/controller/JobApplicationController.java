package com.jobtracker.controller;

import com.jobtracker.dto.DashboardStatsDTO;
import com.jobtracker.dto.JobApplicationDTO;
import com.jobtracker.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @GetMapping
    public ResponseEntity<List<JobApplicationDTO>> getAllApplications(Authentication authentication) {
        return ResponseEntity.ok(jobApplicationService.getAllApplications(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationDTO> getApplication(
            @PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(jobApplicationService.getApplication(id, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<JobApplicationDTO> createApplication(
            @Valid @RequestBody JobApplicationDTO dto, Authentication authentication) {
        return ResponseEntity.ok(jobApplicationService.createApplication(dto, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationDTO> updateApplication(
            @PathVariable Long id, @Valid @RequestBody JobApplicationDTO dto,
            Authentication authentication) {
        return ResponseEntity.ok(jobApplicationService.updateApplication(id, dto, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(
            @PathVariable Long id, Authentication authentication) {
        jobApplicationService.deleteApplication(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobApplicationDTO>> searchApplications(
            @RequestParam String query, Authentication authentication) {
        return ResponseEntity.ok(jobApplicationService.searchApplications(query, authentication.getName()));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<JobApplicationDTO>> filterByStatus(
            @RequestParam String status, Authentication authentication) {
        return ResponseEntity.ok(jobApplicationService.filterByStatus(status, authentication.getName()));
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(Authentication authentication) {
        return ResponseEntity.ok(jobApplicationService.getDashboardStats(authentication.getName()));
    }
}
