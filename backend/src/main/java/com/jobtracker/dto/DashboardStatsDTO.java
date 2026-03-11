package com.jobtracker.dto;

import java.util.Map;

public class DashboardStatsDTO {
    private Long totalApplications;
    private Map<String, Long> statusCounts;
    private Long applicationsThisWeek;
    private Long applicationsThisMonth;

    public Long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(Long totalApplications) { this.totalApplications = totalApplications; }

    public Map<String, Long> getStatusCounts() { return statusCounts; }
    public void setStatusCounts(Map<String, Long> statusCounts) { this.statusCounts = statusCounts; }

    public Long getApplicationsThisWeek() { return applicationsThisWeek; }
    public void setApplicationsThisWeek(Long applicationsThisWeek) { this.applicationsThisWeek = applicationsThisWeek; }

    public Long getApplicationsThisMonth() { return applicationsThisMonth; }
    public void setApplicationsThisMonth(Long applicationsThisMonth) { this.applicationsThisMonth = applicationsThisMonth; }
}
