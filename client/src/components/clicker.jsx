import { useNavigate } from "react-router-dom";

const Button = ({ onClick, children, className = "", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-2 rounded-full font-semibold transition-all
        ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary hover:bg-primary/90 text-white"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
