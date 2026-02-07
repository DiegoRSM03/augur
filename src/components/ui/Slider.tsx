import { useCallback, useMemo, type ChangeEvent } from 'react';
import { Button } from './Button';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  showPresets?: boolean;
}

// Preset values for quick selection
const PRESETS = [
  { label: 'Low', value: 25 },
  { label: 'Medium', value: 50 },
  { label: 'High', value: 75 },
  { label: 'Critical', value: 90 },
] as const;

/**
 * Returns the severity color based on the confidence value
 */
function getSeverityColor(value: number): string {
  if (value >= 80) return 'var(--severity-critical)';
  if (value >= 60) return 'var(--severity-high)';
  if (value >= 40) return 'var(--severity-medium)';
  return 'var(--severity-low)';
}

/**
 * Returns Tailwind text color class based on the confidence value
 */
function getSeverityTextClass(value: number): string {
  if (value >= 80) return 'text-severity-critical';
  if (value >= 60) return 'text-severity-high';
  if (value >= 40) return 'text-severity-medium';
  return 'text-severity-low';
}

/**
 * Slider component for confidence score input.
 *
 * Features:
 * - Range input 0-100
 * - Color changes based on severity thresholds
 * - Optional preset buttons for quick selection
 * - Displays current value with severity-based coloring
 */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  showPresets = true,
}: SliderProps) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange]
  );

  const handlePresetClick = useCallback(
    (presetValue: number) => {
      onChange(presetValue);
    },
    [onChange]
  );

  // Calculate fill percentage for the track
  const fillPercentage = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const severityColor = getSeverityColor(value);
  const textColorClass = getSeverityTextClass(value);

  return (
    <div className="space-y-3">
      {/* Slider with value display */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          {/* Track background */}
          <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
            {/* Filled portion */}
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{
                width: `${fillPercentage}%`,
                backgroundColor: severityColor,
              }}
            />
          </div>

          {/* Range input (invisible but interactive) */}
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            className="
              absolute inset-0 w-full
              appearance-none bg-transparent cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-[18px]
              [&::-webkit-slider-thumb]:h-[18px]
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-border
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:appearance-none
              [&::-moz-range-thumb]:w-[18px]
              [&::-moz-range-thumb]:h-[18px]
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-2
              [&::-moz-range-thumb]:border-border
              [&::-moz-range-thumb]:shadow-md
              [&::-moz-range-thumb]:cursor-pointer
            "
            style={
              {
                '--thumb-color': severityColor,
              } as React.CSSProperties
            }
          />
        </div>

        {/* Value display */}
        <span className={`font-mono text-lg font-bold min-w-[40px] text-right ${textColorClass}`}>
          {value}
        </span>
      </div>

      {/* Preset buttons */}
      {showPresets && (
        <div className="flex gap-2">
          {PRESETS.map((preset) => (
            <Button
              key={preset.label}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handlePresetClick(preset.value)}
              className={value === preset.value ? 'bg-bg-card' : ''}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
