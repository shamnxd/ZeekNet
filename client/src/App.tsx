import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { NotificationProvider } from './contexts/NotificationContext'
import UserBlockHandler from './components/common/UserBlockHandler'
import Landing from './pages/public/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Verification from './pages/auth/Verification'
import AdminDashboard from './pages/admin/AdminDashboard'
import CompanyDashboard from './pages/company/CompanyDashboard'
import CompanyProfileSetup from './pages/company/CompanyProfileSetup'
import PostJob from './pages/company/PostJob'
import SeekerDashboard from './pages/seeker/SeekerDashboard'
import { SeekerProfile as SeekerProfileComponent } from './pages/seeker/SeekerProfile'
import SeekerSettings from './pages/seeker/SeekerSettings'
import SeekerApplications from './pages/seeker/SeekerApplications'
import SeekerLayout from './components/layouts/SeekerLayout'
import JobListing from './pages/public/JobListing'
import JobDetail from './pages/public/JobDetail'
import NotFound from './pages/public/NotFound'
import AdminLogin from './pages/admin/AdminLogin'
import UserManagement from './pages/admin/SeekerManagement'
import CompanyManagement from './pages/admin/CompanyManagement'
import PendingCompanies from './pages/admin/PendingCompanies'
import JobManagement from './pages/admin/JobManagement'
import JobView from './pages/admin/JobView'
import CategoryManagement from './pages/admin/CategoryManagement'
import SkillManagement from './pages/admin/SkillManagement'
import JobRoleManagement from './pages/admin/JobRoleManagement'
import SubscriptionPlanManagement from './pages/admin/SubscriptionPlanManagement'
import CompanyProfileView from './pages/admin/CompanyProfileView'
import SeekerProfileView from './pages/admin/SeekerProfileView'
import PaymentManagement from './pages/admin/PaymentManagement'
import ProtectedRoute from './components/common/ProtectedRoute'
import AuthRedirect from './components/common/AuthRedirect'
import { UserRole } from './constants/enums'
import CompanyReapplication from './pages/company/CompanyReapplication'
import CompanyProfile from './pages/company/CompanyProfile'
import CompanyJobListing from './pages/company/JobListing'
import CompanySettings from './pages/company/CompanySettings'
import JobDetails from './pages/company/JobDetails'
import EditJob from './pages/company/EditJob'
import AllApplications from './pages/company/AllApplications'
import ApplicationDetails from './pages/company/ApplicationDetails'
import CompanyPlans from './pages/company/CompanyPlans'
import CompanyChat from './pages/company/CompanyChat'
import SeekerChat from './pages/seeker/SeekerChat'
import Companies from './pages/public/Companies'
import CompanyProfilePublic from './pages/public/CompanyProfilePublic'
import FindCandidates from './pages/company/FindCandidates'
import CandidateProfileView from './pages/company/CandidateProfileView'

function App() {
  return (
    <Router>
      <NotificationProvider>
        <UserBlockHandler />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/company/:id" element={<CompanyProfilePublic />} />
          <Route path="/jobs" element={<JobListing />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          
          <Route path="/auth/login" element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          } />
          <Route path="/auth/register" element={
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          } />
          <Route path="/forgot-password" element={
            <AuthRedirect>
              <ForgotPassword />
            </AuthRedirect>
          } />
          <Route path="/reset-password" element={
            <AuthRedirect>
              <ResetPassword />
            </AuthRedirect>
          } />
          <Route path="/verify-email" element={<Verification />} />
          
          <Route path="/admin/login" element={
            <AuthRedirect>
              <AdminLogin />
            </AuthRedirect>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/seekers" element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/companies" element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <CompanyManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/pending-companies" element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <PendingCompanies />
            </ProtectedRoute>
          } />
          <Route path="/admin/jobs" element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <JobManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/jobs/:jobId" element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <JobView />
            </ProtectedRoute>
          } />
          <Route path="/admin/job-categories" element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <CategoryManagement />
            </ProtectedRoute>
          } />
            <Route path="/admin/skills" element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <SkillManagement />
            </ProtectedRoute>
          } />
            <Route path="/admin/job-roles" element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <JobRoleManagement />
            </ProtectedRoute>
          } />
            <Route path="/admin/subscription-plans" element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <SubscriptionPlanManagement />
            </ProtectedRoute>
          } />
            <Route path="/admin/company-profile-view" element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <CompanyProfileView />
              </ProtectedRoute>
            } />
            <Route path="/admin/seeker-profile-view" element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <SeekerProfileView />
              </ProtectedRoute>
            } />
            <Route path="/admin/payments" element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <PaymentManagement />
              </ProtectedRoute>
            } />
            {}
          
          <Route path="/company/dashboard" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <CompanyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/company/profile-setup" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <CompanyProfileSetup />
            </ProtectedRoute>
          } />
          <Route path="/company/post-job" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <PostJob />
            </ProtectedRoute>
          } />

          <Route path="/company/reapply" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <CompanyReapplication />
            </ProtectedRoute>
          } />
          <Route path="/company/profile" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <CompanyProfile />
            </ProtectedRoute>
          } />
          <Route path="/company/job-listing" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <CompanyJobListing />
            </ProtectedRoute>
          } />
          <Route path="/company/settings" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <CompanySettings />
            </ProtectedRoute>
          } />
          <Route path="/company/job-details/:id" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <JobDetails />
            </ProtectedRoute>
          } />
          <Route path="/company/edit-job/:id" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <EditJob />
            </ProtectedRoute>
          } />
          <Route path="/company/applicants" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <AllApplications />
            </ProtectedRoute>
          } />
          <Route path="/company/applicants/:id" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <ApplicationDetails />
            </ProtectedRoute>
          } />
          <Route path="/company/billing" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <CompanyPlans />
            </ProtectedRoute>
          } />
          <Route path="/company/messages" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <CompanyChat />
            </ProtectedRoute>
          } />

          <Route path="/company/candidates" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <FindCandidates />
            </ProtectedRoute>
          } />
          
          <Route path="/company/candidates/:id" element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
              <CandidateProfileView />
            </ProtectedRoute>
          } />
          
          <Route path="/seeker/dashboard" element={
            <ProtectedRoute allowedRoles={[UserRole.SEEKER]}>
              <SeekerLayout>
                <SeekerDashboard />
              </SeekerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seeker/profile" element={
            <ProtectedRoute allowedRoles={[UserRole.SEEKER]}>
              <SeekerLayout>
                <SeekerProfileComponent />
              </SeekerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seeker/applications" element={
            <ProtectedRoute allowedRoles={[UserRole.SEEKER]}>
              <SeekerLayout>
                <SeekerApplications />
              </SeekerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seeker/settings" element={
            <ProtectedRoute allowedRoles={[UserRole.SEEKER]}>
              <SeekerLayout>
                <SeekerSettings />
              </SeekerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seeker/messages" element={
            <ProtectedRoute allowedRoles={[UserRole.SEEKER]}>
              <SeekerChat />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </NotificationProvider>
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
    </Router>
  )
}

export default App