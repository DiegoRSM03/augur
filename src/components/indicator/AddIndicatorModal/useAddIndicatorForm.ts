import { useState, useCallback, useEffect, useMemo, type FormEvent } from 'react';
import { detectIndicatorType } from '../../../utils/detectIndicatorType';
import type { Indicator, IndicatorType, Severity } from '../../../types/indicator';
import type { FormState, FormErrors } from './constants';

function getCurrentDateTimeLocal(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

interface UseAddIndicatorFormParams {
  isOpen: boolean;
  existingValues: string[];
  onAdd: (indicator: Omit<Indicator, 'id'>) => void;
}

export function useAddIndicatorForm({
  isOpen,
  existingValues,
  onAdd,
}: UseAddIndicatorFormParams) {
  const now = getCurrentDateTimeLocal();

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

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showOptional, setShowOptional] = useState(false);

  const isDuplicate = useMemo(() => {
    return form.value.trim() !== '' && existingValues.includes(form.value.trim());
  }, [form.value, existingValues]);

  useEffect(() => {
    if (form.value.trim()) {
      const detectedType = detectIndicatorType(form.value);
      if (detectedType && !form.type) {
        setForm((prev) => ({ ...prev, type: detectedType }));
      }
    }
  }, [form.value, form.type]);

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

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
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

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Cmd/Ctrl+Enter to submit
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isFormValid) {
        handleSubmit(e as unknown as FormEvent);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFormValid, handleSubmit]);

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

  return {
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
  };
}
