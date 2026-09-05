# TASK 4.1: Repository Layer - Complete Guide

**Status**: ✅ COMPLETE  
**Date**: 2026-09-05  
**Scope**: Data Access Abstraction Layer  

---

## 📋 Overview

Repository Pattern implementation for RembukTani M2 database. Provides abstraction layer between application logic and database queries.

**Files Created**: 10 repository classes + factory + index

```
backend/src/domain/repositories/
├── base.repository.ts           (Abstract base class)
├── profile.repository.ts        (User profiles)
├── land.repository.ts           (Land parcels)
├── crop-context.repository.ts   (Crop per season)
├── decision-case.repository.ts  (Decision sessions)
├── evidence.repository.ts       (Evidence collection)
├── assessment.repository.ts     (AI reasoning)
├── action-option.repository.ts  (Action options)
├── decision-record.repository.ts (Final decisions - immutable)
├── decision-brief.repository.ts (Shareable output)
├── factory.ts                   (Dependency injection)
└── index.ts                     (Exports)
```

---

## 🏗️ Architecture

### Base Repository (Abstract)

All repositories extend `BaseRepository<T>` providing common CRUD:

```typescript
export abstract class BaseRepository<T> {
  async getById(id: string): Promise<T | null>
  async getAll(filters?: Record<string, any>): Promise<T[]>
  async create(data: Partial<T>): Promise<T>
  async update(id: string, data: Partial<T>): Promise<T>
  async delete(id: string): Promise<void>
  async exists(id: string): Promise<boolean>
  async count(filters?: Record<string, any>): Promise<number>
}
```

### Specific Repositories

Each entity gets its own repository with domain-specific queries:

#### ProfileRepository
```typescript
async getByUserId(userId: string): Promise<Profile | null>
async createForUser(userId: string, input): Promise<Profile>
async getByRole(role: string): Promise<Profile[]>
```

#### LandRepository
```typescript
async getByOwnerId(ownerId: string): Promise<Land[]>
async getWithActiveCrop(id: string): Promise<Land>
async resolveLocation(id, adm4Code, locationData): Promise<Land>
async archiveLand(id: string): Promise<Land>
async getByAdm4Code(adm4Code: string): Promise<Land[]>
```

#### CropContextRepository
```typescript
async getActiveCrop(landId: string): Promise<CropContext | null>
async createCrop(landId: string, input): Promise<CropContext>
async setActive(id: string): Promise<CropContext>
async getByGrowthStage(landId, stage): Promise<CropContext[]>
async getByPlantingDateRange(landId, start, end): Promise<CropContext[]>
```

#### DecisionCaseRepository
```typescript
async getWithContext(id: string): Promise<DecisionCase>
async getByLandId(landId: string, status?, excludeClosed?): Promise<DecisionCase[]>
async updateStatus(id: string, status: DecisionCaseStatus): Promise<DecisionCase>
async closeCase(id: string): Promise<DecisionCase>
async getActive(): Promise<DecisionCase[]>
async getPendingReview(): Promise<DecisionCase[]>
```

#### EvidenceRepository
```typescript
async getByDecisionCaseId(caseId: string): Promise<DecisionCaseEvidence[]>
async getLatestByType(caseId: string, type: EvidenceType): Promise<Evidence | null>
async getByType(caseId: string, type: EvidenceType): Promise<Evidence[]>
async getMockEvidence(caseId: string): Promise<Evidence[]>
async getFreshEvidence(caseId: string): Promise<Evidence[]>
async hasEvidenceType(caseId: string, type: EvidenceType): Promise<boolean>
```

#### AssessmentRepository
```typescript
async getWithOptions(id: string): Promise<Assessment>
async getLatestActive(caseId: string): Promise<Assessment | null>
async createAssessment(input): Promise<Assessment>
async setActive(id: string): Promise<Assessment>
async getNextVersion(caseId: string): Promise<number>
```

#### ActionOptionRepository
```typescript
async getByAssessmentId(assessmentId: string): Promise<ActionOption[]>
async createOptions(assessmentId, options): Promise<ActionOption[]>
async reorder(assessmentId, orderMap): Promise<void>
async hasOptions(assessmentId: string): Promise<boolean>
```

#### DecisionRecordRepository
```typescript
async getByDecisionCaseId(caseId: string): Promise<DecisionRecord | null>
async getWithContext(id: string): Promise<DecisionRecord>
async createDecision(input): Promise<DecisionRecord>
async getByDecisionType(type: DecisionType): Promise<DecisionRecord[]>
async existsForCase(caseId: string): Promise<boolean>
// Note: update() and delete() throw errors - immutable
```

