import { useState } from "react";

const FloatingInput = ({ icon: Icon, label, type, value, onChange, name }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative w-full transition duration-300 ${
        isFocused ? "ring-2 ring-green-400 ring-offset-1 ring-offset-gray-900" : ""
      }`}
    >
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=" "
        className="peer w-full rounded-lg bg-gray-700 bg-opacity-50 pl-10 pr-3 py-3 text-white placeholder-transparent focus:outline-none"
        autoComplete="off"
      />

      <label
        htmlFor={name}
        className={`absolute left-10 top-3 text-gray-400 text-sm transition-all pointer-events-none 
          peer-placeholder-shown:top-3 
          peer-placeholder-shown:text-base 
          peer-placeholder-shown:text-gray-500 
          peer-focus:top-0 
          peer-focus:text-xs 
          ${isFocused ? "text-green-400" : "text-gray-400"}
        `}
      >
        {label}
      </label>

      {Icon && (
        <Icon
          className={`absolute left-3 top-3 w-5 h-5 pointer-events-none transition-colors ${
            isFocused ? "text-green-400" : "text-gray-400"
          }`}
        />
      )}
    </div>
  );
};

export default FloatingInput;
