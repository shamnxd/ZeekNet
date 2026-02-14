import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Search,

  FileText,
  ExternalLink
} from 'lucide-react'
import { adminApi } from '@/api/admin.api'
import type { Company } from '@/interfaces/admin/admin-company.interface'
import { publicApi } from '@/api/public.api'
import { toast } from 'sonner'
import { TableSkeleton } from '@/components/common/TableSkeleton'
import { AdminPagination } from '@/components/common/AdminPagination'

const PendingCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  const fetchPendingCompanies = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await adminApi.getPendingCompanies()

      if (response && response.data && response.data.companies) {
        setCompanies(response.data.companies as Company[])
      } else {
        setError('Failed to fetch pending companies')
      }
    } catch {
      setError('Failed to fetch pending companies')
    } finally {
      setLoading(false)
    }
  }, [])


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
    fetchPendingCompanies()
    fetchCategories()
  }, [fetchPendingCompanies])

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = !searchTerm ||
      company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || company.isVerified === statusFilter
    const matchesIndustry = !industryFilter || company.industry === industryFilter

    return matchesSearch && matchesStatus && matchesIndustry
  })

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company)
    setDetailsDialogOpen(true)
  }

  const handleAccept = (company: Company) => {
    setSelectedCompany(company)
    setAcceptDialogOpen(true)
  }

  const handleReject = (company: Company) => {
    setSelectedCompany(company)
    setRejectionReason('')
    setRejectDialogOpen(true)
  }

  const handleAcceptConfirm = async () => {
    if (!selectedCompany) return

    try {
      await adminApi.verifyCompany({
        companyId: selectedCompany.id,
        isVerified: 'verified'
      })

      toast.success(`Company ${selectedCompany.companyName || 'Unknown'} accepted successfully`)
      setAcceptDialogOpen(false)
      setSelectedCompany(null)
      fetchPendingCompanies()
    } catch {
      toast.error('Failed to accept company')
    }
  }

  const handleRejectConfirm = async () => {
    if (!selectedCompany) return

    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    try {
      await adminApi.verifyCompany({
        companyId: selectedCompany.id,
        isVerified: 'rejected',
        rejection_reason: rejectionReason.trim()
      })

      toast.success(`Company ${selectedCompany.companyName || 'Unknown'} rejected successfully`)
      setRejectDialogOpen(false)
      setSelectedCompany(null)
      setRejectionReason('')
      fetchPendingCompanies()
    } catch {
      toast.error('Failed to reject company')
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'status':
        setStatusFilter(value)
        break
      case 'industry':
        setIndustryFilter(value)
        break
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Pending Companies</h1>
        </div>


        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Status</label>
            <select
              className="px-3 py-2 border border-border rounded-md bg-background text-sm"
              value={statusFilter}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
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
        </div>


        {loading ? (
          <TableSkeleton columns={7} rows={5} />
        ) : error ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-8">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchPendingCompanies} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="border-0 shadow-md">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Company</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Industry</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Organization</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Employees</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Submitted Date</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompanies.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-500">
                            No pending companies found
                          </td>
                        </tr>
                      ) : (
                        filteredCompanies.map((company) => (
                          <tr key={company.id} className="border-b border-border/50 hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={company.logo || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + (company.companyName?.charAt(0) || 'C')}
                                  alt={company.companyName || 'Company'}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">{company.companyName || 'Unknown Company'}</p>
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
                              <span className="text-sm text-gray-700">{company.employeeCount}+</span>
                            </td>
                            <td className="p-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${company.isVerified === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                                }`}>
                                {company.isVerified === 'pending' ? 'Pending' : 'Rejected'}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-gray-700">
                              {new Date(company.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                                  onClick={() => handleViewDetails(company)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleAccept(company)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleReject(company)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <AdminPagination
              totalPages={1}
              totalItems={filteredCompanies.length}
              itemsPerPage={filteredCompanies.length}
            />
          </>
        )}


        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">

            <DialogHeader className="px-6 py-4 border-b border-border/50 flex-shrink-0">
              <DialogTitle className="text-xl font-semibold">Company Details</DialogTitle>
              <DialogDescription>
                Review the complete information for {selectedCompany?.companyName}
              </DialogDescription>
            </DialogHeader>


            <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
              {selectedCompany && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedCompany.logo || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + (selectedCompany.companyName?.charAt(0) || 'C')}
                      alt={selectedCompany.companyName || 'Company'}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{selectedCompany.companyName || 'Unknown Company'}</h3>
                      <p className="text-gray-600">{selectedCompany.websiteLink}</p>
                      <p className="text-sm text-gray-500">Created: {new Date(selectedCompany.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Industry</label>
                      <p className="text-sm text-gray-900">{selectedCompany.industry}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Organization</label>
                      <p className="text-sm text-gray-900">{selectedCompany.organisation}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Employees</label>
                      <p className="text-sm text-gray-900">{selectedCompany.employeeCount}+</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <span className={`text-xs px-2 py-1 rounded-full ${selectedCompany.isVerified === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                        }`}>
                        {selectedCompany.isVerified === 'pending' ? 'Pending' : 'Rejected'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">About Us</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedCompany.aboutUs || 'No description provided'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Verification Status</label>
                    <div className="mt-2">
                      <span className={`text-sm px-3 py-1 rounded-full ${selectedCompany.isVerified === 'verified' ? 'bg-green-100 text-green-700' :
                        selectedCompany.isVerified === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {selectedCompany.isVerified.charAt(0).toUpperCase() + selectedCompany.isVerified.slice(1)}
                      </span>
                    </div>
                  </div>


                  {selectedCompany.verification && (
                    <div className="border-t pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <h4 className="text-lg font-semibold text-gray-900">Verification Documents</h4>
                      </div>

                      <div className="grid grid-cols-1 gap-4">

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <label className="text-sm font-medium text-gray-700 block mb-2">Tax ID</label>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-900 font-mono bg-white px-3 py-2 rounded border">
                              {selectedCompany.verification.taxId || 'Not provided'}
                            </span>
                            {selectedCompany.verification.taxId && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => {
                                  navigator.clipboard.writeText(selectedCompany.verification?.taxId || '');
                                  toast.success('Tax ID copied to clipboard');
                                }}
                              >
                                Copy
                              </Button>
                            )}
                          </div>
                        </div>


                        <div className="bg-gray-50 p-4 rounded-lg">
                          <label className="text-sm font-medium text-gray-700 block mb-2">Business License</label>
                          <div className="flex items-center justify-between">
                            {selectedCompany.verification.businessLicenseUrl ? (
                              <>
                                <span className="text-sm text-gray-900 truncate flex-1 mr-2">
                                  {(() => {
                                    const url = selectedCompany.verification.businessLicenseUrl;
                                    const urlWithoutQuery = url.split('?')[0];
                                    return urlWithoutQuery.split('/').pop() || 'Business License Document';
                                  })()}
                                </span>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => {
                                      const url = selectedCompany.verification?.businessLicenseUrl || '';
                                      window.open(url, '_blank');
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => {
                                      const url = selectedCompany.verification?.businessLicenseUrl || '';
                                      const urlWithoutQuery = url.split('?')[0];
                                      const filename = urlWithoutQuery.split('/').pop() || 'business-license';
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = filename;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <span className="text-sm text-gray-500 italic">No business license uploaded</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                  {!selectedCompany.verification && (
                    <div className="border-t pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <h4 className="text-lg font-semibold text-gray-900">Verification Documents</h4>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm text-yellow-800">
                            No verification documents have been uploaded by this company.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>


            <div className="px-6 py-4 border-t border-border/50 bg-gray-50/50 flex-shrink-0">
              <div className="flex justify-between w-full">
                <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                  Close
                </Button>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => {
                      setDetailsDialogOpen(false)
                      handleReject(selectedCompany!)
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setDetailsDialogOpen(false)
                      handleAccept(selectedCompany!)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>


        <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accept Company</DialogTitle>
              <DialogDescription>
                Are you sure you want to accept {selectedCompany?.companyName}? This will approve their registration and grant them access to the platform.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAcceptDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleAcceptConfirm}
              >
                Accept Company
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Company</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject {selectedCompany?.companyName}? This will deny their registration and they will need to reapply.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="rejection-reason" className="text-sm font-medium mb-2 block">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="rejection-reason"
                  className="w-full min-h-[120px] px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  placeholder="Please provide a reason for rejecting this company..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This reason will be shown to the company when they view their verification status.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setRejectDialogOpen(false)
                setRejectionReason('')
              }}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectConfirm}
                disabled={!rejectionReason.trim()}
              >
                Reject Company
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

export default PendingCompanies