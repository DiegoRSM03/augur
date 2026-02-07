import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  type FormEvent,
} from 'react';
import { Button, Input, Select, TagInput, Slider, Combobox } from '../ui';
import { detectIndicatorType, getIndicatorTypeLabel } from '../../utils/detectIndicatorType';
import type { Indicator, IndicatorType, Severity } from '../../types/indicator';

interface AddIndicatorModalProps {
  isOpen: boolean;
  existingValues: string[];
  onClose: () => void;
  onAdd: (indicator: Omit<Indicator, 'id'>) => void;
}

// Predefined sources for the combobox
const PREDEFINED_SOURCES = [
  'AbuseIPDB',
  'VirusTotal',
  'OTX AlienVault',
  'Emerging Threats',
  'MalwareBazaar',
  'PhishTank',
  'Spamhaus',
  'ThreatFox',
  'URLhaus',
  'CIRCL',
  'Shodan',
  'GreyNoise',
  'BinaryEdge',
  'Censys',
  'Silent Push',
  'DomainTools',
  'Manual Entry',
];

// Severity options for dropdown
const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

// Type options for dropdown
const TYPE_OPTIONS = [
  { value: 'ip', label: 'IP Address' },
  { value: 'domain', label: 'Domain' },
  { value: 'hash', label: 'File Hash' },
  { value: 'url', label: 'URL' },
];


// Form field state
interface FormState {
  value: string;
  type: IndicatorType | '';
  severity: Severity | '';
  confidence: number;
  source: string;
  tags: string[];
  lastSeen: string;
  // Optional fields
  firstSeen: string;
  provider: string;
  reports: number;
  relatedCampaigns: string;
}

// Form validation errors
interface FormErrors {
  value?: string;
  type?: string;
  severity?: string;
  source?: string;
  tags?: string;
  lastSeen?: string;
}

// Icons
const CloseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/**
 * Get current datetime in ISO format for datetime-local input
 */
