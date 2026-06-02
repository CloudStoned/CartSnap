# Skill: Separation of Concerns

This document defines the strict architectural guidelines for code modularization, folder-based organization, and separating business logic from raw utilities within the CartSnap workspace. These rules must be applied whenever creating, updating, or refactoring components, hooks, or backend logic.

---

## 1. Directory & Folder Structure

*   **Group by Feature/Concern**: Avoid flat directories with unrelated files. If a directory (e.g., `hooks/` or `components/`) contains more than two closely related files or handles complex sub-concerns, group them into a dedicated sub-folder (e.g., `hooks/scan/` or `hooks/auth/`).
*   **Module Entrypoint (`index.ts`)**: Every sub-folder module must expose a single clean entrypoint via an `index.ts` file. All external code must import hooks/components from this index rather than internal implementation files.
    ```typescript
    // Correct
    import { useGroceryScan } from '../hooks/scan';

    // Incorrect
    import { useGroceryScan } from '../hooks/scan/useGroceryScan';
    ```

---

## 2. Hooks Architecture (UI Logic vs. Utility Functions)

*   **State Orchestration Only**: React custom hooks (e.g., `useGroceryScan`, `useAuth`) should restrict themselves to managing UI state, event handling, lifecycle hooks (`useEffect`), and orchestrating integrations.
*   **No Heavy Utility / Engine Logic**: Hooks must never contain:
    *   Third-party SDK initialization, WASM loading, or API clients.
    *   Regular expressions or string-parsing algorithms (e.g., extracting prices, parsing data URIs).
    *   Static dataset declarations.
*   **Dedicated Helper Files**: Extract engine logic, utility calculations, and parsing helpers into standalone files adjacent to the hook (e.g., `ocrEngine.ts` inside `hooks/scan/`).

---

## 3. Data Integrity & Verification

*   **Zero Hardcoded Mock Data**: Remove all hardcoded simulation lists (like `DEMO_GROCERIES`). The application must enforce real-world behavior by validating input.
*   **Explicit User Warnings**: If an operation fails or has missing inputs (e.g., missing photo upload), raise explicit validation alerts or prompt the user for manual details. Do not inject silent mock/simulated fallbacks.
*   **Preserve User Control**: Never let automated heuristics (e.g. static keyword-based classifiers) override explicit user choices made in the UI (such as selecting a department category).
