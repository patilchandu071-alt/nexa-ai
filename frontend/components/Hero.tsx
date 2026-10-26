export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-28 px-6">

      <p className="text-emerald-400 font-semibold uppercase tracking-widest">
        ✨ AI Workspace of the Future
      </p>

      <h1 className="text-6xl md:text-7xl font-black mt-6 leading-tight">
        build.
        <br />
        Create.
        innovate.
      </h1>

      <p className="text-gray-300 text-xl max-w-3xl mt-8">
        The next generation AI workspace where developers,
        students, creators and businesses can build,
        learn and create faster than ever.
      </p>

      <div className="flex gap-5 mt-10">

        <button className="bg-emerald-500 hover:bg-emerald-600 px-8 py-4 rounded-xl font-bold">
          Launch Workspace
        </button>

        <button className="border border-gray-600 hover:border-emerald-500 px-8 py-4 rounded-xl">
          Explore Features
        </button>

      </div>

    </section>
  );
}