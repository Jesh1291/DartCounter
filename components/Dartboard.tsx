import React from 'react';
import type { HitSegment } from '../types';
import {
  DARTBOARD_NUMBERS,
  VIEWBOX_SIZE,
  CENTER,
  NUMBER_RADIUS,
  DOUBLE_OUTER_RADIUS,
  DOUBLE_INNER_RADIUS,
  SINGLE_OUTER_RADIUS,
  TREBLE_OUTER_RADIUS,
  TREBLE_INNER_RADIUS,
  SINGLE_INNER_RADIUS,
  OUTER_BULL_RADIUS,
  BULLSEYE_RADIUS,
  COLOR_BLACK,
  COLOR_WHITE,
  COLOR_RED,
  COLOR_GREEN,
  HIT_COLOR
} from '../constants';

interface DartboardProps {
  onThrow: (hit: HitSegment) => void;
  hitAnimation: HitSegment | null;
}

const getSegmentPath = (
  segmentIndex: number,
  outerRadius: number,
  innerRadius: number
): string => {
  const angle = 18; // 360 / 20
  const startAngle = segmentIndex * angle - angle / 2 - 90;
  const endAngle = startAngle + angle;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const startOuter = {
    x: CENTER + outerRadius * Math.cos(toRad(startAngle)),
    y: CENTER + outerRadius * Math.sin(toRad(startAngle)),
  };
  const endOuter = {
    x: CENTER + outerRadius * Math.cos(toRad(endAngle)),
    y: CENTER + outerRadius * Math.sin(toRad(endAngle)),
  };
  const startInner = {
    x: CENTER + innerRadius * Math.cos(toRad(startAngle)),
    y: CENTER + innerRadius * Math.sin(toRad(startAngle)),
  };
  const endInner = {
    x: CENTER + innerRadius * Math.cos(toRad(endAngle)),
    y: CENTER + innerRadius * Math.sin(toRad(endAngle)),
  };

  const largeArcFlag = 0; // An 18-degree arc is never "large"

  return `
    M ${startOuter.x} ${startOuter.y}
    A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}
    L ${endInner.x} ${endInner.y}
    A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}
    Z
  `;
};

const Dartboard: React.FC<DartboardProps> = ({ onThrow, hitAnimation }) => {
  const isSegmentHit = (segment: number, multiplier: number) => {
    if (!hitAnimation) return false;
    return hitAnimation.segment === segment && hitAnimation.multiplier === multiplier;
  };
  
  return (
    <div className="flex justify-center items-center p-4">
      <svg
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        className="max-w-full w-[500px] h-auto"
        style={{ touchAction: 'manipulation' }}
      >
        <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                <feOffset in="blur" dx="2" dy="2" result="offsetBlur"/>
                <feMerge>
                    <feMergeNode in="offsetBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={DOUBLE_OUTER_RADIUS + 10} fill="#333" filter="url(#shadow)" />

        {DARTBOARD_NUMBERS.map((num, i) => {
          const isEven = i % 2 === 0;
          const isHit = (mult: number) => isSegmentHit(num, mult);
          return (
            <g key={`segment-${num}`}>
              {/* Double Ring */}
              <path
                d={getSegmentPath(i, DOUBLE_OUTER_RADIUS, DOUBLE_INNER_RADIUS)}
                fill={isHit(2) ? HIT_COLOR : (isEven ? COLOR_RED : COLOR_GREEN)}
                onClick={() => onThrow({ score: num, multiplier: 2, segment: num })}
                className="cursor-pointer transition-all duration-100"
              />
              {/* Outer Single Ring */}
              <path
                d={getSegmentPath(i, SINGLE_OUTER_RADIUS, TREBLE_OUTER_RADIUS)}
                fill={isHit(1) ? HIT_COLOR : (isEven ? COLOR_WHITE : COLOR_BLACK)}
                onClick={() => onThrow({ score: num, multiplier: 1, segment: num })}
                className="cursor-pointer transition-all duration-100"
              />
              {/* Treble Ring */}
              <path
                d={getSegmentPath(i, TREBLE_OUTER_RADIUS, TREBLE_INNER_RADIUS)}
                fill={isHit(3) ? HIT_COLOR : (isEven ? COLOR_RED : COLOR_GREEN)}
                onClick={() => onThrow({ score: num, multiplier: 3, segment: num })}
                className="cursor-pointer transition-all duration-100"
              />
              {/* Inner Single Ring */}
              <path
                d={getSegmentPath(i, SINGLE_INNER_RADIUS, OUTER_BULL_RADIUS)}
                fill={isHit(1) ? HIT_COLOR : (isEven ? COLOR_WHITE : COLOR_BLACK)}
                onClick={() => onThrow({ score: num, multiplier: 1, segment: num })}
                className="cursor-pointer transition-all duration-100"
              />
            </g>
          );
        })}

        {/* Bullseye */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={OUTER_BULL_RADIUS}
          fill={isSegmentHit(25, 1) ? HIT_COLOR : COLOR_GREEN}
          onClick={() => onThrow({ score: 25, multiplier: 1, segment: 25 })}
          className="cursor-pointer transition-all duration-100"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={BULLSEYE_RADIUS}
          fill={isSegmentHit(25, 2) ? HIT_COLOR : COLOR_RED}
          onClick={() => onThrow({ score: 25, multiplier: 2, segment: 25 })}
          className="cursor-pointer transition-all duration-100"
        />
        
        {/* Numbers */}
        {DARTBOARD_NUMBERS.map((num, i) => {
            const angle = 18 * i - 90;
            const toRad = (deg: number) => (deg * Math.PI) / 180;
            const x = CENTER + NUMBER_RADIUS * Math.cos(toRad(angle));
            const y = CENTER + NUMBER_RADIUS * Math.sin(toRad(angle));
            return (
                <text
                    key={`number-${num}`}
                    x={x}
                    y={y + 7}
                    textAnchor="middle"
                    fill={COLOR_WHITE}
                    fontSize="20"
                    fontWeight="bold"
                    style={{ pointerEvents: 'none' }}
                >
                    {num}
                </text>
            )
        })}
      </svg>
    </div>
  );
};

export default React.memo(Dartboard);