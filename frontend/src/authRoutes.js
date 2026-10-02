export function getDashboardPath(role, user) {
    switch (role) {
        case "student":
            return "/student-dashboard";
        case "admin":
             return "/labAdmin-dashboard";
        case "hod":
             return "/HOD-dashboard"
        case "faculty":
            return user && !user.lab_name
                ? "/faculty-dashboard"
                : "/labIncharge-dashboard";
        default:
            return "/login";
    }
}