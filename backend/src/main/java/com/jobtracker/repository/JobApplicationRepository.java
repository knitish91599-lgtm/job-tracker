package com.jobtracker.repository;

import com.jobtracker.entity.JobApplication;
import com.jobtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByUserOrderByAppliedDateTimeDesc(User user);

    Optional<JobApplication> findByIdAndUser(Long id, User user);

    Optional<JobApplication> findByJobIdAndUser(String jobId, User user);

    List<JobApplication> findByUserAndStatusOrderByAppliedDateTimeDesc(User user, String status);

    List<JobApplication> findByUserAndCompanyNameContainingIgnoreCaseOrderByAppliedDateTimeDesc(User user, String companyName);

    @Query("SELECT j.status, COUNT(j) FROM JobApplication j WHERE j.user = :user GROUP BY j.status")
    List<Object[]> countByStatusForUser(@Param("user") User user);

    @Query("SELECT COUNT(j) FROM JobApplication j WHERE j.user = :user")
    Long countTotalForUser(@Param("user") User user);

    Boolean existsByJobIdAndUser(String jobId, User user);
}
