# SOLID Principles Breaches Report
**Generated:** 2026-01-01  
**Project:** ZeekNet Server

## Executive Summary
This report identifies violations of SOLID principles and Clean Architecture patterns in the ZeekNet server codebase. The violations are categorized by severity and impact.

---

## 🔴 Critical Violations

### 1. **Dependency Inversion Principle (DIP) - Infrastructure Leakage in Models**
**Severity:** Critical  
**Location:** `infrastructure/database/mongodb/models/*.model.ts`

**Issue:** Mongoose-specific types (`mongoose.Types.ObjectId`) are used directly in model interfaces, creating tight coupling between the domain/application layer and MongoDB infrastructure.

**Affected Files:**
- `ats-comment.model.ts` (lines 5, 7)
- `ats-activity.model.ts` (lines 5, 9)
- `ats-compensation-meeting.model.ts` (line 4)
- `ats-compensation.model.ts` (lines 4, 11)
- `ats-offer.model.ts` (lines 4, 9, 17)
- `ats-interview.model.ts` (line 4)
- `ats-technical-task.model.ts` (line 4)

**Impact:**
- Domain layer depends on infrastructure implementation
- Difficult to swap database implementations
- Violates Clean Architecture boundaries

**Recommendation:**
```typescript
// ❌ Bad - Infrastructure type in model
interface ATSCommentDocument {
  applicationId: mongoose.Types.ObjectId;
  addedBy: mongoose.Types.ObjectId;
}

// ✅ Good - Use domain types
interface ATSCommentDocument {
  applicationId: string;
  addedBy: string;
}
```

---

### 2. **Dependency Inversion Principle (DIP) - Direct Service Instantiation in Middleware**
**Severity:** Critical  
**Location:** `presentation/middleware/auth.middleware.ts`

**Issue:** Direct instantiation of `JwtTokenService` at module level (line 10) violates DIP and prevents dependency injection.

```typescript
// ❌ Line 10
const tokenService = new JwtTokenService();
```

**Impact:**
- Cannot mock for testing
- Tight coupling to concrete implementation
- Violates Dependency Injection pattern

**Recommendation:**
```typescript
// ✅ Create a factory or inject the service
export function createAuthMiddleware(tokenService: IJwtTokenService) {
  return function authenticateToken(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
    // ... implementation
  };
}
```

---

### 3. **Single Responsibility Principle (SRP) - Business Logic in Controllers**
**Severity:** High  
**Location:** Multiple controllers

**Issue:** Controllers contain business logic that should be in use cases or domain services.

**Examples:**

#### a) `ats-activity.controller.ts` (lines 17-31)
```typescript
// ❌ Cursor parsing logic in controller
let parsedCursor: { createdAt: Date; _id: string } | undefined;
if (cursor) {
  try {
    const [createdAtStr, id] = cursor.split('_');
    if (createdAtStr && id) {
      parsedCursor = {
        createdAt: new Date(parseInt(createdAtStr, 10)),
        _id: id,
      };
    }
  } catch (err) {
    // Invalid cursor format, ignore and start from beginning
  }
}
```

**Recommendation:** Move cursor parsing to a dedicated service or utility.

#### b) `company-job-posting.controller.ts` (lines 55-58, 92-95, 109-112, 132-135)
```typescript
// ❌ Repeated company profile fetching logic
const companyProfile = await this._getCompanyProfileByUserIdUseCase.execute(userId);
if (!companyProfile) {
  throw new Error('Company profile not found');
}
```

**Impact:**
- Code duplication (4 instances in one file)
- Controller doing orchestration work
- Violates DRY principle

**Recommendation:** 
- Create a middleware to attach company profile to request
- Or create a base use case that handles company profile validation

---

### 4. **Dependency Inversion Principle (DIP) - Static Service Usage in Controllers**
**Severity:** High  
**Location:** Controllers using `UploadService` statically

**Affected Files:**
- `seeker/job-application.controller.ts` (lines 58, 260, 515)
- `company/ats-technical-task.controller.ts` (lines 40, 102)
- `company/ats-offer.controller.ts` (line 39)

**Issue:** Using static methods from `UploadService` instead of injecting the service.

```typescript
// ❌ Static method call
const uploadResult = await UploadService.handleOfferLetterUpload(req, this.s3Service, 'document');
```

**Impact:**
- Cannot mock for testing
- Tight coupling to implementation
- Violates Dependency Injection pattern

**Recommendation:**
```typescript
// ✅ Inject upload service
constructor(
  private uploadService: IUploadService,
  private s3Service: IS3Service
) {}

// Use instance method
const uploadResult = await this.uploadService.handleOfferLetterUpload(req, 'document');
```

---

## 🟡 Medium Severity Violations

### 5. **Open/Closed Principle (OCP) - Hardcoded Validation in Controllers**
**Severity:** Medium  
**Location:** `company-job-posting.controller.ts` (lines 123-127)

**Issue:** Status validation logic hardcoded in controller.

```typescript
// ❌ Hardcoded validation
const validStatuses = ['active', 'unlisted', 'expired'];
if (!status || !validStatuses.includes(status)) {
  return handleValidationError('status must be one of: active, unlisted, expired', next);
}
```

**Recommendation:** Use enum or domain value object for job status validation.

---

