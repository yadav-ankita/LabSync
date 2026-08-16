import { Mail, FlaskConical, Send, CheckCheck, Loader2 } from "lucide-react";

export function FacultyCard({ faculty, sendStatus, onSendCredentials }) {
    const initials = faculty.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const isSending = sendStatus === "sending";
    const isSent = sendStatus === "sent";
    const isError = sendStatus === "error";

    return (
        <div className="p-5 rounded-xl border bg-white flex flex-col" style={{ borderColor: "#E3E6DF" }}>
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                    style={{ backgroundColor: "#D89A4E", color: "#1F2A24" }}
                >
                    {initials}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#1F2A24" }}>{faculty.name}</p>
                    <p className="text-xs truncate flex items-center gap-1" style={{ color: "#5B6A5F" }}>
                        <Mail size={11} /> {faculty.email}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3">
                <FlaskConical size={13} color="#D89A4E" />
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F2F4F1", color: "#5B6A5F" }}>
                    Lab {faculty.lab_name}
                </span>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: "#E3E6DF" }}>
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs" style={{ color: "#8A968D" }}>
                        Faculty Password: {faculty.password}
                    </span>
                </div>
                <button
                    onClick={() => onSendCredentials(faculty.password,faculty.email)}
                    disabled={isSending}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors"
                    style={{
                        borderColor: isSent ? "#2F6F52" : isError ? "#B3261E" : "#D89A4E",
                        color: isSent ? "#2F6F52" : isError ? "#B3261E" : "#9A5F1D",
                        backgroundColor: isSent ? "#E3EEE5" : "white",
                    }}
                >
                    {isSending && <Loader2 size={13} className="animate-spin" />}
                    {isSent && <CheckCheck size={13} />}
                    {!isSending && !isSent && <Send size={13} />}
                    {isSending ? "Sending..." : isSent ? "Sent" : isError ? "Retry" : "Send Credentials"}
                </button>
            </div>
        </div>
    );
}