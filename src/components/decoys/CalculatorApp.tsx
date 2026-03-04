import { useState } from 'react';

export function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);

  const handleNumber = (n: string) => {
    if (reset) { setDisplay(n); setReset(false); return; }
    setDisplay(display === '0' ? n : display + n);
  };

  const handleOp = (newOp: string) => {
    if (prev && op && !reset) {
      const result = calc(parseFloat(prev), parseFloat(display), op);
      setDisplay(String(result));
      setPrev(String(result));
    } else {
      setPrev(display);
    }
    setOp(newOp);
    setReset(true);
  };

  const handleEquals = () => {
    if (!prev || !op) return;
    const result = calc(parseFloat(prev), parseFloat(display), op);
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setReset(true);
  };

  const handleClear = () => { setDisplay('0'); setPrev(null); setOp(null); };

  const calc = (a: number, b: number, o: string) => {
    if (o === '+') return a + b;
    if (o === '-') return a - b;
    if (o === '×') return a * b;
    if (o === '÷') return b !== 0 ? a / b : 0;
    return b;
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const handlePress = (btn: string) => {
    if (btn === 'C') handleClear();
    else if (btn === '±') setDisplay(String(-parseFloat(display)));
    else if (btn === '%') setDisplay(String(parseFloat(display) / 100));
    else if (['+', '-', '×', '÷'].includes(btn)) handleOp(btn);
    else if (btn === '=') handleEquals();
    else if (btn === '.') { if (!display.includes('.')) setDisplay(display + '.'); }
    else handleNumber(btn);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-end pb-8">
      <div className="px-6 pb-6">
        <p className="text-right text-6xl font-light text-white tracking-tight overflow-hidden">
          {display.length > 10 ? parseFloat(display).toExponential(4) : display}
        </p>
      </div>
      <div className="px-4 space-y-3">
        {buttons.map((row, i) => (
          <div key={i} className="flex gap-3 justify-center">
            {row.map(btn => {
              const isOp = ['+', '-', '×', '÷'].includes(btn);
              const isFunc = ['C', '±', '%'].includes(btn);
              const isZero = btn === '0';
              const isEquals = btn === '=';
              return (
                <button
                  key={btn}
                  onClick={(e) => { e.stopPropagation(); handlePress(btn); }}
                  className={`
                    ${isZero ? 'flex-[2] pl-8' : 'w-[72px]'} h-[72px] rounded-full text-2xl font-medium flex items-center
                    ${isZero ? 'justify-start' : 'justify-center'}
                    ${isOp || isEquals ? 'bg-orange-500 text-white active:bg-orange-300' : ''}
                    ${isFunc ? 'bg-neutral-700 text-white active:bg-neutral-500' : ''}
                    ${!isOp && !isFunc && !isEquals ? 'bg-neutral-800 text-white active:bg-neutral-600' : ''}
                  `}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
