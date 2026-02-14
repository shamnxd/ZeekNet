import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  UserX,
} from 'lucide-react'
import { adminApi } from '@/api/admin.api'
import type { User, GetAllUsersParams } from '@/interfaces/admin/admin-user.interface'
import { toast } from 'sonner'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { useDebounce } from '@/hooks/useDebounce'
import type { UserWithDisplayData } from '@/interfaces/user.interface'
import { AdminPagination } from '@/components/common/AdminPagination'
import { TableSkeleton } from '@/components/common/TableSkeleton'

const UserManagement = () => {
  const navigate = useNavigate()
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<UserWithDisplayData | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<UserWithDisplayData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1')
  const [pagination, setPagination] = useState({
    limit: 5,
    total: 0,
    totalPages: 0,
  })
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearchTerm = useDebounce(searchInput, 500)
  const [filters, setFilters] = useState<Omit<GetAllUsersParams, 'page' | 'limit'>>({
    search: '',
    role: 'seeker',
    isBlocked: undefined
  })

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await adminApi.getAllUsers({
        ...filters,
        page: currentPage,
        limit: pagination.limit
      })

      if (response && response.data && response.data.users) {
        const transformedUsers: UserWithDisplayData[] = response.data.users.map((user: User) => ({
          ...user,
          name: user.name || user.email.split('@')[0],
          appliedJobs: Math.floor(Math.random() * 15),
          accountStatus: user.isBlocked ? 'Blocked' : 'Active',
          emailVerification: user.isVerified ? 'Verified' : 'Unverified',
          joinedDate: new Date(user.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          avatar: user.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(user.name || user.email.split('@')[0])}`
        }))

        setUsers(transformedUsers)
        setPagination({
          limit: response.data.limit || 5,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
        })
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [currentPage, pagination.limit, filters])

  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearchTerm }))
    setSearchParams(prev => {
      prev.set('page', '1')
      return prev
    })
  }, [debouncedSearchTerm, setSearchParams])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = users

  const handleEmailClick = (user: User) => {
    setSelectedUser(user)
    setEmailDialogOpen(true)
  }

  const handleEmailConfirm = () => {
    toast.info('Email verification toggle not implemented yet')
    setEmailDialogOpen(false)
    setSelectedUser(null)
  }

  const handleSearch = (searchTerm: string) => {
    setSearchInput(searchTerm)
    setSearchParams(prev => {
      prev.set('page', '1')
      return prev
    })
  }

  const handleFilterChange = (key: keyof Omit<GetAllUsersParams, 'page' | 'limit'>, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      role: 'seeker'
    }))
    setSearchParams(prev => {
      prev.set('page', '1')
      return prev
    })
  }



  return (
    <AdminLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Job Seekers Management</h1>
        </div>


        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email"
              className="pl-10"
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Account Status</label>
            <select
              className="px-3 py-2 border border-border rounded-md bg-background text-sm"
              value={filters.isBlocked === undefined ? 'all' : filters.isBlocked ? 'blocked' : 'active'}
              onChange={(e) => {
                const value = e.target.value
                handleFilterChange('isBlocked', value === 'all' ? undefined : value === 'blocked')
              }}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>


        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">Job Seeker</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Applied Jobs</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Account Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Email Verification</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Joined Date</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-0">
                        <TableSkeleton columns={6} rows={pagination.limit} />
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No job seekers found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">{user.appliedJobs} Applied Jobs</span>
                        </td>
                        <td className="p-4">
                          <span className={`text-sm px-2 py-1 rounded-full ${user.accountStatus === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {user.accountStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-10 h-5 rounded-full relative cursor-pointer ${user.emailVerification === 'Verified' ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                              onClick={() => handleEmailClick(user)}
                            >
                              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${user.emailVerification === 'Verified' ? 'right-0.5' : 'left-0.5'
                                }`}></div>
                            </div>
                            <span className="text-sm text-gray-700">{user.emailVerification}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{user.joinedDate}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                              onClick={() => navigate(`/admin/seeker-profile-view/${user.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {/* Edit button removed */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              onClick={() => { setTargetUser(user); setConfirmDialogOpen(true); }}
                            >
                              <UserX className="h-4 w-4" />
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


        {!loading && (
          <AdminPagination
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
          />
        )}


        <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Email Verification</DialogTitle>
              <DialogDescription>
                Are you sure you want to {selectedUser?.isVerified ? 'unverify' : 'verify'} the email for {selectedUser?.email}?
                {selectedUser?.isVerified
                  ? ' This will mark their email as unverified.'
                  : ' This will mark their email as verified.'
                }
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
                {selectedUser?.isVerified ? 'Unverify' : 'Verify'} Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmationDialog
          isOpen={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          title={targetUser?.isBlocked ? 'Unblock Job Seeker' : 'Block Job Seeker'}
          description={targetUser
            ? targetUser.isBlocked
              ? `Are you sure you want to unblock ${targetUser.name}?`
              : `Are you sure you want to block ${targetUser.name}? This will restrict their access to the platform.`
            : ''}
          confirmText={targetUser?.isBlocked ? 'Unblock' : 'Block'}
          variant={targetUser?.isBlocked ? 'success' : 'danger'}
          onConfirm={async () => {
            if (!targetUser) return;

            try {
              const newBlockedStatus = !targetUser.isBlocked;

              await adminApi.blockUser(targetUser.id, newBlockedStatus);

              setUsers(prevUsers =>
                prevUsers.map(user =>
                  user.id === targetUser.id
                    ? { ...user, isBlocked: newBlockedStatus, accountStatus: newBlockedStatus ? 'Blocked' : 'Active' }
                    : user
                )
              );

              toast.success(`${targetUser.name} ${newBlockedStatus ? 'blocked' : 'unblocked'} successfully`);
              setConfirmDialogOpen(false);
              setTargetUser(null);
            } catch {
              toast.error(`Failed to ${targetUser.isBlocked ? 'unblock' : 'block'} ${targetUser.name}`);
            }
          }}
        />
      </div>
    </AdminLayout>
  )
}

export default UserManagement