# 🔍 Remaining Inline Interfaces & Types Report

## Summary
Found **43 inline interfaces** and **10 inline types** that should be extracted.

---

## 📁 Client-Side Inline Interfaces (43 files)

### UI Components (6 interfaces)
1. ✅ `score-badge.tsx` - `ScoreBadgeProps` (already extracted to interfaces/ui/)
2. ✅ `loading.tsx` - `LoadingProps` (already extracted to interfaces/ui/)
3. ✅ `confirmation-dialog.tsx` - `ConfirmationDialogProps` (already extracted to interfaces/ui/)
4. ✅ `combobox.tsx` - `ComboboxOption`, `ComboboxProps` (already extracted to interfaces/ui/)
5. ✅ `checkbox.tsx` - `CheckboxProps` (already extracted to interfaces/ui/)

**Action**: Update these files to import from interfaces/ui/ instead of defining inline

---

### Layout Components (3 interfaces)
6. ✅ `CompanyLayout.tsx` - `CompanyLayoutProps` (already extracted to interfaces/layout/)
7. ✅ `SeekerLayout.tsx` - `SeekerLayoutProps` (already extracted to interfaces/layout/)
8. ✅ `AdminLayout.tsx` - `AdminLayoutProps` (already extracted to interfaces/layout/)

**Action**: Update these files to import from interfaces/layout/

---

### Sidebar Components (1 interface)
9. ✅ `SeekerSidebar.tsx` - `SeekerSidebarProps` (already extracted to interfaces/layout/)

**Action**: Update to import from interfaces/layout/

---

### Notification Components (1 interface)
10. `NotificationDropdown.tsx` - `NotificationDropdownProps`

**Action**: Create `interfaces/notification/notification-dropdown-props.interface.ts`

---

### Job Components (3 interfaces)
11. `SidebarFilters.tsx` - `SidebarFiltersProps`
12. `ResumeAnalyzerModal.tsx` - `ResumeAnalyzerModalProps`
13. `JobCard.tsx` - `JobCardProps`

**Action**: Create separate interface files in `interfaces/job/`

---

### Header Components (1 interface)
14. `SeekerHeader.tsx` - `SeekerHeaderProps`

**Action**: Create `interfaces/header/seeker-header-props.interface.ts`

---

### Company Components (2 interfaces)
15. `NavigationButtons.tsx` - `NavigationButtonsProps`
16. `JobDescriptionTextField.tsx` - `TextFieldProps`

**Action**: Create separate interface files in `interfaces/company/`

---

### Company Dialog Components (11 interfaces - DUPLICATES!)
17. ⚠️ `EditWorkplacePicturesDialog.tsx` - `WorkplacePicture` (DUPLICATE - already in interfaces/company/)
18. `EditWorkplacePicturesDialog.tsx` - `EditWorkplacePicturesDialogProps`
19. ⚠️ `EditTechStackDialog.tsx` - `TechStackItem` (DUPLICATE - already in interfaces/company/)
20. `EditTechStackDialog.tsx` - `EditTechStackDialogProps`
21. ⚠️ `EditOfficeLocationDialog.tsx` - `OfficeLocation` (DUPLICATE - already in interfaces/company/)
22. `EditOfficeLocationDialog.tsx` - `EditOfficeLocationDialogProps`
23. ⚠️ `EditContactDialog.tsx` - `CompanyContact` (DUPLICATE - already in interfaces/company/)
24. `EditContactDialog.tsx` - `EditContactDialogProps`
25. ⚠️ `EditBenefitsDialog.tsx` - `Benefit` (DUPLICATE - already in interfaces/company/)
26. `EditBenefitsDialog.tsx` - `EditBenefitsDialogProps`
27. `EditAboutDialog.tsx` - `EditAboutDialogProps`
28. `PurchaseSubscriptionDialog.tsx` - `PurchaseConfirmationDialogProps`
29. `PurchaseSubscriptionDialog.tsx` - `PurchaseResultDialogProps`

**Action**: 
- Import duplicates from interfaces/company/
- Create dialog props interfaces in `interfaces/company/dialogs/`

---

