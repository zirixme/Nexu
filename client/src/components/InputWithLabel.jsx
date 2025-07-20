export const InputWithLabel = ({ type, label, name, id, value, onChange }) => (
  <div className="relative w-full">
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-400 px-4 py-2 rounded w-full"
    />
    <label
      htmlFor={id}
      className="absolute -top-3 left-1 bg-gray-50 text-gray-400 select-none px-1"
    >
      {label}
    </label>
  </div>
);
