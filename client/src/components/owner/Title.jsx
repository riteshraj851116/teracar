import React from 'react';

const Title = ({ title, subTitle }) => {
  return (
    <div className="flex flex-col items-start gap-1 mb-8 border-b border-[#e2e8f0] pb-5 w-full">
      <span className="text-[10px] font-mono tracking-[0.2em] text-[#2563eb] uppercase font-bold">
        TERACAR // OWNER COMMAND CENTER
      </span>
      <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#090d16] leading-none">
        {title}
      </h1>
      
      {subTitle && (
        <p className="text-xs font-mono uppercase tracking-wider text-[#64748b] max-w-2xl mt-1 font-semibold">
          {subTitle}
        </p>
      )}
    </div>
  );
};

export default Title;