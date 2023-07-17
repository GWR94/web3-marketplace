const Button = ({
  children,
  className,
  disableHover = false,
  variant = "purple",
  ...rest
}) => {
  const variants = {
    purple: `text-white bg-indigo-600 ${
      !disableHover && "hover:bg-indigo-700"
    }`,
    red: `text-white bg-red-600 ${!disableHover && "hover:bg-red-700"}`,
    lightPurple: `text-indigo-700 bg-indigo-100 ${
      !disableHover && "hover:bg-indigo-200"
    }`,
  };
  return (
    <button
      className={`disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 border rounded-md text-base font-medium ${className} ${
        disableHover && "cursor-default"
      } ${variants[variant]}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;