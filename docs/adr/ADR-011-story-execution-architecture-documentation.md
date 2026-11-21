# ADR-011: Story Execution and Architecture Documentation

- **Status:** Accepted
- **Date:** 2026-10-31
- **Projects:** `@rittick/ui`, `@rittick/auth`
- **Related decisions:** ADR-001 through ADR-010

## Context

The two independently versioned npm packages have an approved 195-story master roadmap. Implementation must remain auditable, testable, resumable, and consistent with the accepted architecture. A proposed implementation, passing test, document edit, or git commit must not be represented as executed unless evidence exists.

## Decision

### 1. Story identification and lifecycle

Each original roadmap story has one stable ID and one status: **planned**, **in-progress**, **verified**, **completed**, or **blocked**. A story moves to **verified** only when its applicable acceptance criteria and required tests have demonstrably passed. It moves to **completed** only after verification, applicable documentation updates, and the required implementation handoff and git requirements are fulfilled. A story blocked before or during work retains an explicit blocker and any resumable checkpoint. Status changes must be supported by evidence.

### 2. Dependencies and ordering

Check documented prerequisites before implementation. Unmet prerequisites block dependent work; never assume they exist. Independent stories may be implemented out of roadmap order when their actual dependencies are satisfied. Do not silently implement unrelated prerequisite stories as part of the requested story. If a dependency is discovered during work, document it and update the checkpoint.

### 3. Scope and story splitting

Preserve each original story's scope, identifier, and acceptance criteria. Large stories may be divided into explicitly tracked implementation subtasks, but subtasks do not add to the 195-story master count and do not independently complete the parent. New master stories, changes to original acceptance criteria, or roadmap count changes require explicit approval and a recorded roadmap revision.

### 4. Implementation request and response contract

The user requests implementation with `<story-id>_IMPL`, for example `UI-001_IMPL`. In the implementation response, the **exact suffixed identifier appears once, as the heading only**. The response must include:

1. Scope, prerequisites, and relevant accepted ADRs.
2. Actual files changed and substantive implementation details.
3. Commands actually run, distinguished from proposed commands.
4. Tests and checks run, observed results, and checks not run or unavailable.
5. Each acceptance criterion marked passed, failed, or pending with evidence.
6. Applicable `ARCHITECTURE.md` and `PROGRESS.md` updates.
7. Actual git commit identifier if created; otherwise git status and suggested command, explicitly labeled unexecuted.
8. Honest final lifecycle status, blockers or recovery checkpoint, and recommended next story with prerequisites.

Do not repeat the suffixed story identifier outside the heading. Do not claim execution, test success, file modification, or git commit without direct evidence.

### 5. Git policy

Prefer one logically coherent conventional commit per completed story; independently verifiable subtasks may justify separate commits. Keep unrelated changes out of story commits. Include relevant code, tests, and documentation. A suggested commit command is not a commit; only an actual repository commit hash constitutes commit evidence. If the repository, permissions, or git tooling are unavailable, report that limitation. Where a commit is required for completion, an otherwise verified but uncommitted story remains **verified**, not **completed**.

### 6. Architecture and progress documentation

- `ARCHITECTURE.md` describes the **currently implemented** architecture, actual boundaries, integration contracts, and references to accepted ADRs. Clearly distinguish planned features from implemented ones.
- `PROGRESS.md` tracks all original story IDs, status, dependencies, verified evidence, blockers, outstanding work, git evidence where applicable, and next actions. Record checkpoints for interrupted work.
- `docs/adr/` stores accepted decisions, status, rationale, consequences, and any explicit amendments or supersession.

Update both `ARCHITECTURE.md` and `PROGRESS.md` as applicable for each implementation story. If a file does not need substantive modification, explain why rather than introducing meaningless changes. Accepted ADRs describe architectural intent and are not proof of implementation.

### 7. Failure recovery

On failed tests, incomplete implementation, environment restrictions, or interruption, preserve a resumable checkpoint: actual files and changes, commands and observed outcomes, remaining acceptance criteria, failures, blockers, and exact next actions. Do not automatically discard safe partial work, and do not label it completed. A blocked story may have partially implemented work; its status and checkpoint must make that clear.

### 8. Progress accounting

The master roadmap starts at **195 original stories**. Only original stories in **completed** state count toward the completed total. Planned, in-progress, verified, and blocked stories do not count. Subtasks never count as separate master stories. Track package and stage breakdowns without double-counting. Change the denominator only through an approved roadmap revision.

### 9. ADR governance

Accepted ADRs are authoritative. If implementation conflicts with one, stop the conflicting change and propose an explicit amendment or superseding ADR for approval. Record the rationale, compatibility and migration implications, and affected stories. Do not silently override decisions through code or documentation.

### 10. Verification and handoff integrity

Verification must follow ADR-010 and other applicable ADR security and compatibility gates. Distinguish **executed**, **verified**, **proposed**, and **not run** actions. Environment limitations do not permit fabricated results. A story handoff must enable another contributor to reproduce the checks or resume remaining work.

## Consequences

- Each implementation has traceable requirements, evidence, and git/documentation state.
- Work can resume safely after interruptions without inflating progress counts.
- Some stories may remain verified or blocked despite substantial code being written.
- Documentation and status updates add overhead but prevent drift between architectural intent and shipped behavior.

## Acceptance criteria for this ADR

- The implementation workflow enforces prerequisite checks and the five statuses.
- The response format uses the exact suffixed story ID once, in its heading.
- `ARCHITECTURE.md` and `PROGRESS.md` distinguish plans from actual implementation and record verification.
- Only original completed stories count toward the 195-story roadmap.
- Git hashes and test results are never invented.
- Conflicting architectural changes require approved ADR amendment or supersession.

## Status rationale

All initial and remaining policies were explicitly approved on 2026-10-31. No unresolved architecture-critical choice remains. **Accepted**.
