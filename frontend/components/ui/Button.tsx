type ButtonProps = {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function Button({
  text,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 py-4 font-semibold text-white shadow-lg"
    >
      {text}
    </button>
  );
}