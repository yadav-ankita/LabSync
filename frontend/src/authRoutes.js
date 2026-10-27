export function getDashboardPath(role, user) {
    switch (role) {
        case "student":
            return "/student-dashboard";
        case "admin":
             return "/labAdmin-dashboard";
        case "hod":
             return "/HOD-dashboard"
        case "labIncharge":
            return "/labIncharge-dashboard";
        case "faculty":
            return user && (user.lab_name || user.lab)
                ? "/labIncharge-dashboard"
                : "/faculty-dashboard";
        default:
            return "/login";
    }
}