function getCurrentDateTimeLocal(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

/**
 * AddIndicatorModal - Modal form for adding new threat indicators
 *
 * Features:
 * - Type auto-detection from value
 * - Tag chips input
 * - Confidence slider with severity-based colors
 * - Source combobox with predefined options
 * - Duplicate detection with warning
 * - Form validation
 * - Collapsible optional fields section
 */
export function AddIndicatorModal({
  isOpen,
  existingValues,
  onClose,
  onAdd,
}: AddIndicatorModalProps) {
  const now = getCurrentDateTimeLocal();

  // Form state
  const [form, setForm] = useState<FormState>({
    value: '',
    type: '',
    severity: '',
    confidence: 50,
    source: 'Manual Entry',
    tags: [],
    lastSeen: now,
    firstSeen: '',
    provider: '',
    reports: 0,
    relatedCampaigns: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Touched fields (for showing errors on blur)
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Optional fields section expanded state
  const [showOptional, setShowOptional] = useState(false);

  // Duplicate detection
  const isDuplicate = useMemo(() => {
    return form.value.trim() !== '' && existingValues.includes(form.value.trim());
  }, [form.value, existingValues]);

  // Auto-detect type when value changes
  useEffect(() => {
    if (form.value.trim()) {
      const detectedType = detectIndicatorType(form.value);
      if (detectedType && !form.type) {
        setForm((prev) => ({ ...prev, type: detectedType }));
      }
    }
  }, [form.value, form.type]);


  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!form.value.trim()) {
      newErrors.value = 'Indicator value is required';
    }

    if (!form.type) {
      newErrors.type = 'Type is required';
    }

    if (!form.severity) {
      newErrors.severity = 'Severity is required';
    }

    if (!form.source.trim()) {
      newErrors.source = 'Source is required';
    }

    if (form.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    if (!form.lastSeen) {
      newErrors.lastSeen = 'Last seen date is required';
    }

    // Validate lastSeen >= firstSeen if firstSeen is provided
    if (form.firstSeen && form.lastSeen) {
      const firstSeenDate = new Date(form.firstSeen);
      const lastSeenDate = new Date(form.lastSeen);
      if (lastSeenDate < firstSeenDate) {
        newErrors.lastSeen = 'Last seen must be after first seen';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // Check if form is valid (for submit button)
  const isFormValid = useMemo(() => {
    return (
      form.value.trim() !== '' &&
      form.type !== '' &&
      form.severity !== '' &&
      form.source.trim() !== '' &&
      form.tags.length > 0 &&
      form.lastSeen !== ''
    );
  }, [form]);

  // Handle form submission
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        // Mark all fields as touched to show errors
        setTouched({
          value: true,
          type: true,
          severity: true,
          source: true,
          tags: true,
          lastSeen: true,
        });
        return;
      }

      // Build the indicator object
      const newIndicator: Omit<Indicator, 'id'> = {
        value: form.value.trim(),
        type: form.type as IndicatorType,
        severity: form.severity as Severity,
        confidence: form.confidence,
        source: form.source.trim(),
        tags: form.tags,
        lastSeen: new Date(form.lastSeen).toISOString(),
        firstSeen: form.firstSeen
          ? new Date(form.firstSeen).toISOString()
          : new Date(form.lastSeen).toISOString(),
      };

      onAdd(newIndicator);
    },
    [form, validateForm, onAdd]
  );

  // Handle field blur for validation
  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Handle escape key and Cmd/Ctrl+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isFormValid) {
        handleSubmit(e as unknown as FormEvent);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, isFormValid, handleSubmit]);

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const newNow = getCurrentDateTimeLocal();
      setForm({
        value: '',
        type: '',
        severity: '',
        confidence: 50,
        source: 'Manual Entry',
        tags: [],
        lastSeen: newNow,
        firstSeen: '',
        provider: '',
        reports: 0,
        relatedCampaigns: '',
      });
      setErrors({});
      setTouched({});
      setShowOptional(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0
        bg-modal-overlay
        backdrop-blur-xs
        flex items-center justify-center
        z-100
      "
      onClick={handleOverlayClick}
    >
      <div
        className="
          bg-bg-modal
          border border-border
          rounded-xl
          shadow-modal
          w-[90vw] max-w-[560px]
          max-h-[85vh]
          flex flex-col
          overflow-hidden
          animate-modal-in
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-indicator-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between shrink-0">
          <h2 id="add-indicator-modal-title" className="text-base font-bold text-text-primary">
            Add Indicator
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="
              p-1.5 rounded-md
              text-text-tertiary hover:text-text-primary
              hover:bg-bg-card
              transition-colors
              cursor-pointer
            "
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body - Scrollable form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Indicator Value */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                Indicator Value <span className="text-severity-critical">*</span>
              </label>
              <Input
                value={form.value}
                onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
                onBlur={() => handleBlur('value')}
                placeholder="Enter IP, domain, hash, or URL..."
                className={`font-mono ${touched.value && errors.value ? 'border-severity-critical' : ''}`}
              />
              {touched.value && errors.value && (
                <p className="text-xs text-severity-critical mt-1">{errors.value}</p>
              )}

              {/* Duplicate warning */}
              {isDuplicate && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-severity-medium-bg border border-severity-medium-border rounded-md">
                  <WarningIcon />
                  <span className="text-xs text-severity-medium">
                    An indicator with this value already exists
                  </span>
                </div>
              )}

              {/* Auto-detected type hint */}
              {form.value.trim() && form.type && (
                <p className="text-xs text-text-tertiary mt-1">
                  Detected as: <span className="text-augur-blue">{getIndicatorTypeLabel(form.type as IndicatorType)}</span>
                </p>
              )}
            </div>

            {/* Type and Severity - Side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                  Type <span className="text-severity-critical">*</span>
                </label>
                <Select
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, type: e.target.value as IndicatorType | '' }))
                  }
                  onBlur={() => handleBlur('type')}
                  options={TYPE_OPTIONS}
                  placeholder="Select type..."
                  className={touched.type && errors.type ? 'border-severity-critical' : ''}
                />
                {touched.type && errors.type && (
                  <p className="text-xs text-severity-critical mt-1">{errors.type}</p>
                )}
              </div>

              {/* Severity */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                  Severity <span className="text-severity-critical">*</span>
                </label>
                <Select
                  value={form.severity}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, severity: e.target.value as Severity | '' }))
                  }
                  onBlur={() => handleBlur('severity')}
                  options={SEVERITY_OPTIONS}
                  placeholder="Select severity..."
                  className={touched.severity && errors.severity ? 'border-severity-critical' : ''}
                />
                {touched.severity && errors.severity && (
                  <p className="text-xs text-severity-critical mt-1">{errors.severity}</p>
                )}
              </div>
            </div>

            {/* Confidence */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                Confidence <span className="text-severity-critical">*</span>
              </label>
              <Slider
                value={form.confidence}
                onChange={(value) => setForm((prev) => ({ ...prev, confidence: value }))}
              />
            </div>

            {/* Source */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                Source <span className="text-severity-critical">*</span>
              </label>
              <Combobox
                value={form.source}
                onChange={(value) => setForm((prev) => ({ ...prev, source: value }))}
                options={PREDEFINED_SOURCES}
                placeholder="Select or enter source..."
                error={touched.source && !!errors.source}
              />
              {touched.source && errors.source && (
                <p className="text-xs text-severity-critical mt-1">{errors.source}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-baseline gap-2 mb-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Tags <span className="text-severity-critical">*</span>
                </label>
                <span className="text-[10px] text-text-tertiary font-normal normal-case tracking-normal">
                  Press Enter to add a tag
                </span>
              </div>
              <TagInput
                tags={form.tags}
                onChange={(tags) => setForm((prev) => ({ ...prev, tags }))}
                placeholder="Add tags (press Enter)..."
                error={touched.tags && !!errors.tags}
              />
              {touched.tags && errors.tags && (
                <p className="text-xs text-severity-critical mt-1">{errors.tags}</p>
              )}
            </div>

            {/* Last Seen */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                Last Seen <span className="text-severity-critical">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.lastSeen}
                onChange={(e) => setForm((prev) => ({ ...prev, lastSeen: e.target.value }))}
                onBlur={() => handleBlur('lastSeen')}
                className={`
                  w-full
                  bg-bg-input
                  border rounded-md
                  text-text-primary
                  font-sans text-sm
                  py-1.5 px-3
                  outline-none
                  transition-all duration-150 ease-in-out
                  focus:border-augur-blue
                  focus:shadow-[0_0_0_2px_rgba(99,131,255,0.15)]
                  ${touched.lastSeen && errors.lastSeen ? 'border-severity-critical' : 'border-border'}
                `}
              />
              {touched.lastSeen && errors.lastSeen && (
                <p className="text-xs text-severity-critical mt-1">{errors.lastSeen}</p>
              )}
            </div>

            {/* Optional Fields Section */}
            <div className="border-t border-border-subtle pt-4">
              <button
                type="button"
                onClick={() => setShowOptional(!showOptional)}
                className="
                  flex items-center gap-2 w-full
                  text-sm text-text-secondary
                  hover:text-text-primary
                  transition-colors
                "
              >
                <ChevronIcon isOpen={showOptional} />
                Additional Fields (Optional)
              </button>

              {showOptional && (
                <div className="mt-4 space-y-4">
                  {/* First Seen */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      First Seen
                    </label>
                    <input
                      type="datetime-local"
                      value={form.firstSeen}
                      onChange={(e) => setForm((prev) => ({ ...prev, firstSeen: e.target.value }))}
                      placeholder={form.lastSeen}
                      className="
                        w-full
                        bg-bg-input
                        border border-border rounded-md
                        text-text-primary
                        font-sans text-sm
                        py-1.5 px-3
                        outline-none
                        transition-all duration-150 ease-in-out
                        placeholder:text-text-tertiary
                        focus:border-augur-blue
                        focus:shadow-[0_0_0_2px_rgba(99,131,255,0.15)]
                      "
                    />
                    <p className="text-xs text-text-tertiary mt-1">
                      Defaults to Last Seen if not specified
                    </p>
                  </div>

                  {/* Provider */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Provider
                    </label>
                    <Input
                      value={form.provider}
                      onChange={(e) => setForm((prev) => ({ ...prev, provider: e.target.value }))}
                      placeholder={form.source || 'Same as source'}
                    />
                    <p className="text-xs text-text-tertiary mt-1">
                      Defaults to Source if not specified
                    </p>
                  </div>

                  {/* Reports */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Reports
                    </label>
                    <Input
                      type="number"
                      value={form.reports || ''}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, reports: parseInt(e.target.value) || 0 }))
                      }
                      placeholder={String(Math.round(form.confidence * 15))}
                    />
                    <p className="text-xs text-text-tertiary mt-1">
                      Defaults to confidence × 15 ({Math.round(form.confidence * 15)})
                    </p>
                  </div>

                  {/* Related Campaigns */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Related Campaigns
                    </label>
                    <Input
                      value={form.relatedCampaigns}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, relatedCampaigns: e.target.value }))
                      }
                      placeholder="Unknown"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-end gap-3 shrink-0">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            Add Indicator
          </Button>
        </div>
      </div>
    </div>
  );
}
