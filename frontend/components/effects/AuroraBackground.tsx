export default function AuroraBackground() {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute w-[500px] h-[500px] bg-emerald-500/20 blur-[140px] rounded-full top-0 left-0" />

        <div className="absolute w-[450px] h-[450px] bg-cyan-500/20 blur-[140px] rounded-full bottom-0 right-0" />

      </div>
    </>
  );
}