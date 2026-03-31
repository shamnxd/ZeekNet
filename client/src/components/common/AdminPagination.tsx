import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminPaginationProps {
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export function AdminPagination({ totalPages, totalItems, itemsPerPage }: AdminPaginationProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1');

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', page.toString());
        setSearchParams(newParams);
    };

    if (totalPages <= 1) return null;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="text-sm text-muted-foreground whitespace-nowrap">
                Showing <span className="font-medium text-foreground">{totalItems > 0 ? startIndex + 1 : 0}</span> to{' '}
                <span className="font-medium text-foreground">{endIndex}</span> of{' '}
                <span className="font-medium text-foreground">{totalItems}</span> results
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-9 px-3"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>

                <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Logic to show limited page numbers if totalPages is large
                        if (
                            totalPages > 7 &&
                            page > 1 &&
                            page < totalPages &&
                            Math.abs(page - currentPage) > 2
                        ) {
                            if (page === 2 || page === totalPages - 1) {
                                return <span key={page} className="px-2">...</span>;
                            }
                            return null;
                        }

                        return (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className={`h-9 w-9 p-0 ${currentPage === page
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-accent'
                                    }`}
                            >
                                {page}
                            </Button>
                        );
                    })}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-9 px-3"
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
