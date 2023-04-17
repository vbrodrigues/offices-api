import { MoonLoader } from "react-spinners";

const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center w-[100vw] h-[100vh]">
      <MoonLoader color="rgb(59 130 246)" />
    </div>
  );
};

export default LoadingPage;
