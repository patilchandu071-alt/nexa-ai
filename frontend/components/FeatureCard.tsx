type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
  color: string;
};

export default function FeatureCard({
  icon,
  title,
  description,
  color,
}: FeatureCardProps) {
  return (
    <div className="bg-[#102433] rounded-3xl p-8 hover:scale-105 transition duration-300 shadow-lg">

      <h2 className={`text-3xl font-bold ${color}`}>
        {icon} {title}
      </h2>

      <p className="text-gray-300 mt-5 leading-7">
        {description}
      </p>

    </div>
  );
}