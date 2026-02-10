import { useCallback, useMemo, type ChangeEvent } from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  showPresets?: boolean;
}

// Preset values for quick confidence selection
// These are confidence levels, NOT severity levels
const PRESETS = [
  { label: '25%', value: 25 },
  { label: '50%', value: 50 },
  { label: '75%', value: 75 },
  { label: '100%', value: 100 },
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
    <div className="space-y-2">
      {/* Slider with value display */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          {/* Track background - brighter for better contrast */}
          <div className="h-2 bg-[#2a3040] rounded-full overflow-hidden border border-[#3a4255]">
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
              [&::-webkit-slider-thumb]:border-[#4a5270]
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:appearance-none
              [&::-moz-range-thumb]:w-[18px]
              [&::-moz-range-thumb]:h-[18px]
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-2
              [&::-moz-range-thumb]:border-[#4a5270]
              [&::-moz-range-thumb]:shadow-lg
              [&::-moz-range-thumb]:cursor-pointer
            "
            style={
              {
                '--thumb-color': severityColor,
              } as React.CSSProperties
            }
          />

          {/* Preset stop markers positioned along the track */}
          {showPresets && (
            <div className="absolute inset-x-0 top-full mt-1">
              <div className="relative h-6">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePresetClick(preset.value)}
                    className={`
                      absolute -translate-x-1/2
                      flex flex-col items-center gap-0.5
                      transition-all duration-150
                      group
                    `}
                    style={{ left: `${preset.value}%` }}
                  >
                    {/* Tick mark */}
                    <div
                      className={`
                        w-0.5 h-2 rounded-full bg-text-tertiary
                        transition-all duration-150
                        ${value === preset.value ? 'h-2.5 bg-text-secondary' : 'group-hover:h-2.5 group-hover:bg-text-secondary'}
                      `}
                    />
                    {/* Label */}
                    <span
                      className={`
                        text-[10px] font-medium
                        transition-all duration-150
                        ${value === preset.value ? 'text-text-primary' : 'text-text-tertiary group-hover:text-text-secondary'}
                      `}
                    >
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Value display */}
        <span className={`font-mono text-lg font-bold min-w-[40px] text-right ${textColorClass}`}>
          {value}
        </span>
      </div>

      {/* Spacer for the preset markers */}
      {showPresets && <div className="h-6" />}
    </div>
  );
}