### Common Components (10 interfaces)
30. `ArrayInputField.tsx` - `ArrayInputFieldProps`
31. `ReasonActionDialog.tsx` - `ReasonOption`
32. `ReasonActionDialog.tsx` - `ReasonActionDialogProps`
33. `ProtectedRoute.tsx` - `ProtectedRouteProps`
34. `ImageCropper.tsx` - `ImageCropperProps`
35. `FormDialog.tsx` - `ValidationRule`
36. `FormDialog.tsx` - `FormField`
37. `FormDialog.tsx` - `FieldGroup`
38. `FormDialog.tsx` - `BasicFormDialogProps`
39. `FormDialog.tsx` - `AdvancedFormDialogProps`
40. `AuthRedirect.tsx` - `AuthRedirectProps`
41. `AuthProvider.tsx` - `AuthProviderProps`

**Action**: Create separate interface files in `interfaces/common/`

---

## 📝 Client-Side Inline Types (10 types)

### Page Types (7 types)
1. `SeekerChat.tsx` - `UiConversation` (extends ConversationResponseDto)
2. `SeekerChat.tsx` - `UiMessage` (alias for ChatMessageResponseDto)
3. `SeekerApplications.tsx` - `Stage` (alias for ApplicationStage)
4. `CompanyReapplication.tsx` - `CompanyProfileFormData` (Zod infer)
5. `CompanyProfileSetup.tsx` - `CompanyProfileFormData` (Zod infer)
6. `CompanyChat.tsx` - `UiConversation` (extends ConversationResponseDto)
7. `CompanyChat.tsx` - `UiMessage` (alias for ChatMessageResponseDto)

**Decision**: 
- ✅ Keep Zod infer types inline (they're derived from schemas)
- ✅ Keep simple type aliases inline (Stage, UiMessage)
- ⚠️ Consider extracting UiConversation (it's duplicated)

---

### Component Types (3 types)
8. `SeekerSidebar.tsx` - `Page` (union type)
9. `SeekerLayout.tsx` - `Page` (union type - DUPLICATE!)
10. `FormDialog.tsx` - `FormDialogProps` (union of two interfaces)

**Decision**:
- ⚠️ Extract `Page` type (duplicated in 2 files)
- ✅ Keep `FormDialogProps` inline (it's a union of local interfaces)

---

## 🎯 Recommended Actions

### Priority 1: Fix Duplicates (URGENT)
These interfaces are defined TWICE - once in interfaces/ and once inline:
- ⚠️ `WorkplacePicture` - in EditWorkplacePicturesDialog.tsx
- ⚠️ `TechStackItem` - in EditTechStackDialog.tsx
- ⚠️ `OfficeLocation` - in EditOfficeLocationDialog.tsx
- ⚠️ `CompanyContact` - in EditContactDialog.tsx
- ⚠️ `Benefit` - in EditBenefitsDialog.tsx

**Action**: Update these 5 files to import from `interfaces/company/` instead

---

### Priority 2: Extract Component Props
Create interface files for all component props:
- Create `interfaces/job/` folder with 3 files
- Create `interfaces/header/` folder with 1 file
- Create `interfaces/notification/` folder with 1 file
- Create `interfaces/common/` folder with 11 files
- Create `interfaces/company/dialogs/` folder with 8 files

---

### Priority 3: Update Existing Files
Update these files to import from interfaces instead of defining inline:
- 6 UI component files
- 3 Layout component files
- 1 Sidebar component file

---

## 📊 Statistics

| Category | Count | Status |
|----------|-------|--------|
| **Inline Interfaces** | 43 | ⚠️ Need extraction |
| **Duplicate Interfaces** | 5 | 🔴 URGENT - Fix imports |
| **Already Extracted** | 9 | ✅ Just need to update imports |
| **Inline Types** | 10 | ⚠️ Review case-by-case |
| **Type Aliases (OK)** | 5 | ✅ Can keep inline |
| **Zod Infers (OK)** | 2 | ✅ Should keep inline |
| **Duplicated Types** | 3 | ⚠️ Extract to shared file |

---

## 🚀 Next Steps

1. **Fix duplicate imports** (5 files) - URGENT
2. **Update UI/Layout components** to import from interfaces (10 files)
3. **Create new interface folders** (job, header, notification, common, company/dialogs)
4. **Extract remaining interfaces** (24 new interface files)
5. **Extract duplicated types** (Page, UiConversation)

**Total Work**: ~40 files to update/create
