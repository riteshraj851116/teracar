import React from 'react';

const Title = ({ title, subTitle }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary font-editorial">{title}</h1>
      {subTitle && <p className="text-sm text-text-secondary mt-0.5">{subTitle}</p>}
    </div>
  );
};

export default Title;