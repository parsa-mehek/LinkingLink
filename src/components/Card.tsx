import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className, footer, ...rest }) => {
  return (
    <div className={clsx('bg-white border rounded-lg shadow-sm p-6 flex flex-col gap-4', className)} {...rest}>
      {title && <h3 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">{title}</h3>}
      <div className="flex-1">{children}</div>
      {footer && <div className="pt-2 border-t text-sm text-slate-500">{footer}</div>}
    </div>
  );
};