#### DecisionBriefRepository
```typescript
async getByDecisionRecordId(recordId: string): Promise<DecisionBrief | null>
async getWithDecisionContext(id: string): Promise<DecisionBrief>
async createBrief(input): Promise<DecisionBrief>
async searchContent(query: string): Promise<DecisionBrief[]>
async getByDateRange(start, end): Promise<DecisionBrief[]>
```

---

## 🏭 Repository Factory

Centralized dependency injection for all repositories:

```typescript
const repos = new RepositoryFactory(supabaseClient);

// Access any repository
const lands = await repos.lands.getByOwnerId(userId);
const cases = await repos.decisionCases.getByLandId(landId);
const options = await repos.actionOptions.getByAssessmentId(assessmentId);
```

**Usage in Express Route**:

```typescript
app.get('/api/lands/:landId', async (req, res) => {
  const repos = createRepositoryFactory(supabaseClient);
  const land = await repos.lands.getById(req.params.landId);
  
  if (!land) return res.status(404).json({ error: 'Not found' });
  
  res.json(land);
});
```

---

## 💡 Usage Patterns

### Pattern 1: Get with Relationships

```typescript
// Get decision case with full context
const caseWithContext = await repos.decisionCases.getWithContext(caseId);

// Returns:
// {
//   id, land_id, crop_context_id, status, ...
//   land: { id, name, latitude, longitude, ... },
//   crop_context: { crop_name, growth_stage, ... },
//   evidence: [ { type, payload, ... }, ... ],
//   assessments: [ { summary, basis_strength, ... }, ... ],
//   decision_record: { decision_text, decided_by, ... }
// }
```

### Pattern 2: Filter & Order

```typescript
// Get active lands only
const activeLands = await repos.lands.getByOwnerId(userId, true);

// Get latest decision case
const recentCases = await repos.decisionCases.getActive();

// Get decision by status
const pendingReview = await repos.decisionCases.getPendingReview();
```

### Pattern 3: Create with Cascade

```typescript
// Create crop (auto-deactivates previous)
const newCrop = await repos.cropContexts.createCrop(landId, {
  crop_name: 'Padi Inpari 32',
  growth_stage: 'vegetative'
});

// Create decision
const decisionCase = await repos.decisionCases.createCase({
  land_id: landId,
  crop_context_id: newCrop.id,
  created_by: profileId,
  decision_type: 'water_condition'
});

// Add evidence
const evidence = await repos.evidence.createEvidence({
  decision_case_id: decisionCase.id,
  type: 'bmkg_forecast',
  payload: { temperature: 24, humidity: 85 }
});
```

### Pattern 4: Assessment Workflow

```typescript
// Get latest assessment
const assessment = await repos.assessments.getLatestActive(caseId);

// Set new assessment as active
const newAssessment = await repos.assessments.createAssessment({
  decision_case_id: caseId,
  version: 2,
  summary: 'Updated assessment'
});
await repos.assessments.setActive(newAssessment.id);

// Get all options
const options = await repos.actionOptions.getByAssessmentId(newAssessment.id);
```

### Pattern 5: Immutable Decision Record

```typescript
// Create final decision (cannot be changed)
const decision = await repos.decisionRecords.createDecision({
  decision_case_id: caseId,
  decided_by: profileId,
  assessment_id: assessmentId,
  selected_action_option_id: optionId,
  decision_type: 'selected_option',
  decision_text: 'Saya akan mengecek sumber air'
});

// Try to update - will throw error
try {
  await repos.decisionRecords.update(decision.id, { decision_text: '...' });
} catch (e) {
  console.log('Decision records are immutable');
}

// Create brief
const brief = await repos.decisionBriefs.createBrief({
  decision_record_id: decision.id,
  template_version: '1.0',
  content: '<html>...</html>'
});
```

---

## 🧪 Testing with Repositories

### Unit Test Example

```typescript
// Mock repository for testing service logic
class MockLandRepository extends LandRepository {
  async getByOwnerId(ownerId: string): Promise<Land[]> {
    return [
      {
        id: 'test-land-1',
        owner_id: ownerId,
        name: 'Test Land',
        latitude: -6.9,
        longitude: 110.4,
        location_source: 'manual'
      }
    ];
  }
}

// Use in test
const mockRepo = new MockLandRepository(mockSupabaseClient);
const lands = await mockRepo.getByOwnerId('test-user');
expect(lands).toHaveLength(1);
```

---

## 🔐 Error Handling

Repositories handle common errors:

```typescript
try {
  const land = await repos.lands.getById('invalid-id');
  if (!land) {
    // Record not found
  }
} catch (error) {
  if (error.code === 'PGRST116') {
    // Zero rows returned
  }
  throw error;
}
```

Immutable decision records throw on update:

