type CardProps = {
  icon: string;
  title: string;
};

export default function Card({ icon, title }: CardProps) {
  return (
    <div className="bg-[#102433] rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-transparent hover:border-emerald-400">

      <div className="text-5xl mb-6">
        {icon}
      </div>

      <h2 className="text-2xl font-bold text-white">
        {title}
      </h2>

      <p className="text-gray-400 mt-3">
        Open Workspace →
      </p>

    </div>
  );
}