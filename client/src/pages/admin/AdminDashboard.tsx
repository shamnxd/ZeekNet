import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Users,
  Building2,
  Briefcase,
  UserCheck,
  Eye,
  Info,
  AlertCircle,
  IndianRupee,
  Loader2,
  CalendarIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { adminApi } from '@/api/admin.api'
import type { AdminDashboardStats } from '@/interfaces/admin/admin-dashboard-stats.interface'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const AdminDashboard = () => {
  const navigate = useNavigate()

  const [dashboardData, setDashboardData] = useState<AdminDashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [periodType, setPeriodType] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month')
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>()
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>()

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        let period: 'day' | 'week' | 'month' | 'year' = 'month'
        let startDate: string | undefined
        let endDate: string | undefined

        if (periodType === 'custom' && customStartDate && customEndDate) {
          period = 'day' // Use day granularity for custom range
          startDate = customStartDate.toISOString()
          endDate = customEndDate.toISOString()
        } else if (periodType === 'today') {
          period = 'day'
          const today = new Date()
          startDate = new Date(today.setHours(0, 0, 0, 0)).toISOString()
          endDate = new Date(today.setHours(23, 59, 59, 999)).toISOString()
        } else if (periodType === 'week') {
          period = 'week'
        } else if (periodType === 'month') {
          period = 'month'
        } else if (periodType === 'year') {
          period = 'year'
        }

        const response = await adminApi.getDashboardStats({ period, startDate, endDate })
        if (response.success && response.data) {
          setDashboardData(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (periodType !== 'custom' || (customStartDate && customEndDate)) {
      fetchStats()
    }
  }, [periodType, customStartDate, customEndDate])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    )
  }

  const stats = [
    { label: 'Earnings', value: `₹ ${dashboardData?.stats.earnings || 0}`, icon: IndianRupee, color: 'bg-cyan-100 text-cyan-600', iconColor: 'text-cyan-600', info: true },
    { label: 'Total Candidates', value: dashboardData?.stats.totalCandidates || 0, icon: Users, color: 'bg-yellow-100 text-yellow-600', iconColor: 'text-yellow-600' },
    { label: 'Total Companies', value: dashboardData?.stats.totalCompanies || 0, icon: Building2, color: 'bg-cyan-100 text-cyan-600', iconColor: 'text-cyan-600' },
    { label: 'Total Verified Users', value: dashboardData?.stats.totalVerifiedUsers || 0, icon: UserCheck, color: 'bg-green-100 text-green-600', iconColor: 'text-green-600' },
    { label: 'Active Jobs', value: dashboardData?.stats.activeJobs || 0, icon: Briefcase, color: 'bg-green-100 text-green-600', iconColor: 'text-green-600' },
    { label: 'Expired Jobs', value: dashboardData?.stats.expiredJobs || 0, icon: Briefcase, color: 'bg-yellow-100 text-yellow-600', iconColor: 'text-yellow-600' },
    { label: 'Pending Company', value: dashboardData?.stats.pendingCompanies || 0, icon: AlertCircle, color: 'bg-red-100 text-red-600', iconColor: 'text-red-600', clickable: true, route: '/admin/pending-companies' },
    { label: 'All Jobs', value: dashboardData?.stats.allJobs || 0, icon: Briefcase, color: 'bg-blue-100 text-blue-600', iconColor: 'text-blue-600', clickable: true, route: '/admin/jobs' }
  ]

  const recentJobs = dashboardData?.recentJobs || []
  const recentOrders = dashboardData?.recentOrders || []

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`hover:shadow-lg transition-all duration-200 border-0 shadow-md ${stat.clickable ? 'cursor-pointer hover:scale-105' : ''
                }`}
              onClick={() => stat.clickable && stat.route && navigate(stat.route)}
            >
              <CardContent className="p-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-1 mb-1">
                      <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                      {stat.info && <Info className="h-3 w-3 text-gray-400" />}
                    </div>
                    <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.color} shadow-sm`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full mx-auto">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800">Your Earnings Overview</CardTitle>
                <div className="flex gap-2 items-center">
                  <Select value={periodType} onValueChange={(value: any) => setPeriodType(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>

                  {periodType === 'custom' && (
                    <div className="flex gap-2 items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[140px] justify-start text-left font-normal",
                              !customStartDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {customStartDate ? format(customStartDate, "PPP") : "Start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={customStartDate}
                            onSelect={setCustomStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <span className="text-gray-500">to</span>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[140px] justify-start text-left font-normal",
                              !customEndDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {customEndDate ? format(customEndDate, "PPP") : "End date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={customEndDate}
                            onSelect={setCustomEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-center space-x-3">
                {[
                  ...(dashboardData?.charts.earningsOverview || []).map(data => ({
                    ...data,
                    height: (data.value / (Math.max(...(dashboardData?.charts.earningsOverview || []).map(d => d.value), 100))) * 200 // dynamic height
                  }))
                ].map((data, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-8 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg shadow-sm" style={{ height: `${data.height}px` }}></div>
                    <span className="text-xs font-medium text-gray-600 mt-2">{data.label}</span>
                    <span className="text-xs text-gray-500">{data.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center mt-6">
                <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-600">Earnings (in thousands)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">Popular Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex">
                <div className="w-32 h-32 mr-4 relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="20"
                      strokeDasharray={`${25 * 2.51} 251`}
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="20"
                      strokeDasharray={`${18 * 2.51} 251`}
                      strokeDashoffset={`-${25 * 2.51}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="20"
                      strokeDasharray={`${15 * 2.51} 251`}
                      strokeDashoffset={`-${(25 + 18) * 2.51}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="20"
                      strokeDasharray={`${12 * 2.51} 251`}
                      strokeDashoffset={`-${(25 + 18 + 15) * 2.51}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="20"
                      strokeDasharray={`${10 * 2.51} 251`}
                      strokeDashoffset={`-${(25 + 18 + 15 + 12) * 2.51}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="20"
                      strokeDasharray={`${8 * 2.51} 251`}
                      strokeDashoffset={`-${(25 + 18 + 15 + 12 + 10) * 2.51}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="20"
                      strokeDasharray={`${7 * 2.51} 251`}
                      strokeDashoffset={`-${(25 + 18 + 15 + 12 + 10 + 8) * 2.51}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="20"
                      strokeDasharray={`${5 * 2.51} 251`}
                      strokeDashoffset={`-${(25 + 18 + 15 + 12 + 10 + 8 + 7) * 2.51}`}
                    />
                  </svg>
                </div>
                <div className="space-y-3 flex-1">
                  {(dashboardData?.charts.popularLocation || []).map((location, idx) => {
                    const colors = ['bg-cyan-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];
                    return (
                      <div key={location.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-3 ${colors[idx % colors.length]}`}></div>
                          <span className="text-gray-700">{location.name}</span>
                        </div>
                        <span className="text-gray-500 font-medium">{location.percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800">Recently Published Jobs</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => navigate('/admin/jobs')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentJobs.map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.experience}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">{job.jobType}</Badge>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800">Recently Purchased Orders</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => navigate('/admin/payments')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{order.orderNo}</p>
                      <p className="text-sm text-gray-500">{order.amount}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">{order.planName}</Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        {order.paymentStatus}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard