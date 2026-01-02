
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { chatApi } from "@/api/chat.api";
import { atsService } from "@/services/ats.service";
import { companyApi } from "@/api/company.api";
import { ATSStage, CompensationSubStage, SubStageDisplayNames } from "@/constants/ats-stages";
import type { CompensationStageProps } from "@/components/company/ats/stages/compensation/compensation-stage.types";
import type { CompensationMeeting } from "@/types/ats-profile";
 

export const useCompensationStage = (props: CompensationStageProps) => {
    const {
        atsApplication,
        atsJob,
        compensationData,
        compensationNotes,
        currentId,
        candidateData,
        setAtsApplication,
        setCompensationData,
        setCompensationMeetings,
    } = props;

    const navigate = useNavigate();

    const currentSubStage = atsApplication?.subStage || CompensationSubStage.NOT_INITIATED;
    const currentSubStageDisplayName = SubStageDisplayNames[currentSubStage] || currentSubStage;

    
    const jobSalaryMin = atsJob?.salary?.min || 0;
    const jobSalaryMax = atsJob?.salary?.max || 0;
    const jobSalaryRange =
        jobSalaryMin > 0 && jobSalaryMax > 0
            ? `₹${(jobSalaryMin / 100000).toFixed(1)}L - ₹${(jobSalaryMax / 100000).toFixed(1)}L`
            : "Not specified";

    const candidateExpected = compensationData?.candidateExpected || "";
    const companyProposed = compensationData?.companyProposed || "";
    
    
    const hasExpectedSalary = !!candidateExpected;
    const hasNotesOrUpdates =
        compensationNotes.length > 0 ||
        !!companyProposed ||
        (compensationData?.updatedAt &&
            compensationData?.createdAt &&
            new Date(compensationData.updatedAt) > new Date(compensationData.createdAt));
    const canApprove = hasExpectedSalary && hasNotesOrUpdates;

    const handleChat = async () => {
        if (!currentId || !candidateData?.user?._id) return;
        try {
            const conversation = await chatApi.createConversation({
                participantId: candidateData.user._id,
            });
            
             const conversationId = (conversation as { _id?: string; id?: string })?._id || conversation?.id || "";
             if (conversationId) {
                 navigate(`/company/messages?chat=${conversationId}`);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to get conversation ID.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Failed to open chat:", error);
            toast({
                title: "Error",
                description: "Failed to open chat.",
                variant: "destructive",
            });
        }
    };

    const handleApproveCompensation = async () => {
        if (!currentId) return;
        try {
            
            await atsService.updateCompensation(currentId, {
                finalAgreed: compensationData?.companyProposed || compensationData?.candidateExpected,
                approvedAt: new Date().toISOString(),
            });

            
            await companyApi.moveApplicationStage(currentId, {
                nextStage: ATSStage.COMPENSATION,
                subStage: CompensationSubStage.APPROVED,
                comment: "Compensation approved",
            });

            
            if (atsApplication) {
                setAtsApplication({
                    ...atsApplication,
                    subStage: CompensationSubStage.APPROVED,
                });
            }

            
            const compensationRes = await atsService.getCompensation(currentId);
            setCompensationData(compensationRes.data);

            toast({
                title: "Success",
                description: "Compensation approved successfully.",
            });
        } catch (error) {
            console.error("Failed to approve compensation:", error);
            toast({
                title: "Error",
                description: "Failed to approve compensation.",
                variant: "destructive",
            });
        }
    };


    const handleCompleteMeeting = async (meetingId: string) => {
        if (!currentId) return;
        try {
            await atsService.updateCompensationMeetingStatus(currentId, meetingId, "completed");
            const meetingsRes = await atsService.getCompensationMeetings(currentId);
            const meetingsData = Array.isArray(meetingsRes.data)
                ? meetingsRes.data.filter((m: CompensationMeeting | null) => m != null)
                : Array.isArray(meetingsRes)
                    ? meetingsRes.filter((m: CompensationMeeting | null) => m != null)
                    : [];
            setCompensationMeetings(meetingsData);
            toast({ title: "Success", description: "Meeting marked as completed." });
        } catch (error) {
            console.error("Failed to mark meeting as completed:", error);
            toast({ title: "Error", description: "Failed to mark meeting as completed.", variant: "destructive" });
        }
    };

    const handleCancelMeeting = async (meetingId: string) => {
        if (!currentId) return;
        try {
            await atsService.updateCompensationMeetingStatus(currentId, meetingId, "cancelled");
            const meetingsRes = await atsService.getCompensationMeetings(currentId);
            const meetingsData = Array.isArray(meetingsRes.data)
                ? meetingsRes.data.filter((m: CompensationMeeting | null) => m != null)
                : Array.isArray(meetingsRes)
                    ? meetingsRes.filter((m: CompensationMeeting | null) => m != null)
                    : [];
            setCompensationMeetings(meetingsData);
            toast({ title: "Success", description: "Meeting cancelled." });
        } catch (error) {
            console.error("Failed to cancel meeting:", error);
            toast({ title: "Error", description: "Failed to cancel meeting.", variant: "destructive" });
        }
    };

    const handleEmail = (email: string) => {
        window.location.href = `mailto:${email}`;
    };

    const handleCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    return {
        currentSubStage,
        currentSubStageDisplayName,
        jobSalaryRange,
        canApprove,
        handleChat,
        handleApproveCompensation,
        handleCompleteMeeting,
        handleCancelMeeting,
        handleEmail,
        handleCall,
    };
};
