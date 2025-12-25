const BrandHeader = ({ subtitle }: { subtitle: string }) => (
  <div className="flex flex-col items-center gap-10">
    <div className="flex gap-2 items-center">
      <img src="/assets/Logo.png" alt="Logo" height={25} />
      <p className="text-2xl font-semibold">SIMS POPB</p>
    </div>
    <p className="max-w-100 text-center w-full text-4xl font-semibold">
      {subtitle}
    </p>
  </div>
);

export default BrandHeader;
