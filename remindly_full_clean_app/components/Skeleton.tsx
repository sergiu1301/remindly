'use client';

export default function Skeleton({ height = 20 }: { height?: number }) {
  return (
    <div
      style={{
        height,
        width: '100%',
        borderRadius: 8,
        background: 'linear-gradient(90deg, #111827 25%, #1f2937 50%, #111827 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.2s infinite'
      }}
    />
  );
}