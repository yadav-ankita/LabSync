import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { TopBar } from '../../components/TopBar'
import { useAdminContext } from "../../context/AdminContext";
import { LabCard } from "./LabCard";

export const LabResources = () => {
    const { labName, getLabs } = useAdminContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            await getLabs();
            setLoading(false);
        })();
    }, []);

    return (
        <div>
            <TopBar title="Lab Resources" subtitle="Add, update, or remove equipment across all laboratories."
                rightTop="Lab Administrator" rightBottom="Computer Engineering"
            />
            {loading ? (
                <div className="bg-white rounded-xl border p-8 text-center text-sm" style={{ borderColor: "#E3E6DF", color: "#5B6A5F" }}>
                    Loading labs...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                    {(labName || []).map((lab) => (
                        <LabCard
                            key={lab._id}
                            labName={lab.LabName}
                            faculty={lab.AssignFaculty?.name || lab.facultyName || "Not Yet Assigned"}
                            numberOfResources={lab.NumResources || 0}
                            onClick={() => navigate(`/labs/${encodeURIComponent(lab.LabName)}/resource`, { state: { returnView: "LabResources" } })}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
