# Spec 06: Add Indicator

> Create new indicators via modal with smart defaults and validation

## Overview

Enable users to manually add new threat indicators through a modal form. Includes type auto-detection, tag chips, confidence slider, validation, and duplicate detection. Since there's no POST endpoint, indicators are stored in memory and appear in the table immediately.

## Prerequisites

- [ ] Spec 01 (Foundation) completed
- [ ] Spec 02 (Layout Shell) completed
- [ ] Spec 03 (Dashboard Core) completed
- [ ] Spec 04 (Detail Panel) completed

## Behavior Summary

| User Action                  | Result                                      |
| ---------------------------- | ------------------------------------------- |
| Click "Add Indicator" button | Open modal                                  |
| Type indicator value         | Auto-detect type (IP/domain/hash/URL)       |
| Fill required fields         | Enable "Add Indicator" submit button        |
| Submit valid form            | Close modal, toast, scroll to new indicator |
| Click outside modal          | Close modal (discard changes)               |
| Press Escape                 | Close modal (discard changes)               |

## Tasks

### 1. Add Indicator Modal Component

Create src/components/indicator/AddIndicatorModal.tsx:

Structure:

- [ ] Header: "Add Indicator" + close button (X)
- [ ] Body: Form with all fields (see Field Specifications below)
- [ ] Footer: "Cancel" button + "Add Indicator" primary button (disabled until valid)
- [ ] Outside click closes modal
- [ ] Escape key closes modal

Props:
interface AddIndicatorModalProps {
isOpen: boolean;
existingValues: string[]; // For duplicate detection
onClose: () => void;
onAdd: (indicator: Omit<Indicator, 'id'>) => void;
}

### 2. Field Specifications

#### Required Fields

| Field             | Input Type                   | Validation                               | Default/Inference      |
| ----------------- | ---------------------------- | ---------------------------------------- | ---------------------- |
| Value (indicator) | Text input                   | Required, pattern match if type detected | —                      |
| Type              | Dropdown (auto-selected)     | Required                                 | Auto-detect from value |
| Severity          | Dropdown                     | Required                                 | —                      |
| Confidence        | Slider (0-100)               | Required                                 | Based on severity      |
| Source            | Combobox (dropdown + custom) | Required                                 | "Manual Entry"         |
| Tags              | Tag chips (Enter to add)     | At least 1 required                      | —                      |
| Last Seen         | Date picker                  | Required, >= First Seen                  | Now                    |

#### Optional Fields (Collapsible Section)

| Field             | Input Type                 | Default/Inference         |
| ----------------- | -------------------------- | ------------------------- |
| First Seen        | Date picker                | Same as Last Seen         |
| Augured On        | Date picker (display only) | Today                     |
| Provider          | Text input                 | Same as Source            |
| Reports           | Number input               | Derived: confidence \* 15 |
| Related Campaigns | Text input                 | "Unknown"                 |

### 3. Type Auto-Detection

Create src/utils/detectIndicatorType.ts:

- [ ] IP pattern: /^(\d{1,3}\.){3}\d{1,3}$/
- [ ] Domain pattern: /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/
- [ ] Hash pattern: /^[a-fA-F0-9]{64}$/ (SHA-256) or /^[a-fA-F0-9]{32}$/ (MD5)
- [ ] URL pattern: /^https?:\/\/.+/
- [ ] Returns: detected type or null (user must select manually)
- [ ] User can always override the auto-detected type

### 4. Tag Chips Component

Create src/components/ui/TagInput.tsx:

- [ ] Text input field
- [ ] Press Enter or comma to add tag as chip
- [ ] Click X on chip to remove
- [ ] Chips display below input
- [ ] Prevent duplicate tags
- [ ] Style chips using existing Tag component

Props:
interface TagInputProps {
tags: string[];
onChange: (tags: string[]) => void;
placeholder?: string;
error?: boolean;
}

### 5. Confidence Slider Component

Create src/components/ui/Slider.tsx:

- [ ] Range input 0-100
- [ ] Shows current value
- [ ] Color changes based on value ranges:
  - 0-39: severity-low (green)
  - 40-59: severity-medium (yellow)
  - 60-79: severity-high (orange)
  - 80-100: severity-critical (red)
- [ ] Preset buttons: Low (25), Medium (50), High (75), Critical (90)

Props:
interface SliderProps {
value: number;
onChange: (value: number) => void;
min?: number;
max?: number;
}

