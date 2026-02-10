import { Button, Input, Select, TagInput, Slider, Combobox, ChevronIcon, WarningIcon, Modal } from '../ui';
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
  } = useAddIndicatorForm({ isOpen, existingValues, onClose, onAdd });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="md"
      aria-labelledby="add-indicator-modal-title"
    >
      <Modal.Header id="add-indicator-modal-title" title="Add Indicator" />

      <Modal.Body>
        <form onSubmit={handleSubmit} id="add-indicator-form">
          <div className="p-6 space-y-5">
            <IndicatorValueField
              value={form.value}
              type={form.type}
              error={touched.value ? errors.value : undefined}
              isDuplicate={isDuplicate}
              onChange={(value) => setForm((prev) => ({ ...prev, value }))}
              onBlur={() => handleBlur('value')}
            />

            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Type"
                value={form.type}
                options={TYPE_OPTIONS}
                placeholder="Select type..."
                error={touched.type ? errors.type : undefined}
                onChange={(value) => setForm((prev) => ({ ...prev, type: value as IndicatorType | '' }))}
                onBlur={() => handleBlur('type')}
              />

              <SelectField
                label="Severity"
                value={form.severity}
                options={SEVERITY_OPTIONS}
                placeholder="Select severity..."
                error={touched.severity ? errors.severity : undefined}
                onChange={(value) => setForm((prev) => ({ ...prev, severity: value as Severity | '' }))}
                onBlur={() => handleBlur('severity')}
              />
            </div>

            <div>
              <FieldLabel label="Confidence" required />
              <Slider
                value={form.confidence}
                onChange={(value) => setForm((prev) => ({ ...prev, confidence: value }))}
              />
            </div>

            <div>
              <FieldLabel label="Source" required />
              <Combobox
                value={form.source}
                onChange={(value) => setForm((prev) => ({ ...prev, source: value }))}
                options={PREDEFINED_SOURCES}
                placeholder="Select or enter source..."
                error={touched.source && !!errors.source}
              />
              {touched.source && errors.source && (
                <FieldError error={errors.source} />
              )}
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-1.5">
                <FieldLabel label="Tags" required className="mb-0" />
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
                <FieldError error={errors.tags} />
              )}
            </div>

            <DateTimeField
              label="Last Seen"
              value={form.lastSeen}
              error={touched.lastSeen ? errors.lastSeen : undefined}
              onChange={(value) => setForm((prev) => ({ ...prev, lastSeen: value }))}
              onBlur={() => handleBlur('lastSeen')}
              required
            />

            <OptionalFieldsSection
              showOptional={showOptional}
              onToggle={() => setShowOptional(!showOptional)}
              form={form}
              setForm={setForm}
            />
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-indicator-form"
            variant="primary"
            disabled={!isFormValid}
          >
            Add Indicator
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

interface FieldLabelProps {
  label: string;
  required?: boolean;
  className?: string;
}

function FieldLabel({ label, required, className = 'mb-1.5' }: FieldLabelProps) {
  return (
    <label className={`block text-[11px] font-semibold uppercase tracking-wider text-text-tertiary ${className}`}>
      {label} {required && <span className="text-severity-critical">*</span>}
    </label>
  );
}

function FieldError({ error }: { error: string }) {
  return <p className="text-xs text-severity-critical mt-1">{error}</p>;
}

interface IndicatorValueFieldProps {
  value: string;
  type: string;
  error?: string;
  isDuplicate: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function IndicatorValueField({
  value,
  type,
  error,
  isDuplicate,
  onChange,
  onBlur,
}: IndicatorValueFieldProps) {
  return (
    <div>
      <FieldLabel label="Indicator Value" required />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder="Enter IP, domain, hash, or URL..."
        className={`font-mono ${error ? 'border-severity-critical' : ''}`}
      />
      {error && <FieldError error={error} />}

      {isDuplicate && (
        <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-severity-medium-bg border border-severity-medium-border rounded-md">
          <WarningIcon />
          <span className="text-xs text-severity-medium">
            An indicator with this value already exists
          </span>
        </div>
      )}

      {value.trim() && type && (
        <p className="text-xs text-text-tertiary mt-1">
          Detected as: <span className="text-augur-blue">{getIndicatorTypeLabel(type as IndicatorType)}</span>
        </p>
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function SelectField({
  label,
  value,
  options,
  placeholder,
  error,
  onChange,
  onBlur,
}: SelectFieldProps) {
  return (
    <div>
      <FieldLabel label={label} required />
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        options={options}
        placeholder={placeholder}
        className={error ? 'border-severity-critical' : ''}
      />
      {error && <FieldError error={error} />}
    </div>
  );
}

interface DateTimeFieldProps {
  label: string;
  value: string;
  error?: string;
  hint?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
}

function DateTimeField({
  label,
  value,
  error,
  hint,
  onChange,
  onBlur,
  required,
}: DateTimeFieldProps) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
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
          ${error ? 'border-severity-critical' : 'border-border'}
        `}
      />
      {error && <FieldError error={error} />}
      {hint && <p className="text-xs text-text-tertiary mt-1">{hint}</p>}
    </div>
  );
}

interface OptionalFieldsSectionProps {
  showOptional: boolean;
  onToggle: () => void;
  form: {
    firstSeen: string;
    lastSeen: string;
    provider: string;
    source: string;
    reports: number;
    confidence: number;
    relatedCampaigns: string;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    value: string;
    type: string;
    severity: string;
    confidence: number;
    source: string;
    tags: string[];
    lastSeen: string;
    firstSeen: string;
    provider: string;
    reports: number;
    relatedCampaigns: string;
  }>>;
}

function OptionalFieldsSection({ showOptional, onToggle, form, setForm }: OptionalFieldsSectionProps) {
  return (
    <div className="border-t border-border-subtle pt-4">
      <button
        type="button"
        onClick={onToggle}
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
          <DateTimeField
            label="First Seen"
            value={form.firstSeen}
            hint="Defaults to Last Seen if not specified"
            onChange={(value) => setForm((prev) => ({ ...prev, firstSeen: value }))}
          />

          <div>
            <FieldLabel label="Provider" />
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
            <FieldLabel label="Reports" />
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
            <FieldLabel label="Related Campaigns" />
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
  );
}