### 6. **Interface Segregation Principle (ISP) - Fat Controller Constructors**
**Severity:** Medium  
**Location:** `company-job-posting.controller.ts`

**Issue:** Controller depends on 11 different use cases, suggesting it has too many responsibilities.

```typescript
// ❌ Too many dependencies (lines 20-32)
constructor(
  private readonly _createJobPostingUseCase: ICreateJobPostingUseCase,
  private readonly _getJobPostingUseCase: IGetJobPostingUseCase,
  private readonly _getCompanyJobPostingsUseCase: IGetCompanyJobPostingsUseCase,
  private readonly _updateJobPostingUseCase: IUpdateJobPostingUseCase,
  private readonly _deleteJobPostingUseCase: IDeleteJobPostingUseCase,
  private readonly _incrementJobViewCountUseCase: IIncrementJobViewCountUseCase,
  private readonly _updateJobStatusUseCase: IUpdateJobStatusUseCase,
  private readonly _getCompanyJobPostingUseCase: IGetCompanyJobPostingUseCase,
  private readonly _getCompanyProfileByUserIdUseCase: IGetCompanyProfileByUserIdUseCase,
  private readonly _closeJobManuallyUseCase: CloseJobManuallyUseCase,
  private readonly _reopenJobUseCase: ReopenJobUseCase,
) {}
```

**Impact:**
- Controller has too many responsibilities
- Difficult to test
- High coupling

**Recommendation:** Split into multiple controllers:
- `JobPostingCRUDController`
- `JobPostingStatusController`
- `JobPostingLifecycleController`

---

### 7. **Dependency Inversion Principle (DIP) - Concrete Class Dependencies**
**Severity:** Medium  
**Location:** `company-job-posting.controller.ts` (lines 30-31)

**Issue:** Depending on concrete use case classes instead of interfaces.

```typescript
// ❌ Concrete class dependency
private readonly _closeJobManuallyUseCase: CloseJobManuallyUseCase,
private readonly _reopenJobUseCase: ReopenJobUseCase,
```

**Recommendation:**
```typescript
// ✅ Depend on interfaces
private readonly _closeJobManuallyUseCase: ICloseJobManuallyUseCase,
private readonly _reopenJobUseCase: IReopenJobUseCase,
```

---

### 8. **Single Responsibility Principle (SRP) - Middleware with Multiple Responsibilities**
**Severity:** Medium  
**Location:** `subscription.middleware.ts`

**Issue:** `SubscriptionMiddleware` class has 3 different middleware methods that could be separate.

```typescript
// Lines 14-44, 46-62, 64-85
checkActiveSubscription()
checkCanPostJob()
checkCanPostFeaturedJob()
```

**Recommendation:** Each middleware function should be a separate, focused middleware.

---

## 🟢 Low Severity Violations

### 9. **Single Responsibility Principle (SRP) - Error Handling Mixed with Business Logic**
**Severity:** Low  
**Location:** Multiple controllers

**Issue:** Controllers handle both business logic orchestration and error formatting.

**Example:** `ats-offer.controller.ts` (lines 95-102)
```typescript
catch (error) {
  console.error('Error updating offer status:', error);
  if (error instanceof Error && error.message.includes('not found')) {
    sendNotFoundResponse(res, error.message);
    return;
  }
  sendInternalServerErrorResponse(res, 'Failed to update offer status');
}
```

**Recommendation:** Use centralized error handling middleware.

---

### 10. **Liskov Substitution Principle (LSP) - Type Casting in Middleware**
**Severity:** Low  
**Location:** `subscription.middleware.ts` (lines 38, 48, 66)

**Issue:** Type assertions used to extend request object.

```typescript
// ❌ Type casting
(req as AuthenticatedRequest & { subscription: typeof subscription }).subscription = subscription;
```

**Recommendation:** Properly extend the `AuthenticatedRequest` interface.

---

## 📊 Summary Statistics

| Violation Type | Count | Severity |
|---------------|-------|----------|
| Dependency Inversion (DIP) | 4 | Critical/High |
| Single Responsibility (SRP) | 4 | High/Medium |
| Open/Closed (OCP) | 1 | Medium |
| Interface Segregation (ISP) | 1 | Medium |
| Liskov Substitution (LSP) | 1 | Low |

**Total Violations:** 11 categories affecting multiple files

---

## 🎯 Recommended Action Plan

### Phase 1: Critical Fixes (High Priority)
1. ✅ Remove `mongoose.Types.ObjectId` from all model interfaces
2. ✅ Inject `JwtTokenService` instead of direct instantiation in middleware
3. ✅ Create interfaces for all concrete use case dependencies

### Phase 2: Medium Priority Fixes
4. Extract business logic from controllers to services/use cases
5. Refactor fat controllers into smaller, focused controllers
6. Replace static `UploadService` calls with dependency injection
7. Create middleware for common operations (e.g., company profile fetching)

### Phase 3: Low Priority Improvements
8. Implement centralized error handling
9. Create proper type extensions for request objects
10. Add domain value objects for validation (e.g., JobStatus enum)

---

## 📝 Notes

- This report focuses on architectural violations, not code style issues
- Some violations may have been intentionally introduced for pragmatic reasons
- Fixing these issues will improve testability, maintainability, and adherence to Clean Architecture
- Consider creating ADRs (Architecture Decision Records) for major refactoring decisions
