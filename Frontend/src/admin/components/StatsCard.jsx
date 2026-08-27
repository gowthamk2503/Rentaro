import React from 'react';

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="stats-card">
      <div className="icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;