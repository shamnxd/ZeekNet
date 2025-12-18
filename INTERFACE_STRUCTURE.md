# Interface Organization - Final Structure

## ✅ Client-Side Interfaces

### 📁 client/src/interfaces/

#### company/
- `company-contact.interface.ts` - CompanyContact
- `tech-stack-item.interface.ts` - TechStackItem
- `benefit.interface.ts` - Benefit
- `office-location.interface.ts` - OfficeLocation
- `workplace-picture.interface.ts` - WorkplacePicture
- `job-posting.interface.ts` - JobPosting

#### application/
- `application.interface.ts` - Application
- `application-details.interface.ts` - ApplicationDetails

#### job/
- `job-posting-response.interface.ts` - JobPostingResponse
- `job-posting-query.interface.ts` - JobPostingQuery
- `paginated-job-postings.interface.ts` - PaginatedJobPostings
- `job-posting-data.interface.ts` - JobPostingData
- `job-posting-step-props.interface.ts` - JobPostingStepProps

#### ui/
- `score-badge-props.interface.ts` - ScoreBadgeProps
- `loading-props.interface.ts` - LoadingProps
- `confirmation-dialog-props.interface.ts` - ConfirmationDialogProps
- `checkbox-props.interface.ts` - CheckboxProps
- `combobox-props.interface.ts` - ComboboxOption, ComboboxProps

#### layout/
- `company-layout-props.interface.ts` - CompanyLayoutProps
- `seeker-layout-props.interface.ts` - SeekerLayoutProps
- `admin-layout-props.interface.ts` - AdminLayoutProps
- `seeker-sidebar-props.interface.ts` - SeekerSidebarProps

#### root level (existing)
- `auth.ts` - Auth-related interfaces
- `chat.ts` - Chat-related interfaces
- `user.interface.ts` - UserWithDisplayData

---

## ✅ Server-Side Interfaces

### 📁 server/src/domain/interfaces/use-cases/

#### public/
- `paginated-public-jobs.interface.ts` - PaginatedPublicJobs

#### company/
- `company-profile-with-details.interface.ts` - CompanyProfileWithDetails
- `bulk-update-applications-use-case.interface.ts` - IBulkUpdateApplicationsUseCase
- `paginated-company-job-postings.interface.ts` - PaginatedCompanyJobPostings

#### admin/
- `get-all-jobs-query.interface.ts` - GetAllJobsQuery

#### notification/
- `create-notification-use-case.interface.ts` - ICreateNotificationUseCase

---

## 📊 Summary

### Client Interfaces
- **Total Files**: 25 interface files
- **Categories**: 6 (company, application, job, ui, layout, root)
- **Organization**: Each interface in its own file, grouped by domain

### Server Interfaces
- **Total Files**: 6 interface files
- **Categories**: 4 (public, company, admin, notification)
- **Organization**: Each interface in its own file, grouped by use-case domain

---

## 🎯 Benefits

1. **Single Responsibility**: Each file contains one interface (or closely related interfaces)
2. **Easy Discovery**: Clear folder structure makes finding interfaces intuitive
3. **Better Imports**: Import only what you need
4. **Maintainability**: Changes to one interface don't affect others
5. **Scalability**: Easy to add new interfaces without cluttering existing files

---

## 📝 Next Steps

Need to update all import statements across the codebase to use the new file paths.
