import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Building2, 
  Briefcase, 
  UserCheck,
  Eye,
  Info,
  AlertCircle,
  IndianRupee
} from 'lucide-react'

const AdminDashboard = () => {
  const navigate = useNavigate()
  
  const stats = [
    { label: 'Earnings', value: '₹ 540', icon: IndianRupee, color: 'bg-cyan-100 text-cyan-600', iconColor: 'text-cyan-600', info: true },
    { label: 'Total Candidates', value: '31', icon: Users, color: 'bg-yellow-100 text-yellow-600', iconColor: 'text-yellow-600' },
    { label: 'Total Companies', value: '11', icon: Building2, color: 'bg-cyan-100 text-cyan-600', iconColor: 'text-cyan-600' },
    { label: 'Total Verified Users', value: '41', icon: UserCheck, color: 'bg-green-100 text-green-600', iconColor: 'text-green-600' },
    { label: 'Active Jobs', value: '924', icon: Briefcase, color: 'bg-green-100 text-green-600', iconColor: 'text-green-600' },
    { label: 'Expired Jobs', value: '10', icon: Briefcase, color: 'bg-yellow-100 text-yellow-600', iconColor: 'text-yellow-600' },
    { label: 'Pending Company', value: '16', icon: AlertCircle, color: 'bg-red-100 text-red-600', iconColor: 'text-red-600', clickable: true, route: '/admin/pending-companies' },
    { label: 'All Jobs', value: '950', icon: Briefcase, color: 'bg-blue-100 text-blue-600', iconColor: 'text-blue-600', clickable: true, route: '/admin/jobs' }
  ]

  const recentJobs = [
    { title: 'MERN Stack Developer', experience: '5+ Years', jobType: 'Intern' },
    { title: 'React Developer', experience: '3+ Years', jobType: 'Freelance' }
  ]

  const recentOrders = [
    { orderNo: '#401791570', amount: '$ 100', planName: 'Standard Plan', paymentProvider: 'Offline (Cash On)', paymentStatus: 'Paid', createdTime: '9 hours ago' },
    { orderNo: '#460550587', amount: '$ 100', planName: 'Free Plan', paymentProvider: 'Offline', paymentStatus: 'Paid', createdTime: '9 hours ago' }
  ]

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
              className={`hover:shadow-lg transition-all duration-200 border-0 shadow-md ${
                stat.clickable ? 'cursor-pointer hover:scale-105' : ''
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
              <CardTitle className="text-lg font-semibold text-gray-800">Your Earnings Overview Of This Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-center space-x-3">
                {[
                  { month: 'Jan', value: 120, height: 24 },
                  { month: 'Feb', value: 150, height: 50 },
                  { month: 'Mar', value: 180, height: 36 },
                  { month: 'Apr', value: 200, height: 110 },
                  { month: 'May', value: 140, height: 28 },
                  { month: 'Jun', value: 300, height: 200 },
                  { month: 'Jul', value: 250, height: 50 },
                  { month: 'Aug', value: 280, height: 56 },
                  { month: 'Sep', value: 320, height: 110 },
                  { month: 'Oct', value: 290, height: 58 },
                  { month: 'Nov', value: 350, height: 70 },
                  { month: 'Dec', value: 400, height: 80 }
                ].map((data) => (
                  <div key={data.month} className="flex flex-col items-center">
                    <div className="w-8 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg shadow-sm" style={{ height: `${data.height}px` }}></div>
                    <span className="text-xs font-medium text-gray-600 mt-2">{data.month}</span>
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
                  {[
                    { name: 'United States', percentage: 25, color: 'bg-cyan-500' },
                    { name: 'United Kingdom', percentage: 18, color: 'bg-blue-500' },
                    { name: 'Canada', percentage: 15, color: 'bg-green-500' },
                    { name: 'Australia', percentage: 12, color: 'bg-yellow-500' },
                    { name: 'Germany', percentage: 10, color: 'bg-red-500' },
                    { name: 'France', percentage: 8, color: 'bg-purple-500' },
                    { name: 'Japan', percentage: 7, color: 'bg-pink-500' },
                    { name: 'India', percentage: 5, color: 'bg-orange-500' }
                  ].map((location) => (
                    <div key={location.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${location.color}`}></div>
                        <span className="text-gray-700">{location.name}</span>
                      </div>
                      <span className="text-gray-500 font-medium">{location.percentage}%</span>
                    </div>
                  ))}
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