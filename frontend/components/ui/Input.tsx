type InputProps = {
  type: string;
  placeholder: string;
};

export default function Input({
  type,
  placeholder,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-xl bg-[#1B3448] text-white p-4 outline-none border border-transparent focus:border-emerald-400 transition"
    />
  );
}