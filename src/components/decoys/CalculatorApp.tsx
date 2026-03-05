import { useState } from 'react';
import { Delete } from 'lucide-react';

export function CalculatorApp({ onTripleTap }: { onTripleTap?: () => void }) {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);

  const handleNumber = (n: string) => {
    if (reset) { setDisplay(n); setReset(false); return; }
    if (display.length >= 12) return;
    setDisplay(display === '0' ? n : display + n);
  };

  const handleOp = (newOp: string) => {
    if (prev && op && !reset) {
      const result = calc(parseFloat(prev), parseFloat(display), op);
      const formatted = formatResult(result);
      setDisplay(formatted);
      setPrev(formatted);
    } else {
      setPrev(display);
    }
    setOp(newOp);
    setReset(true);
  };

  const handleEquals = () => {
    if (!prev || !op) return;
    const result = calc(parseFloat(prev), parseFloat(display), op);
    setDisplay(formatResult(result));
    setPrev(null);
    setOp(null);
    setReset(true);
  };

  const handleClear = () => { setDisplay('0'); setPrev(null); setOp(null); setReset(false); };

  const handleBackspace = () => {
    if (reset) return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  const formatResult = (n: number): string => {
    if (!isFinite(n)) return 'Error';
    // Avoid floating point artifacts like 0.1 + 0.2 = 0.30000000000000004
    const rounded = parseFloat(n.toPrecision(10));
    return String(rounded);
  };

  const calc = (a: number, b: number, o: string) => {
    if (o === '+') return a + b;
    if (o === '-') return a - b;
    if (o === '×') return a * b;
    if (o === '÷') return b !== 0 ? a / b : Infinity;
    return b;
  };

  const buttons = [
    ['C', '⌫', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['±', '0', '.', '='],
  ];

  const handlePress = (btn: string) => {
    if (display === 'Error' && btn !== 'C') { handleClear(); }
    if (btn === 'C') handleClear();
    else if (btn === '⌫') handleBackspace();
    else if (btn === '±') setDisplay(d => d === '0' ? d : String(-parseFloat(d)));
    else if (btn === '%') { setDisplay(formatResult(parseFloat(display) / 100)); setReset(true); }
    else if (['+', '-', '×', '÷'].includes(btn)) handleOp(btn);
    else if (btn === '=') handleEquals();
    else if (btn === '.') { if (!display.includes('.')) setDisplay(display + '.'); }
    else handleNumber(btn);
  };

  const fontSize = display.length > 8 ? 'text-4xl' : display.length > 6 ? 'text-5xl' : 'text-6xl';

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-end pb-8">
      <div className="px-6 pb-2">
        {prev && op && (
          <p className="text-right text-sm text-neutral-500 mb-1">
            {prev} {op}
          </p>
        )}
        <p className={`text-right ${fontSize} font-light text-white tracking-tight overflow-hidden transition-all`}>
          {display}
        </p>
      </div>
      <div className="px-4 pt-4 space-y-3">
        {buttons.map((row, i) => (
          <div key={i} className="flex gap-3 justify-center">
            {row.map(btn => {
              const isOp = ['+', '-', '×', '÷'].includes(btn);
              const isActiveOp = isOp && op === btn && reset;
              const isFunc = ['C', '⌫', '%'].includes(btn);
              const isEquals = btn === '=';
              return (
                <button
                  key={btn}
                  onClick={(e) => { e.stopPropagation(); handlePress(btn); }}
                  onPointerDown={btn === 'C' ? onTripleTap : undefined}
                  className={`
                    w-[72px] h-[72px] rounded-full text-2xl font-medium flex items-center justify-center
                    transition-colors select-none
                    ${isActiveOp ? 'bg-white text-orange-500' : ''}
                    ${isOp && !isActiveOp ? 'bg-orange-500 text-white active:bg-orange-300' : ''}
                    ${isEquals ? 'bg-orange-500 text-white active:bg-orange-300' : ''}
                    ${isFunc ? 'bg-neutral-700 text-white active:bg-neutral-500' : ''}
                    ${!isOp && !isFunc && !isEquals ? 'bg-neutral-800 text-white active:bg-neutral-600' : ''}
                  `}
                >
                  {btn === '⌫' ? <Delete className="w-5 h-5" /> : btn}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