### 6. Source Combobox Component

Create src/components/ui/Combobox.tsx:

- [ ] Dropdown with predefined options
- [ ] Text input for custom value
- [ ] If user types value not in list, allow it as custom
- [ ] Predefined sources: AbuseIPDB, VirusTotal, OTX AlienVault, Emerging Threats, MalwareBazaar, PhishTank, Spamhaus, ThreatFox, URLhaus, CIRCL, Shodan, GreyNoise, BinaryEdge, Censys, Silent Push, DomainTools, Manual Entry

Props:
interface ComboboxProps {
value: string;
onChange: (value: string) => void;
options: string[];
placeholder?: string;
allowCustom?: boolean;
}

### 7. Duplicate Detection

In AddIndicatorModal:

- [ ] On value blur or change, check against existingValues
- [ ] If duplicate found, show warning below input
- [ ] Warning: "An indicator with this value already exists"
- [ ] Warning style: text-severity-medium, with warning icon
- [ ] Do NOT block submission (warn only)

### 8. Form Validation

- [ ] Value: required, show error if empty on blur
- [ ] Type: required (auto-selected or manual)
- [ ] Severity: required
- [ ] Confidence: required, 0-100 range
- [ ] Source: required
- [ ] Tags: at least 1 required, show error if empty on submit
- [ ] Last Seen: required, must be >= First Seen (if First Seen provided)
- [ ] Submit button disabled until all required fields valid

### 9. Default Value Inference

When severity changes:

- [ ] Update confidence slider to preset value:
  - critical -> 90
  - high -> 75
  - medium -> 50
  - low -> 25
- [ ] User can still adjust after

Other defaults:

- [ ] Source: "Manual Entry"
- [ ] Last Seen: Current date/time
- [ ] First Seen: Same as Last Seen (placeholder)
- [ ] Provider: Same as Source (placeholder)
- [ ] Reports: confidence \* 15 (placeholder)
- [ ] Related Campaigns: "Unknown" (placeholder)

### 10. Memory Storage

Update src/App.tsx or create src/hooks/useLocalIndicators.ts:

- [ ] State: localIndicators: Indicator[] (in-memory)
- [ ] Merge with API indicators for display
- [ ] Generate UUID for new indicators
- [ ] New indicators appear at top of list (most recent)

### 11. Success Flow

After successful submission:

- [ ] Generate unique ID (uuid)
- [ ] Add to localIndicators state
- [ ] Close modal
- [ ] Show toast: "Indicator added successfully"
- [ ] Reset filters to show all
- [ ] Go to page 1
- [ ] Scroll to top of table
- [ ] Briefly highlight new row (optional: pulse animation)

### 12. Integration

Update src/components/layout/PageHeader.tsx:

- [ ] "Add Indicator" button opens modal
- [ ] Pass existingValues (all indicator values) for duplicate check

Update src/App.tsx:

- [ ] State: isAddModalOpen
- [ ] Handler: handleAddIndicator
- [ ] Merge localIndicators with API data

### 13. Unit Tests

- [ ] src/utils/detectIndicatorType.test.ts — all patterns
- [ ] src/components/ui/TagInput.test.tsx — add, remove, duplicates
- [ ] src/components/ui/Slider.test.tsx — value changes, presets
- [ ] src/components/indicator/AddIndicatorModal.test.tsx — validation, submission

## Files to Create

src/components/indicator/AddIndicatorModal.tsx
src/components/indicator/index.ts
src/components/ui/TagInput.tsx
src/components/ui/Slider.tsx
src/components/ui/Combobox.tsx
src/utils/detectIndicatorType.ts
src/utils/detectIndicatorType.test.ts
src/hooks/useLocalIndicators.ts
src/components/ui/TagInput.test.tsx
src/components/ui/Slider.test.tsx
src/components/indicator/AddIndicatorModal.test.tsx

## Files to Modify

src/App.tsx (modal state, local indicators, merge logic)
src/components/layout/PageHeader.tsx (button handler)
src/components/ui/index.ts (export new components)

## Design Specs

### Modal