```typescript
try {
  await repos.decisionRecords.update(recordId, data);
} catch (error) {
  // Error: Decision records are immutable and cannot be updated
}
```

---

## 📊 Query Performance

All repositories leverage database indexes:

| Query | Index | Performance |
|-------|-------|-------------|
| `getByOwnerId` | idx_lands_owner_id | ✅ Fast |
| `getByDecisionCaseId` | idx_evidence_decision_case_id | ✅ Fast |
| `getByStatus` | idx_decision_cases_status | ✅ Fast |
| `getByLandId` with order | idx_crop_contexts_land_id + idx (created_at) | ✅ Fast |
| `getLatestByType` | idx_evidence_type + idx_evidence_collected_at | ✅ Fast |

---

## 🎯 Next: TASK 4.2 - API Endpoints

With repositories in place, you can now build API endpoints:

```typescript
// backend/src/routes/lands.ts
import { Router } from 'express';
import { createRepositoryFactory } from '../domain/repositories/factory';

const router = Router();

router.get('/lands/:id', async (req, res) => {
  const repos = createRepositoryFactory(supabaseClient);
  const land = await repos.lands.getById(req.params.id);
  
  if (!land) return res.status(404).json({ error: 'Not found' });
  
  res.json(land);
});

export default router;
```

---

## 📚 Full API Reference

### ProfileRepository
- `getById(id: string): Promise<Profile | null>`
- `getByUserId(userId: string): Promise<Profile | null>`
- `getAll(filters?): Promise<Profile[]>`
- `create(data: Partial<Profile>): Promise<Profile>`
- `createForUser(userId, input): Promise<Profile>`
- `update(id, input): Promise<Profile>`
- `getByRole(role: string): Promise<Profile[]>`
- `existsForUser(userId: string): Promise<boolean>`

### LandRepository
- `getById(id: string): Promise<Land | null>`
- `getByOwnerId(ownerId, excludeArchived?): Promise<Land[]>`
- `getWithActiveCrop(id): Promise<Land>`
- `getByAdm4Code(code): Promise<Land[]>`
- `create(ownerId, input): Promise<Land>`
- `update(id, input): Promise<Land>`
- `createLand(ownerId, input): Promise<Land>`
- `updateLand(id, input): Promise<Land>`
- `resolveLocation(id, adm4Code, locationData): Promise<Land>`
- `archiveLand(id): Promise<Land>`
- `unarchiveLand(id): Promise<Land>`
- `countByOwner(ownerId, excludeArchived?): Promise<number>`

### CropContextRepository
- `getById(id: string): Promise<CropContext | null>`
- `getActiveCrop(landId): Promise<CropContext | null>`
- `getByLandId(landId): Promise<CropContext[]>`
- `create(data): Promise<CropContext>`
- `createCrop(landId, input): Promise<CropContext>`
- `update(id, input): Promise<CropContext>`
- `updateCrop(id, input): Promise<CropContext>`
- `setActive(id): Promise<CropContext>`
- `getByGrowthStage(landId, stage): Promise<CropContext[]>`
- `getByPlantingDateRange(landId, start, end): Promise<CropContext[]>`
- `countActive(): Promise<number>`

### DecisionCaseRepository
- `getById(id: string): Promise<DecisionCase | null>`
- `getAll(filters?): Promise<DecisionCase[]>`
- `getWithContext(id): Promise<DecisionCase>`
- `getByLandId(landId, status?, excludeClosed?): Promise<DecisionCase[]>`
- `getByCreator(profileId): Promise<DecisionCase[]>`
- `getByType(type): Promise<DecisionCase[]>`
- `create(data): Promise<DecisionCase>`
- `createCase(input): Promise<DecisionCase>`
- `update(id, data): Promise<DecisionCase>`
- `updateCase(id, input): Promise<DecisionCase>`
- `updateStatus(id, status): Promise<DecisionCase>`
- `closeCase(id): Promise<DecisionCase>`
- `getActive(): Promise<DecisionCase[]>`
- `getDecided(limit?): Promise<DecisionCase[]>`
- `getPendingReview(): Promise<DecisionCase[]>`
- `countByStatus(status): Promise<number>`
- `getByCropContextId(cropContextId): Promise<DecisionCase[]>`

### EvidenceRepository
- `getById(id: string): Promise<Evidence | null>`
- `getByDecisionCaseId(caseId, sortBy?): Promise<Evidence[]>`
- `getLatestByType(caseId, type): Promise<Evidence | null>`
- `getByType(caseId, type): Promise<Evidence[]>`
- `create(data): Promise<Evidence>`
- `createEvidence(input): Promise<Evidence>`
- `getMockEvidence(caseId): Promise<Evidence[]>`
- `getFreshEvidence(caseId): Promise<Evidence[]>`
- `getByFreshnessStatus(caseId, status): Promise<Evidence[]>`
- `updateFreshnessStatus(id, status): Promise<Evidence>`
- `countByType(caseId, type): Promise<number>`
- `getBySource(caseId, source): Promise<Evidence[]>`
- `getTypes(caseId): Promise<EvidenceType[]>`
- `hasEvidenceType(caseId, type): Promise<boolean>`

