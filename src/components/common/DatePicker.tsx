import React from 'react';
import { createPortal } from 'react-dom';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
  anchorRect: DOMRect;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type View = 'calendar' | 'year';

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, onClose, anchorRect }) => {
  const [view, setView] = React.useState<View>('calendar');
  const [viewYear, setViewYear] = React.useState(value.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(value.getMonth());
  // Year grid shows 12 years starting from yearRangeStart
  const [yearRangeStart, setYearRangeStart] = React.useState(() => Math.floor(value.getFullYear() / 12) * 12);

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const selectedDate = React.useMemo(() => {
    const d = new Date(value);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [value]);

  const POPUP_WIDTH = 272;
  const POPUP_HEIGHT = 340;
  const GAP = 8;

  const left = Math.min(anchorRect.left, window.innerWidth - POPUP_WIDTH - 8);
  const top =
    anchorRect.bottom + GAP + POPUP_HEIGHT > window.innerHeight
      ? anchorRect.top - POPUP_HEIGHT - GAP
      : anchorRect.bottom + GAP;

  // --- Calendar helpers ---
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day: number) => {
    onChange(new Date(viewYear, viewMonth, day, 12, 0, 0));
    onClose();
  };

  const openYearView = () => {
    setYearRangeStart(Math.floor(viewYear / 12) * 12);
    setView('year');
  };

  // --- Year grid helpers ---
  const years = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);

  const selectYear = (year: number) => {
    setViewYear(year);
    setView('calendar');
  };

  // --- Shared header button style ---
  const headerBtn = (style?: React.CSSProperties): React.CSSProperties => ({
    background: 'transparent',
    color: 'rgba(255,255,255,0.85)',
    borderRadius: 8,
    padding: '6px',
    cursor: 'pointer',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s',
    ...style,
  });

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100]" onClick={onClose} />

      {/* Popup */}
      <div
        className="fixed z-[101] rounded-2xl shadow-2xl overflow-hidden"
        style={{
          left,
          top,
          width: POPUP_WIDTH,
          border: '1px solid #e2e8f0',
          background: '#fff',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
        >
          {view === 'calendar' ? (
            <>
              <button
                style={headerBtn()}
                onClick={prevMonth}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Clickable month + year label */}
              <button
                onClick={openYearView}
                className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors select-none"
                style={{ color: '#fff', fontWeight: 600, fontSize: 14, letterSpacing: '0.02em' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                title="Pick a year"
              >
                <span>{MONTHS[viewMonth]}</span>
                <span
                  className="px-1.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(255,255,255,0.2)', fontSize: 13 }}
                >
                  {viewYear}
                </span>
                <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <button
                style={headerBtn()}
                onClick={nextMonth}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                style={headerBtn()}
                onClick={() => setYearRangeStart(y => y - 12)}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => setView('calendar')}
                className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors select-none"
                style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                title="Back to calendar"
              >
                <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                </svg>
                <span>{yearRangeStart} – {yearRangeStart + 11}</span>
              </button>

              <button
                style={headerBtn()}
                onClick={() => setYearRangeStart(y => y + 12)}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* ── YEAR GRID ── */}
        {view === 'year' && (
          <div className="grid grid-cols-3 gap-2 p-4">
            {years.map(year => {
              const isCurrent = year === viewYear;
              const isThisYear = year === today.getFullYear();
              return (
                <button
                  key={year}
                  onClick={() => selectYear(year)}
                  className="rounded-xl py-2.5 text-sm font-semibold transition-all select-none"
                  style={{
                    background: isCurrent ? '#2563eb' : isThisYear ? '#eff6ff' : 'transparent',
                    color: isCurrent ? '#fff' : isThisYear ? '#2563eb' : '#374151',
                    boxShadow: isCurrent ? '0 1px 4px rgba(37,99,235,0.4)' : undefined,
                    border: isThisYear && !isCurrent ? '1px solid #bfdbfe' : '1px solid transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isCurrent) e.currentTarget.style.background = isThisYear ? '#dbeafe' : '#f1f5f9';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = isCurrent ? '#2563eb' : isThisYear ? '#eff6ff' : 'transparent';
                  }}
                >
                  {year}
                </button>
              );
            })}
          </div>
        )}

        {/* ── CALENDAR VIEW ── */}
        {view === 'calendar' && (
          <>
            {/* Day-of-week labels */}
            <div className="grid grid-cols-7 px-2 pt-3 pb-1">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-gray-400 select-none py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 px-2 pb-3 gap-y-0.5">
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />;

                const cellDate = new Date(viewYear, viewMonth, day);
                cellDate.setHours(0, 0, 0, 0);
                const isSelected = cellDate.getTime() === selectedDate.getTime();
                const isToday = cellDate.getTime() === today.getTime();

                return (
                  <button
                    key={day}
                    onClick={() => selectDay(day)}
                    className="flex items-center justify-center rounded-lg text-sm font-medium transition-all select-none"
                    style={{
                      height: 34,
                      background: isSelected ? '#2563eb' : isToday ? '#eff6ff' : 'transparent',
                      color: isSelected ? '#fff' : isToday ? '#2563eb' : '#374151',
                      fontWeight: isToday || isSelected ? 700 : 500,
                      boxShadow: isSelected ? '0 1px 4px rgba(37,99,235,0.4)' : undefined,
                    }}
                    onMouseEnter={e => {
                      if (!isSelected)
                        e.currentTarget.style.background = isToday ? '#dbeafe' : '#f1f5f9';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = isSelected ? '#2563eb' : isToday ? '#eff6ff' : 'transparent';
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Today shortcut */}
            <div className="border-t border-gray-100 px-3 py-2 flex justify-center">
              <button
                onClick={() => {
                  const t = new Date();
                  setViewYear(t.getFullYear());
                  setViewMonth(t.getMonth());
                  selectDay(t.getDate());
                }}
                className="text-xs font-semibold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>
          </>
        )}
      </div>
    </>,
    document.body
  );
};
