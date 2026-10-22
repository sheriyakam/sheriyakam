import React from 'react';

interface CodeHypeBadgeProps {
  className?: string;
}

export default function CodeHypeBadge({ className = '' }: CodeHypeBadgeProps) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <a
        href="https://www.codehype.ai/product/sheriyakam?utm_source=codehype_badge"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-transform hover:scale-105 active:scale-95"
        style={{ display: 'inline-block', border: 0 }}
      >
        <img
          src="https://www.codehype.ai/badges/sheriyakam.svg?variant=find-us&v=20"
          alt="Featured on CodeHype"
          width={180}
          height={65}
          loading="lazy"
          decoding="async"
          style={{
            display: 'inline-block',
            border: 0,
            width: '100%',
            maxWidth: '180px',
            height: 'auto',
            maxHeight: '65px',
          }}
        />
      </a>
    </div>
  );
}
