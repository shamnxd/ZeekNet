import { Card, CardContent } from "@/components/ui/card";

export const JobListingSkeleton = ({ limit = 6 }: { limit?: number }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
                <Card key={i} className="!p-0 border border-gray-200 bg-white">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg animate-pulse flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-100 rounded animate-pulse w-24" />
                                <div className="h-5 bg-gray-100 rounded animate-pulse w-full" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                            <div className="w-1 h-1 bg-gray-100 rounded-full" />
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                            <div className="w-1 h-1 bg-gray-100 rounded-full" />
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-16" />
                        </div>

                        <div className="space-y-2 mb-3">
                            <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
                            <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                            <div className="h-3 bg-gray-100 rounded animate-pulse w-16" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
