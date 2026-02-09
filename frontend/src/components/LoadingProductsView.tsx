import { Smartphone } from "lucide-react";

const LoadingProductsView = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <Smartphone size={40} />
      <p>Ładowanie produktów...</p>
    </div>
  );
};

export default LoadingProductsView;
