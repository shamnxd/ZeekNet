import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { 
  Search, 
  Eye,
  Edit,
  UserX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { adminApi } from '@/api/admin.api'
import type { Company, GetAllCompaniesParams } from '@/interfaces/admin/admin-company.interface'
import { publicApi } from '@/api/public.api'
import { toast } from 'sonner'
import ReasonActionDialog from '@/components/common/ReasonActionDialog'
import { useDebounce } from '@/hooks/useDebounce'

const CompanyManagement = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCompanies, setTotalCompanies] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearchTerm = useDebounce(searchInput, 500)
  const [industryFilter, setIndustryFilter] = useState('')
  const [verificationFilter, setVerificationFilter] = useState('')
  const [blockedFilter, setBlockedFilter] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const itemsPerPage = 5
  
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params: GetAllCompaniesParams = {
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm || undefined,
        industry: industryFilter || undefined,
        isVerified: verificationFilter as 'pending' | 'rejected' | 'verified' || undefined,
        isBlocked: blockedFilter === 'blocked' ? true : blockedFilter === 'active' ? false : undefined,
      }

      const response = await adminApi.getAllCompanies(params)
      
      if (response && response.data && response.data.companies) {
        setCompanies(response.data.companies)
        setTotalPages(response.data.totalPages)
        setTotalCompanies(response.data.total)
      } else {
        setError('Failed to fetch companies')
      }
    } catch {
      setError('Failed to fetch companies')
    } finally {
      setLoading(false)
    }
  }, [currentPage, debouncedSearchTerm, industryFilter, verificationFilter, blockedFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await publicApi.getAllJobCategories({ limit: 100 })
        if (response && response.data) {
          setCategories(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }


const handleBlockConfirm = async () => {
  if (!selectedCompany) return;
  if (!selectedCompany.userId) {
    toast.error("User ID missing");
    return;
  }

  try {
    const newBlockedStatus = !selectedCompany.isBlocked;

    await adminApi.blockUser(selectedCompany.userId, newBlockedStatus);

    setCompanies(prev =>
      prev.map(c =>
        c.userId === selectedCompany.userId
          ? { ...c, isBlocked: newBlockedStatus }
          : c
      )
    );

    toast.success(
      `Company ${selectedCompany.companyName} ${
        newBlockedStatus ? "blocked" : "unblocked"
      } successfully`
    );

    setBlockDialogOpen(false);
    setSelectedCompany(null);

  } catch {
    toast.error(`Failed to ${selectedCompany.isBlocked ? "unblock" : "block"} company`);
  }
};


  const handleEmailConfirm = async () => {
    if (!selectedCompany) return
    
    try {
      toast.success(`Email verification updated for ${selectedCompany.companyName}`)
    setEmailDialogOpen(false)
    setSelectedCompany(null)
      fetchCompanies()
    } catch {
      toast.error('Failed to update email verification')
    }
  }

  const handleSearch = (value: string) => {
    setSearchInput(value)
    setCurrentPage(1)
  }

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'industry':
        setIndustryFilter(value)
        break
      case 'verification':
        setVerificationFilter(value)
        break
      case 'blocked':
        setBlockedFilter(value)
        break
    }
    setCurrentPage(1)
  }

  const blockReasons = [
    { value: 'fraudulent', label: 'Posting fraudulent jobs or misleading company information' },
    { value: 'violation', label: 'Repeated violation of platform rules, guidelines or TOS' },
    { value: 'offensive', label: 'Inappropriate or offensive behavior' },
    { value: 'duplicate', label: 'Duplicate posting or spam' },
    { value: 'abuse', label: 'Suspected scam, abuse, or exploitation' },
    { value: 'other', label: 'Other (please specify)' },
  ];
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [reasonCompany, setReasonCompany] = useState<Company|null>(null);
const handleBlockAction = (company: Company) => {
  setReasonCompany(company);
  setReasonDialogOpen(true);
};
const handleBlockReasonConfirm = async (reason: string) => {
  if (!reasonCompany) return;
  if (!reasonCompany.userId) {
    toast.error("User ID missing");
    return;
  }

  try {
    const newBlockedStatus = !reasonCompany.isBlocked;

    await adminApi.blockUser(reasonCompany.userId, newBlockedStatus);

    setCompanies(prev =>
      prev.map(c =>
        c.userId === reasonCompany.userId
          ? { ...c, isBlocked: newBlockedStatus }
          : c
      )
    );

    toast.success(
      `${reasonCompany.companyName} ${
        newBlockedStatus ? "blocked" : "unblocked"
      } successfully${newBlockedStatus ? `. Reason: ${reason}` : ""}`
    );

    setReasonDialogOpen(false);
    setReasonCompany(null);

  } catch {
    toast.error(
      `Failed to ${
        reasonCompany.isBlocked ? "unblock" : "block"
      } ${reasonCompany.companyName}`
    );
  }
};


  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Company List</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              className="pl-10"
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Industry</label>
            <select 
              className="px-3 py-2 border border-border rounded-md bg-background text-sm"
              value={industryFilter}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
            >
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Verification</label>
            <select 
              className="px-3 py-2 border border-border rounded-md bg-background text-sm"
              value={verificationFilter}
              onChange={(e) => handleFilterChange('verification', e.target.value)}
            >
              <option value="">All</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Status</label>
            <select 
              className="px-3 py-2 border border-border rounded-md bg-background text-sm"
              value={blockedFilter}
              onChange={(e) => handleFilterChange('blocked', e.target.value)}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
          </div>
            </div>

        {loading && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading companies...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-8">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchCompanies} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
        <Card className="border-0 shadow-md">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">Company</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Industry</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Organization</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Verification</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Created</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                    {companies.map((company) => (
                    <tr key={company.id} className="border-b border-border/50 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                            <img 
                              src={company.logo || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + (company.companyName?.charAt(0) || 'C')} 
                              alt={company.companyName || 'Company'}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                              <p className="font-medium text-gray-800">{company.companyName}</p>
                              <p className="text-sm text-gray-500">{company.websiteLink}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                          <span className="text-sm text-gray-700">{company.industry}</span>
                      </td>
                      <td className="p-4">
                          <span className="text-sm text-gray-700">{company.organisation}</span>
                      </td>
                        <td className="p-4">
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            company.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {company.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                            company.isVerified === 'verified' ? 'bg-green-100 text-green-700' :
                            company.isVerified === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                            {company.isVerified}
                        </span>
                      </td>
                        <td className="p-4 text-sm text-gray-700">
                          {new Date(company.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            onClick={() => handleBlockAction(company)}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        )}

        {!loading && !error && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, totalCompanies)} of {totalCompanies} companies
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 p-0 ${
                    currentPage === page 
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        )}

        <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedCompany?.isBlocked ? 'Unblock' : 'Block'} Company</DialogTitle>
              <DialogDescription>
                Are you sure you want to {selectedCompany?.isBlocked ? 'unblock' : 'block'} {selectedCompany?.companyName}? 
                {selectedCompany?.isBlocked 
                  ? ' This will restore their account access.' 
                  : ' This will prevent them from accessing their account.'
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleBlockConfirm}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {selectedCompany?.isBlocked ? 'Unblock' : 'Block'} Company
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Email Verification</DialogTitle>
              <DialogDescription>
                Are you sure you want to verify the email for {selectedCompany?.companyName}? 
                This will mark their email as verified.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleEmailConfirm}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Verify Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ReasonActionDialog
          open={reasonDialogOpen}
          onOpenChange={setReasonDialogOpen}
          title={reasonCompany?.isBlocked ? 'Unblock Company' : 'Block Company'}
          description={reasonCompany 
            ? reasonCompany.isBlocked 
              ? `Are you sure you want to unblock ${reasonCompany.companyName}?` 
              : `Please select a reason for blocking ${reasonCompany.companyName}.`
            : ''}
          reasonOptions={blockReasons}
          onConfirm={handleBlockReasonConfirm}
          actionLabel={reasonCompany?.isBlocked ? 'Unblock' : 'Block'}
          confirmVariant="destructive"
          showReasonField={!reasonCompany?.isBlocked}
        />
      </div>
    </AdminLayout>
  )
}

export default CompanyManagement