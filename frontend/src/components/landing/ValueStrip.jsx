import React from 'react';

export const ValueStrip = () => {
  const items = [
    'AI-assisted changes',
    'Guided visual workflow',
    'Project + deploy aware',
    'Protected publishing',
  ];

  return (
    <div className="value-strip">
      <div className="container">
        <div className="value-row">
          {items.map((label, i) => (
            <div className="value-item" key={i}>
              <span className="v-dot"></span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
