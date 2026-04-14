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
  Eye,
  IndianRupee,
  Loader2,
  CalendarIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { adminApi } from '@/api/admin.api'
import type { AdminDashboardStats } from '@/interfaces/admin/admin-dashboard-stats.interface'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'

type PeriodType = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom'

const AdminDashboard = () => {
  const navigate = useNavigate()

  const [dashboardData, setDashboardData] = useState<AdminDashboardStats | null>(null)
  const [allTimeDashboardData, setAllTimeDashboardData] = useState<AdminDashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [periodType, setPeriodType] = useState<PeriodType>('all')
  const [customRange, setCustomRange] = useState<DateRange | undefined>()

  useEffect(() => {
    const fetchAllTime = async () => {
      try {
        const response = await adminApi.getDashboardStats({ period: 'all' })
        if (response.success && response.data) {
          setAllTimeDashboardData(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch all-time dashboard stats', error)
      }
    }

    const fetchStats = async () => {
      setIsLoading(true)
      try {
        let period: 'all' | 'day' | 'week' | 'month' | 'year' = 'all'
        let startDate: string | undefined
        let endDate: string | undefined

        if (periodType === 'custom' && customRange?.from && customRange?.to) {
          period = 'week'
          const from = new Date(customRange.from)
          from.setHours(0, 0, 0, 0)
          const to = new Date(customRange.to)
          to.setHours(23, 59, 59, 999)
          startDate = from.toISOString()
          endDate = to.toISOString()
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
        } else if (periodType === 'all') {
          period = 'all'
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

    if (!allTimeDashboardData) {
      fetchAllTime()
    }

    if (periodType !== 'custom' || (customRange?.from && customRange?.to)) {
      fetchStats()
    }
  }, [periodType, customRange, allTimeDashboardData])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    )
  }

  const recentJobs = dashboardData?.recentJobs || []
  const recentOrders = dashboardData?.recentOrders || []

  // Filtered stats (changes with period filter)
  const totalCandidates = dashboardData?.stats?.totalCandidates || 0
  const totalCompanies = dashboardData?.stats?.totalCompanies || 0
  const activeJobs = dashboardData?.stats?.activeJobs || 0
  const totalJobs = dashboardData?.stats?.allJobs || 0
  const pendingCompanies = dashboardData?.stats?.pendingCompanies || 0
  const earnings = dashboardData?.stats?.earnings || 0
  const verifiedCompanies = Math.max((dashboardData?.stats?.totalCompanies || 0) - (dashboardData?.stats?.pendingCompanies || 0), 0)

  // All-time stats (used for Pie + Job Postings charts regardless of filter)
  const allTimeStats = allTimeDashboardData?.stats || dashboardData?.stats
  const allTimeVerifiedCompanies = Math.max((allTimeStats?.totalCompanies || 0) - (allTimeStats?.pendingCompanies || 0), 0)
  const unlistedJobs = allTimeStats?.unlistedJobs || 0
  const blockedJobs = allTimeStats?.blockedJobs || 0
  const closedJobs = allTimeStats?.closedJobs || 0
  const allTimeActiveJobs = allTimeStats?.activeJobs || 0
  const allTimeTotalJobs = allTimeStats?.allJobs || 0

  const periodSuffix = periodType === 'all'
    ? ''
    : periodType === 'today'
      ? ' (Today)'
      : periodType === 'week'
        ? ' (This Week)'
        : periodType === 'month'
          ? ' (This Month)'
          : periodType === 'year'
            ? ' (This Year)'
            : ' (Custom Range)'

  const summaryStats = [
    { label: `Earnings${periodSuffix}`, value: `₹ ${earnings}`, icon: IndianRupee, color: 'bg-cyan-100 text-cyan-700' },
    { label: `Total Candidates${periodSuffix}`, value: totalCandidates, icon: Users, color: 'bg-amber-100 text-amber-700' },
    { label: `Total Companies${periodSuffix}`, value: totalCompanies, icon: Building2, color: 'bg-indigo-100 text-indigo-700' },
    { label: 'Active Jobs', value: activeJobs, icon: Briefcase, color: 'bg-green-100 text-green-700' },
    { label: `Total Job Posted${periodSuffix}`, value: totalJobs, icon: Briefcase, color: 'bg-blue-100 text-blue-700' },
    { label: 'Pending Companies', value: pendingCompanies, icon: Building2, color: 'bg-rose-100 text-rose-700' },
    { label: `Verified Companies${periodSuffix}`, value: verifiedCompanies, icon: Building2, color: 'bg-violet-100 text-violet-700' },
    { label: `Total Candidate Count${periodSuffix}`, value: totalCandidates, icon: Users, color: 'bg-cyan-100 text-cyan-700' }
  ]
  const earningsOverview = dashboardData?.charts?.earningsOverview || []
  const earningsChartData = earningsOverview.map((point) => ({
    label: point.label,
    value: point.value,
  }))
  const earningsChartConfig = {
    value: {
      label: 'Earnings',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig

  const pieData = [
    { key: 'candidates', label: 'Candidates', visitors: allTimeStats?.totalCandidates || 0, fill: '#06b6d4' },
    { key: 'companies', label: 'Companies', visitors: allTimeStats?.totalCompanies || 0, fill: '#6366f1' },
    { key: 'verifiedCompanies', label: 'Verified Companies', visitors: allTimeVerifiedCompanies, fill: '#10b981' },
  ]
  const pieChartConfig = {
    visitors: { label: 'Count' },
    candidates: { label: 'Candidates', color: 'hsl(var(--chart-2))' },
    companies: { label: 'Companies', color: 'hsl(var(--chart-3))' },
    verifiedCompanies: { label: 'Verified Companies', color: 'hsl(var(--chart-4))' },
  } satisfies ChartConfig

  const jobsBars = [
    { label: 'Active Jobs', value: allTimeActiveJobs, color: 'bg-emerald-500' },
    { label: 'Unlisted Jobs', value: unlistedJobs, color: 'bg-slate-500' },
    { label: 'Blocked Jobs', value: blockedJobs, color: 'bg-rose-500' },
    { label: 'Total Jobs', value: allTimeTotalJobs, color: 'bg-blue-500' },
    { label: 'Closed Jobs', value: closedJobs, color: 'bg-amber-500' }
  ]
  const jobsChartConfig = {
    value: { label: 'Jobs', color: 'hsl(var(--chart-5))' },
  } satisfies ChartConfig

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Select value={periodType} onValueChange={(value: PeriodType) => setPeriodType(value)}>
              <SelectTrigger className="w-[190px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
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
                        'w-[280px] justify-start text-left font-normal',
                        !customRange?.from && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customRange?.from ? (
                        customRange.to ? (
                          `${format(customRange.from, 'PPP')} - ${format(customRange.to, 'PPP')}`
                        ) : (
                          format(customRange.from, 'PPP')
                        )
                      ) : (
                        'Pick date range'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      selected={customRange}
                      onSelect={setCustomRange}
                      numberOfMonths={2}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
          {summaryStats.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-600 leading-tight break-words">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-md ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 auto-rows-fr">
          <Card className="border-0 shadow-sm h-full overflow-hidden">
            <CardHeader className="pb-1.5">
              <CardTitle className="text-sm font-semibold text-gray-800">Earnings Trend (Line)</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-2 flex flex-col min-h-[230px]">
              <ChartContainer config={earningsChartConfig} className="h-36 w-full">
                <AreaChart data={earningsChartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} tickMargin={6} axisLine={false} fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="value"
                    type="monotone"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
              <div className="mt-auto text-xs text-gray-700 font-medium flex items-center justify-between">
                <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> Earnings</span>
                <span>₹ {dashboardData?.stats?.earnings || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm h-full overflow-hidden">
            <CardHeader className="pb-1.5">
              <CardTitle className="text-sm font-semibold text-gray-800">People & Companies (Pie)</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-2 flex flex-col min-h-[230px]">
              <ChartContainer config={pieChartConfig} className="mx-auto h-32 w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="label" />} />
                  <Pie
                    data={pieData}
                    dataKey="visitors"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={34}
                    outerRadius={56}
                    paddingAngle={3}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.key} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="space-y-1 mt-auto">
                {pieData.map((item) => (
                  <div key={item.key} className="flex items-center justify-between text-xs text-gray-700">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                      {item.label}
                    </span>
                    <span className="font-semibold">{item.visitors}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm h-full overflow-hidden">
            <CardHeader className="pb-1.5">
              <CardTitle className="text-sm font-semibold text-gray-800">Job Postings (Bar)</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-2 flex flex-col min-h-[230px]">
              <ChartContainer config={jobsChartConfig} className="h-32 w-full">
                <BarChart data={jobsBars.map((bar) => ({ name: bar.label, value: bar.value }))}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={8}
                    tickMargin={2}
                    tickFormatter={(value) => value.replace(' Jobs', '')}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={4}>
                    {jobsBars.map((bar) => (
                      <Cell key={bar.label} fill={
                        bar.label.includes('Active') ? '#10b981'
                          : bar.label.includes('Unlisted') ? '#64748b'
                            : bar.label.includes('Blocked') ? '#f43f5e'
                              : bar.label.includes('Closed') ? '#f59e0b'
                                : '#3b82f6'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
              <div className="space-y-1 mt-2">
                {jobsBars.map((bar) => (
                  <div key={bar.label} className="flex items-center justify-between text-xs text-gray-700">
                    <span>{bar.label}</span>
                    <span className="font-semibold">{bar.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto text-xs text-gray-700 font-medium flex items-center justify-between">
                <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> Total Job Postings</span>
                <span>{totalJobs}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800">Pending Companies</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => navigate('/admin/pending-companies')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.pendingCompanies && dashboardData.pendingCompanies.length > 0 ? (
                  dashboardData.pendingCompanies.map((company, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                          {company.logo ? (
                            <img src={company.logo} alt={company.companyName} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{company.companyName}</p>
                          <p className="text-xs text-gray-500">{company.industry}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                        onClick={() => navigate(`/admin/company-profile-view/${company.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-xs">Verify</span>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No pending companies to verify
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                        onClick={() => navigate(`/admin/jobs/${job.id}`)}
                      >
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