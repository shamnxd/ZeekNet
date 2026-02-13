
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { jobApplicationApi } from '@/api';
import { atsService } from '@/services/ats.service';

import type { ApiError } from '@/types/api-error.type';
import type { ATSInterview } from '@/types/ats';
import type { ExtendedATSTechnicalTask, ExtendedATSOfferDocument, CompensationMeeting } from '@/interfaces/seeker/application-details.types';

export const useSeekerApplicationDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState<Record<string, unknown> | null>(null);
    const [technicalTasks, setTechnicalTasks] = useState<ExtendedATSTechnicalTask[]>([]);
    const [interviews, setInterviews] = useState<ATSInterview[]>([]);
    const [offers, setOffers] = useState<ExtendedATSOfferDocument[]>([]);
    const [compensationMeetings, setCompensationMeetings] = useState<CompensationMeeting[]>([]);


    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<ExtendedATSTechnicalTask | null>(null);
    const [showSignedDocumentModal, setShowSignedDocumentModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<ExtendedATSOfferDocument | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [showDeclineConfirmDialog, setShowDeclineConfirmDialog] = useState(false);
    const [offerToDecline, setOfferToDecline] = useState<{ applicationId: string; offerId: string } | null>(null);
    const [declining, setDeclining] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            const trimmedId = typeof id === 'string' ? id.trim() : String(id);
            if (!trimmedId || trimmedId === 'undefined' || trimmedId === 'null' || trimmedId === '') {
                toast.error('Application ID not found');
                navigate('/seeker/applications');
                return;
            }

            const applicationId = trimmedId;

            try {
                setLoading(true);
                const appRes = await jobApplicationApi.getSeekerApplicationById(applicationId);
                const appData = appRes?.data?.data || appRes?.data;

                if (!appData) {
                    toast.error('Application not found');
                    navigate('/seeker/applications');
                    return;
                }

                setApplication(appData);

                const responseApplicationId = appData?.id || appData?._id || applicationId;

                if (responseApplicationId && responseApplicationId !== 'undefined' && responseApplicationId !== 'null') {
                    try {
                        const [tasksResponse, interviewsResponse, offersResponse, meetingsResponse] = await Promise.all([
                            atsService.getTechnicalTasksByApplicationForSeeker(responseApplicationId).catch(() => ({ data: [] })),
                            atsService.getInterviewsByApplicationForSeeker(responseApplicationId).catch(() => ({ data: [] })),
                            atsService.getOffersByApplicationForSeeker(responseApplicationId).catch(() => ({ data: [] })),
                            atsService.getCompensationMeetingsForSeeker(responseApplicationId).catch(() => [])
                        ]);
                        setTechnicalTasks(tasksResponse.data || []);
                        setInterviews(interviewsResponse.data || []);

                        let offersData = [];
                        if (Array.isArray(offersResponse)) {
                            offersData = offersResponse;
                        } else if (offersResponse?.data && Array.isArray(offersResponse.data)) {
                            offersData = offersResponse.data;
                        } else if (offersResponse?.data?.data && Array.isArray(offersResponse.data.data)) {
                            offersData = offersResponse.data.data;
                        }
                        setOffers(offersData);
                        setCompensationMeetings(Array.isArray(meetingsResponse) ? meetingsResponse : []);
                    } catch (err) {
                        console.error('Failed to fetch tasks/interviews/offers:', err);
                    }
                }
            } catch (error: unknown) {
                const apiError = error as ApiError;
                toast.error(apiError?.response?.data?.message || 'Failed to load application details');
                navigate('/seeker/applications');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleSubmitTask = async (data: Record<string, unknown>) => {
        if (!id || !selectedTask?.id) return;
        try {
            await atsService.submitTechnicalTask(id, selectedTask.id, data);
            toast.success('Task submitted successfully');
            const tasksResponse = await atsService.getTechnicalTasksByApplicationForSeeker(id).catch(() => ({ data: [] }));
            setTechnicalTasks(tasksResponse.data || []);
            setShowSubmissionModal(false);
            setSelectedTask(null);
        } catch (error) {
            console.error('Error submitting task:', error);
            toast.error('Failed to submit task');
            throw error;
        }
    };

    const handleUploadSignedDocument = async () => {
        if (!selectedFile || !id || !selectedOffer?.id) {
            toast.error('Please select a signed document to upload');
            return;
        }

        try {
            setUploading(true);
            await atsService.uploadSignedOfferDocument(id, selectedOffer.id, selectedFile);
            toast.success('Offer accepted successfully! Signed document uploaded.');
            const offersResponse = await atsService.getOffersByApplicationForSeeker(id).catch(() => ({ data: [] }));
            const offersData = offersResponse?.data?.data || offersResponse?.data || offersResponse || [];
            setOffers(Array.isArray(offersData) ? offersData : []);
            setShowSignedDocumentModal(false);
            setSelectedOffer(null);
            setSelectedFile(null);
            const input = document.getElementById('signed-document-upload') as HTMLInputElement;
            if (input) input.value = '';
        } catch (error) {
            console.error('Error uploading signed document:', error);
            toast.error('Failed to upload signed document');
        } finally {
            setUploading(false);
        }
    };

    const handleDeclineOffer = async (reason?: string) => {
        if (!offerToDecline) return;
        try {
            setDeclining(true);
            await atsService.declineOffer(offerToDecline.applicationId, offerToDecline.offerId, reason);
            toast.success('Offer declined');
            const offersResponse = await atsService.getOffersByApplicationForSeeker(offerToDecline.applicationId).catch(() => ({ data: [] }));
            const offersData = offersResponse?.data?.data || offersResponse?.data || offersResponse || [];
            setOffers(Array.isArray(offersData) ? offersData : []);
            setShowDeclineConfirmDialog(false);
            setOfferToDecline(null);
        } catch (error) {
            console.error('Error declining offer:', error);
            toast.error('Failed to decline offer');
        } finally {
            setDeclining(false);
        }
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return {
        id,
        navigate,
        loading,
        application,
        technicalTasks,
        interviews,
        offers,
        compensationMeetings,


        showSubmissionModal,
        setShowSubmissionModal,
        selectedTask,
        setSelectedTask,
        showSignedDocumentModal,
        setShowSignedDocumentModal,
        selectedOffer,
        setSelectedOffer,
        selectedFile,
        setSelectedFile,
        uploading,
        showDeclineConfirmDialog,
        setShowDeclineConfirmDialog,
        offerToDecline,
        setOfferToDecline,
        declining,


        handleSubmitTask,
        handleUploadSignedDocument,
        handleDeclineOffer,


        formatDateTime,
        formatDate
    };
};
