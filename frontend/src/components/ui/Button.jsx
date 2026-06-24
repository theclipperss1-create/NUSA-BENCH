const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary | secondary | accent
  disabled = false,
  loading = false,
  className = '',
  ariaLabel,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-white text-zinc-900 hover:bg-zinc-50';
      case 'accent':
        return 'bg-amber-400 text-zinc-900 hover:bg-amber-500';
      case 'primary':
      default:
        return 'bg-orange-500 text-white hover:bg-orange-600';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center gap-2 px-6 py-2.5 
        font-heading font-extrabold text-sm rounded-md cursor-pointer 
        min-h-[44px] select-none outline-none border-[2.5px] border-zinc-950
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-[3px_3px_0px_0px_rgba(12,10,9,1)] 
        hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4.5px_4.5px_0px_0px_rgba(12,10,9,1)] 
        active:translate-x-0.5 active:translate-y-0.5 active:shadow-none 
        transition-all duration-150 uppercase tracking-wider
        ${getVariantClass()}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span>Proses...</span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
