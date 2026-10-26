import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-72 h-screen bg-[#102433] text-white p-6">

      <h1 className="text-3xl font-bold text-emerald-400 mb-10">
        NEXA AI
      </h1>

      <div className="space-y-4">

        <Link href="/dashboard">
          <div className="p-4 rounded-xl hover:bg-[#1B3448] cursor-pointer">
            🏠 Dashboard
          </div>
        </Link>

        <Link href="/chat">
          <div className="p-4 rounded-xl hover:bg-[#1B3448] cursor-pointer">
            💬 AI Chat
          </div>
        </Link>

        <Link href="/code">
          <div className="p-4 rounded-xl hover:bg-[#1B3448] cursor-pointer">
            💻 Code Studio
          </div>
        </Link>

        <Link href="/pdf">
          <div className="p-4 rounded-xl hover:bg-[#1B3448] cursor-pointer">
            📄 PDF Studio
          </div>
        </Link>

        <Link href="/website">
          <div className="p-4 rounded-xl hover:bg-[#1B3448] cursor-pointer">
            🌐 Website Builder
          </div>
        </Link>

        <Link href="/settings">
          <div className="p-4 rounded-xl hover:bg-[#1B3448] cursor-pointer">
            ⚙ Settings
          </div>
        </Link>

      </div>

    </div>
  );
}