Overlay: rgba(0, 0, 0, 0.7) + backdrop-filter: blur(4px)
Modal: bg-modal (#141820), border-default, shadow-modal
Max-width: 560px
Max-height: 85vh (body scrollable)
Border-radius: radius-xl (12px)
Header padding: 20px 24px
Body padding: 24px
Footer padding: 16px 24px

### Form Fields

Label: 11px, uppercase, letter-spacing 0.8px, text-tertiary, margin-bottom 6px
Input: bg-input, border-default, radius-md, padding 8px 12px
Input focus: border-augur-blue, shadow ring
Error state: border-severity-critical, error text below
Field spacing: 20px between fields

### Tag Chips

Chip: bg-tag-blue, text-tag-blue-text, border-tag-blue-border
Chip padding: 2px 8px
Chip border-radius: radius-sm
Remove button: X icon, hover:text-severity-critical
Input: inline with chips, grows to fill

### Confidence Slider

Track: bg-elevated, height 6px, radius-full
Fill: colored by severity range
Thumb: 18px circle, bg-white, shadow, border
Value display: font-mono, 18px, colored by severity
Preset buttons: ghost buttons below slider

### Duplicate Warning

Background: severity-medium-bg
Border: severity-medium-border
Color: severity-medium
Icon: warning triangle
Padding: 8px 12px
Border-radius: radius-md
Margin-top: 8px

### Optional Fields Section

Collapsible with chevron icon
Label: "Additional Fields (Optional)"
Initially collapsed
Click to expand/collapse

## Form Layout

+---------------------------------------------------+
| Add Indicator X |
+---------------------------------------------------+
| |
| INDICATOR VALUE _ |
| +---------------------------------------------+ |
| | 185.220.101.34 | |
| +---------------------------------------------+ |
| ! An indicator with this value exists |
| |
| TYPE _ SEVERITY _ |
| +----------------+ +----------------+ |
| | IP Address v | | Critical v | |
| +----------------+ +----------------+ |
| |
| CONFIDENCE _ |
| +---------------------------------------------+ |
| | =================================O |90|
| +---------------------------------------------+ |
| [Low] [Medium] [High] [Critical] |
| |
| SOURCE _ |
| +---------------------------------------------+ |
| | AbuseIPDB v | |
| +---------------------------------------------+ |
| |
| TAGS _ |
| +---------------------------------------------+ |
| | [tor-exit x] [botnet x] Add tag... | |
| +---------------------------------------------+ |
| At least one tag required |
| |
| LAST SEEN \* |
| +---------------------------------------------+ |
| | 2026-02-07 16:30 | |
| +---------------------------------------------+ |
| |
| > Additional Fields (Optional) |
| |
+---------------------------------------------------+
| [Cancel] [Add Indicator] |
+---------------------------------------------------+

## Expanded Optional Fields

| v Additional Fields (Optional) |
| |
| FIRST SEEN |
| +---------------------------------------------+ |
| | 2026-02-07 16:30 (placeholder) | |
| +---------------------------------------------+ |
| |
| PROVIDER |
| +---------------------------------------------+ |
| | AbuseIPDB (placeholder) | |
| +---------------------------------------------+ |
| |
| REPORTS |
| +---------------------------------------------+ |
| | 1350 (placeholder) | |
| +---------------------------------------------+ |
| |
| RELATED CAMPAIGNS |
| +---------------------------------------------+ |
| | Unknown (placeholder) | |
| +---------------------------------------------+ |

## Keyboard Shortcuts

| Key                  | Action                  |
| -------------------- | ----------------------- |
| Escape               | Close modal             |
| Cmd/Ctrl + Enter     | Submit form (if valid)  |
| Enter (in tag input) | Add tag                 |
| Tab                  | Navigate between fields |

## Verification

- [ ] "Add Indicator" button opens modal
- [ ] Modal closes on outside click
- [ ] Modal closes on Escape key
- [ ] Type auto-detects from value (IP, domain, hash, URL)
- [ ] User can override auto-detected type
- [ ] Confidence slider works with color changes
- [ ] Confidence presets set correct values
- [ ] Tag chips can be added with Enter
- [ ] Tag chips can be removed with X
- [ ] Source combobox allows selection and custom input
- [ ] Duplicate warning appears for existing values
- [ ] Validation errors show for required fields
- [ ] Submit button disabled until form valid
- [ ] Last Seen validation against First Seen works
- [ ] New indicator appears in table after submission
- [ ] Toast notification appears
- [ ] Table scrolls to show new indicator
- [ ] All tests pass
- [ ] No TypeScript/ESLint errors

## References

- design-reference.html — lines 367-420 for input styles
- design-reference.html — lines 733-756 for modal styles
- src/types/indicator.ts — Indicator interface
- server/data.js — lines 63-67 for source list
