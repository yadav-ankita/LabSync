export function getDashboardPath(role) {
    switch (role) {
        case "student":
            return "/student-dashboard";
        case "admin":
             return "/labAdmin-dashboard";
        case "hod":
             return "/HOD-dashboard"
        case "faculty":
            return "/labIncharge-dashboard";
        default:
            return "/login";
    }
}