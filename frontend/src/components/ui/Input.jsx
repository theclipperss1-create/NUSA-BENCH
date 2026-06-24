const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs uppercase text-zinc-500 font-bold text-left tracking-wider flex justify-between">
          <span>
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        </label>
      )}
      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-4 text-zinc-500 pointer-events-none z-10">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full bg-white border-[2.5px] rounded-md py-2.5 text-zinc-950 text-sm font-semibold outline-none 
            placeholder:text-zinc-400 shadow-[3px_3px_0px_0px_rgba(12,10,9,1)]
            transition-all duration-150 focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[4.5px_4.5px_0px_0px_rgba(12,10,9,1)]
            ${Icon ? 'pl-11 pr-4' : 'px-4'}
            ${error 
              ? 'border-red-500' 
              : 'border-zinc-950 focus:border-zinc-950'
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-650 font-bold text-left mt-1" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
