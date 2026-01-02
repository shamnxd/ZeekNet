
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MessageCircle } from "lucide-react";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";

interface CompensationHeaderProps {
    atsApplication: CompanySideApplication | null;
    selectedStage: string;
    isCurrentStage: (stage: string) => boolean;
    currentSubStageDisplayName: string;
    candidateEmail: string;
    candidatePhone: string;
    handleEmail: (email: string) => void;
    handleCall: (phone: string) => void;
    handleChat: () => void;
}

export const CompensationHeader: React.FC<CompensationHeaderProps> = ({
    selectedStage,
    isCurrentStage,
    currentSubStageDisplayName,
    candidateEmail,
    candidatePhone,
    handleEmail,
    handleCall,
    handleChat,
}) => {
    const showActions = isCurrentStage(selectedStage);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Compensation Stage
                </h3>
                {showActions && (
                    <Badge className="bg-amber-100 text-amber-700">
                        Current Sub-stage: {currentSubStageDisplayName}
                    </Badge>
                )}
            </div>

            {showActions && (
                <div className="flex items-center gap-2 mb-4">
                    {candidateEmail && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEmail(candidateEmail)}
                            className="gap-2"
                        >
                            <Mail className="h-4 w-4" />
                            Email
                        </Button>
                    )}
                    {candidatePhone && candidatePhone !== "-" && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCall(candidatePhone)}
                            className="gap-2"
                        >
                            <Phone className="h-4 w-4" />
                            <p> {candidatePhone} </p>
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleChat}
                        className="gap-2"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Chat
                    </Button>
                </div>
            )}
        </div>
    );
};
