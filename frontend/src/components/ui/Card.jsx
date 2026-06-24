export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white border-[3px] border-zinc-950 rounded-2xl text-zinc-950
        shadow-[5px_5px_0px_0px_rgba(12,10,9,1)]
        transition-all duration-150
        ${hoverEffect ? 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_rgba(12,10,9,1)]' : ''}
        ${onClick ? 'cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_3px_0px_0px_rgba(12,10,9,1)]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 pb-4 border-b-2 border-zinc-950 text-left ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-xl font-black font-heading text-zinc-950 tracking-tight uppercase ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-xs text-zinc-500 mt-1.5 font-bold uppercase tracking-wider ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 text-left ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 pt-4 border-t-2 border-zinc-950 flex items-center justify-end ${className}`} {...props}>
      {children}
    </div>
  );
};
