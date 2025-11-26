import React from 'react';

const LoadingSkeleton = ({ type = 'default' }) => {
  if (type === 'wallet') {
    return (
      <div className="skeleton-wallet">
        <div className="skeleton-line skeleton-short"></div>
        <div className="skeleton-line skeleton-medium"></div>
      </div>
    );
  }

  if (type === 'button') {
    return <div className="skeleton-button"></div>;
  }

  if (type === 'transaction') {
    return (
      <div className="skeleton-transaction">
        <div className="skeleton-line skeleton-medium"></div>
        <div className="skeleton-line skeleton-short"></div>
        <div className="skeleton-line skeleton-long"></div>
      </div>
    );
  }

  return (
    <div className="skeleton-default">
      <div className="skeleton-line skeleton-long"></div>
      <div className="skeleton-line skeleton-medium"></div>
      <div className="skeleton-line skeleton-short"></div>
    </div>
  );
};

export default LoadingSkeleton;
