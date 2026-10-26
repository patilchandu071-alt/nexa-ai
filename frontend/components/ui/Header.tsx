export default function Header() {
  return (
    <div className="flex items-center justify-between mb-10">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Welcome Back 👋
        </h1>

        <p className="text-gray-400 mt-2">
          What would you like to create today?
        </p>
      </div>

      <div className="flex items-center gap-4">

        <input
          type="text"
          placeholder="🔍 Search..."
          className="bg-[#102433] text-white px-5 py-3 rounded-xl outline-none w-72"
        />

        <button className="bg-[#102433] p-3 rounded-xl hover:bg-[#16354A] transition">
          🔔
        </button>

        <div className="bg-[#102433] px-5 py-3 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold">
            C
          </div>

          <div>
            <p className="font-semibold text-white">Chandu</p>
            <p className="text-xs text-gray-400">Developer</p>
          </div>
        </div>

      </div>

    </div>
  );
}