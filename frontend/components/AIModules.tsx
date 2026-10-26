import {
  Bot,
  Code2,
  FileText,
  Globe,
  Palette,
  PenSquare,
} from "lucide-react";

const modules = [
  {
    icon: Bot,
    title: "AI Chat",
    desc: "Ask anything and get intelligent answers instantly.",
  },
  {
    icon: Code2,
    title: "Code Studio",
    desc: "Generate, explain and debug code.",
  },
  {
    icon: FileText,
    title: "PDF Studio",
    desc: "Summarize PDFs and ask questions.",
  },
  {
    icon: Globe,
    title: "Website Builder",
    desc: "Create modern websites with AI.",
  },
  {
    icon: Palette,
    title: "UI Designer",
    desc: "Generate beautiful UI ideas.",
  },
  {
    icon: PenSquare,
    title: "Writing Studio",
    desc: "Write blogs, emails and resumes.",
  },
];

export default function AIModules() {
  return (
    <section className="py-24 px-8">

      <h2 className="text-5xl font-bold text-center">
        Everything you need
      </h2>

      <p className="text-center text-gray-400 mt-4">
        Powerful AI tools in one beautiful workspace.
      </p>

      <div className="grid md:grid-cols-3 gap-8 mt-16">

        {modules.map((item, index) => (
          <div
            key={index}
            className="rounded-3xl bg-[#102433]/60 backdrop-blur-xl p-8 hover:scale-105 transition duration-300 border border-white/10"
          >
            <item.icon className="w-12 h-12 text-emerald-400" />

            <h3 className="text-2xl font-bold mt-6">
              {item.title}
            </h3>

            <p className="text-gray-400 mt-3">
              {item.desc}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}