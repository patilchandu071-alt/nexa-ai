export default function Stats() {
  return (
    <section className="py-20 px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <div className="bg-[#102433]/70 backdrop-blur-xl rounded-2xl p-6 text-center">
          <h2 className="text-4xl font-bold text-emerald-400">10+</h2>
          <p className="text-gray-300 mt-2">AI Tools</p>
        </div>

        <div className="bg-[#102433]/70 backdrop-blur-xl rounded-2xl p-6 text-center">
          <h2 className="text-4xl font-bold text-cyan-400">24/7</h2>
          <p className="text-gray-300 mt-2">AI Support</p>
        </div>

        <div className="bg-[#102433]/70 backdrop-blur-xl rounded-2xl p-6 text-center">
          <h2 className="text-4xl font-bold text-yellow-400">100%</h2>
          <p className="text-gray-300 mt-2">Responsive</p>
        </div>

        <div className="bg-[#102433]/70 backdrop-blur-xl rounded-2xl p-6 text-center">
          <h2 className="text-4xl font-bold text-pink-400">∞</h2>
          <p className="text-gray-300 mt-2">Possibilities</p>
        </div>

      </div>
    </section>
  );
}