const SIZE = {
  sm: "p-2 text-sm xs:px-4",
  md: "p-3 text-md xs:px-8",
  lg: "p-3 text-md xs:px-8",
};

const Button = ({
  children,
  className,
  size = "md",
  disableHover = false,
  variant = "purple",
  ...rest
}) => {
  const sizeClass = SIZE[size];
  const variants = {
    purple: `text-white bg-indigo-600 ${
      !disableHover && "hover:bg-indigo-700"
    }`,
    green: `text-white bg-green-500 ${!disableHover && "hover:bg-green-600"}`,
    red: `text-white bg-red-600 ${!disableHover && "hover:bg-red-700"}`,
    lightPurple: `text-indigo-700 bg-indigo-100 ${
      !disableHover && "hover:bg-indigo-200"
    }`,
    white: `text-black bg-white`,
  };
  return (
    <button
      className={`${sizeClass} disabled:opacity-90 disabled:cursor-not-allowed border rounded-md font-medium ${className} ${
        disableHover && "cursor-default"
      } ${variants[variant]}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
