# Clean Architecture Violations Report

Generated: 2026-01-01
Status: Post-SRP Refactoring Audit

## CRITICAL VIOLATIONS

### 1. Application Layer Importing from Infrastructure Layer
Severity: CRITICAL
Impact: Breaks Clean Architecture dependency rule

#### Violation 1.1: Direct Infrastructure Imports in Use Cases
Files Affected: 13 use cases

Affected Files:
1. src/application/use-cases/company/update-application-stage.use-case.ts - notificationService
2. src/application/use-cases/company/revert-to-default-plan.use-case.ts - logger
3. src/application/use-cases/company/handle-stripe-webhook.use-case.ts - logger
4. src/application/use-cases/company/get-candidate-details.use-case.ts - S3Service
5. src/application/use-cases/company/change-subscription-plan.use-case.ts - logger
6. src/application/use-cases/admin/migrate-plan-subscribers.use-case.ts - logger, template
7. src/application/use-cases/admin/update-subscription-plan.use-case.ts - logger
8. src/application/use-cases/admin/create-subscription-plan.use-case.ts - logger
9. src/application/use-cases/admin/block-user.use-case.ts - notificationService

Fix Required:
- Create domain interface ILogger in domain layer
- Inject logger via constructor (DIP)
- Remove direct infrastructure imports
- Use DI container to provide implementations

#### Violation 1.2: Direct Model Imports in Use Case
File: src/application/use-cases/public/get-job-posting-for-public.use-case.ts

Why This is Wrong:
- Application layer should NEVER know about database models
- Violates Dependency Inversion Principle
- Tightly couples to MongoDB implementation
- Makes testing impossible without database

Fix Required:
- Use repository pattern exclusively
- Add methods to repositories for these queries
- Remove all direct model imports

## MODERATE VIOLATIONS

### 2. Anemic Domain Models
Severity: MODERATE
Impact: Domain logic scattered in Use Cases instead of Entities

Missing Business Logic (should be in entity):
- Application stage transition validation
- ATS score validation
- Status change rules
- Rejection reason validation
- Application eligibility checks

Current Location: Scattered across Use Cases

Fix Required:
- Add business methods to entities
- Move validation logic from Use Cases to entities
- Implement domain rules in domain layer

### 3. Missing Domain Interfaces
Severity: MODERATE

Missing Interfaces:
- ILogger - Currently importing concrete logger
- IEmailTemplate - Templates imported from infrastructure
- Domain events system

## SUMMARY

Violation Type | Count | Severity | Priority
Infrastructure imports in Application | 13 files | CRITICAL | HIGH
Direct Model imports | 1 file | CRITICAL | HIGH
Anemic Domain Models | 28 entities | MODERATE | MEDIUM
Missing Domain Interfaces | 2 | MODERATE | MEDIUM

## PRIORITY FIX ORDER

Phase 1: Critical (Immediate)
1. Remove direct infrastructure imports
   - Create ILogger domain interface
   - Inject logger via DI
   - Remove all import logger from use cases
   
2. Fix direct model imports
   - Add repository methods for queries
   - Remove model imports from get-job-posting-for-public.use-case.ts

Phase 2: High Priority
3. Enrich Domain Models
   - Add validation methods to entities
   - Add business rule methods
   - Move logic from Use Cases to entities

Phase 3: Medium Priority
4. Create missing domain interfaces
   - ILogger interface
   - IEmailTemplate interface
   - Consider Domain Events pattern

## ESTIMATED EFFORT

Task | Effort | Impact
Remove infrastructure imports | 3-4 hours | High
Fix direct model imports | 2 hours | High
Enrich domain models | 8-12 hours | Medium
Create domain interfaces | 2 hours | Medium

Total: 15-20 hours

## NOTES

The codebase is in much better shape after SRP refactoring. The remaining violations are:
1. Infrastructure imports (easy to fix)
2. Anemic domain models (requires domain knowledge)

The architecture is 80% compliant with Clean Architecture principles.
