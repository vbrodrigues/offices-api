interface LogoProps {
  big?: boolean;
}

export default function Logo({ big }: LogoProps) {
  return (
    <div className="flex">
      <h1
        className={`font-title font-bold text-blue-500 ${
          big ? "text-6xl" : "text-2xl"
        }`}
      >
        .off
      </h1>
      <h1 className={`font-title font-bold ${big ? "text-6xl" : "text-2xl"} `}>
        ice
      </h1>
    </div>
  );
}
