const SIZES = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

const Loader = ({ size = "md" }) => {
  return (
    <div className={`sk-circle ${SIZES[size]}`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div className={`sk-circle${i} sk-child`} key={`dot-${i}`} />
      ))}
    </div>
  );
};

export default Loader;