### AssessmentRepository
- `getById(id: string): Promise<Assessment | null>`
- `getWithOptions(id): Promise<Assessment>`
- `getByDecisionCaseId(caseId): Promise<Assessment[]>`
- `getLatestActive(caseId): Promise<Assessment | null>`
- `getByVersion(caseId, version): Promise<Assessment | null>`
- `create(data): Promise<Assessment>`
- `createAssessment(input): Promise<Assessment>`
- `update(id, data): Promise<Assessment>`
- `updateAssessment(id, status): Promise<Assessment>`
- `setActive(id): Promise<Assessment>`
- `getByBasisStrength(caseId, strength): Promise<Assessment[]>`
- `getByRuleVersion(version): Promise<Assessment[]>`
- `countActive(): Promise<number>`
- `getNextVersion(caseId): Promise<number>`

### ActionOptionRepository
- `getById(id: string): Promise<ActionOption | null>`
- `getByAssessmentId(assessmentId): Promise<ActionOption[]>`
- `create(data): Promise<ActionOption>`
- `createOption(input): Promise<ActionOption>`
- `createOptions(assessmentId, options): Promise<ActionOption[]>`
- `update(id, data): Promise<ActionOption>`
- `updateOption(id, title, description?): Promise<ActionOption>`
- `reorder(assessmentId, orderMap): Promise<void>`
- `delete(id): Promise<void>`
- `countByAssessment(assessmentId): Promise<number>`
- `hasOptions(assessmentId): Promise<boolean>`
- `deleteByAssessment(assessmentId): Promise<void>`
- `getMostUsed(limit?): Promise<ActionOption[]>`

### DecisionRecordRepository
- `getById(id: string): Promise<DecisionRecord | null>`
- `getByDecisionCaseId(caseId): Promise<DecisionRecord | null>`
- `getWithContext(id): Promise<DecisionRecord>`
- `getWithSelectedOption(id): Promise<DecisionRecord>`
- `getWithEvidence(id): Promise<DecisionRecord>`
- `create(data): Promise<DecisionRecord>` ❌ Use createDecision
- `createDecision(input): Promise<DecisionRecord>` ✅
- `getByDecidedBy(profileId): Promise<DecisionRecord[]>`
- `getByDecisionType(type): Promise<DecisionRecord[]>`
- `getRecent(limit?): Promise<DecisionRecord[]>`
- `countByType(type): Promise<number>`
- `countByDecider(profileId): Promise<number>`
- `getByAssessmentId(assessmentId): Promise<DecisionRecord[]>`
- `existsForCase(caseId): Promise<boolean>`
- `getByDateRange(start, end): Promise<DecisionRecord[]>`
- `update(...)`: ❌ Throws error (immutable)
- `delete(...)`: ❌ Throws error (immutable)

### DecisionBriefRepository
- `getById(id: string): Promise<DecisionBrief | null>`
- `getByDecisionRecordId(recordId): Promise<DecisionBrief | null>`
- `getWithDecisionContext(id): Promise<DecisionBrief>`
- `create(data): Promise<DecisionBrief>` ❌ Use createBrief
- `createBrief(input): Promise<DecisionBrief>` ✅
- `update(id, data): Promise<DecisionBrief>`
- `updateContent(id, content): Promise<DecisionBrief>`
- `delete(id): Promise<void>`
- `getByTemplateVersion(version): Promise<DecisionBrief[]>`
- `getRecent(limit?): Promise<DecisionBrief[]>`
- `searchContent(query): Promise<DecisionBrief[]>`
- `countByVersion(version): Promise<number>`
- `getByDateRange(start, end): Promise<DecisionBrief[]>`
- `existsForDecision(recordId): Promise<boolean>`

---

## 🎉 Summary

✅ **9 specialized repositories** (+ 1 base class)  
✅ **Dependency injection factory** for easy integration  
✅ **Immutable decision records** with error protection  
✅ **Type-safe queries** with full TypeScript support  
✅ **Performance optimized** using database indexes  
✅ **Production-ready** code with error handling  

**Next**: TASK 4.2 - Build API endpoints using these repositories!

---

**Created by**: GitHub Copilot  
**For**: RembukTani M2 Vertical Slice  
**Date**: 2026-09-05  
