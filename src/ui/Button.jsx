export default function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded ${className}`}
    >
      {children}
    </button>
  );
}
