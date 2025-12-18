# ESLint Auto-Fix Script

## Files with Unused Variables (5 files)
1. src/pages/admin/SeekerManagement.tsx:362 - 'error' unused
2. src/pages/company/AllApplications.tsx:103 - 'error' unused  
3. src/pages/company/ApplicationDetails.tsx:99 - 'error' unused
4. src/pages/company/CompanyPlans.tsx:102,151,178 - 'error' unused (3x)
5. src/pages/company/CompanyProfileSetup.tsx:90 - 'err' unused

## Files with Empty Blocks (2 files)
1. src/components/common/UserProfileDropdown.tsx:29
2. src/pages/company/ApplicationDetails.tsx:131

## Files with React Hooks Issues (1 file)
1. src/components/common/FormDialog.tsx:92-93 - Conditional hooks

## Strategy
Since we have 226 issues and most are `any` types, I'll:
1. Fix quick wins first (unused vars, empty blocks) - ~10 issues
2. Fix React hooks issues - ~14 issues  
3. Fix `any` types in batches by file - ~200 issues

This will be done in multiple commits to keep changes manageable.
