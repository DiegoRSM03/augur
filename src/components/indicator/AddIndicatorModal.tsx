import { Button, Input, Select, TagInput, Slider, Combobox, CloseIcon, ChevronIcon } from '../ui';
import { getIndicatorTypeLabel } from '../../utils/detectIndicatorType';
import type { Indicator, IndicatorType, Severity } from '../../types/indicator';
import { useAddIndicatorForm } from './useAddIndicatorForm';
import { PREDEFINED_SOURCES, SEVERITY_OPTIONS, TYPE_OPTIONS } from './constants';

interface AddIndicatorModalProps {
  isOpen: boolean;
  existingValues: string[];
  onClose: () => void;
  onAdd: (indicator: Omit<Indicator, 'id'>) => void;
}

const WarningIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export function AddIndicatorModal({
  isOpen,
  existingValues,
  onClose,
  onAdd,
}: AddIndicatorModalProps) {
  const {
    form,
    setForm,
    errors,
    touched,
    showOptional,
    setShowOptional,
    isDuplicate,
    isFormValid,
    handleSubmit,
    handleBlur,
    handleOverlayClick,
  } = useAddIndicatorForm({ isOpen, existingValues, onClose, onAdd });

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

              {isDuplicate && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-severity-medium-bg border border-severity-medium-border rounded-md">
                  <WarningIcon />
                  <span className="text-xs text-severity-medium">
                    An indicator with this value already exists
                  </span>
                </div>
              )}

              {form.value.trim() && form.type && (
                <p className="text-xs text-text-tertiary mt-1">
                  Detected as: <span className="text-augur-blue">{getIndicatorTypeLabel(form.type as IndicatorType)}</span>
                </p>
              )}
            </div>

            {/* Type and Severity */}
            <div className="grid grid-cols-2 gap-4">
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
