import { useQuery } from "@tanstack/react-query";
import LayoutUser from "../../components/LayoutUser";
import { getBanner, getServices } from "../../apis/information";
import clsx from "clsx";
import EmblaCarousel from "../../components/Carousel";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ["dashboard", "services"],
    queryFn: async () => {
      const res = await getServices();
      if (res.status > 299) return;

      return res.data.data;
    },
  });

  const { data: banners, isLoading: loadingBanners } = useQuery({
    queryKey: ["dashboard", "banners"],
    queryFn: async () => {
      const res = await getBanner();
      if (res.status > 299) return;

      return res.data.data;
    },
  });

  return (
    <LayoutUser className="flex flex-col gap-10 py-5">
      {/* SERVICE SECTION */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-5">
        {loadingServices && <p>Loading services...</p>}
        {services?.map((service) => {
          return (
            <div
              className={clsx(
                "flex flex-col gap-2 text-center min-w-20 w-full items-center",
                "hover:bg-gray-100 duration-300 transition-all cursor-pointer p-2.5"
              )}
              key={service.service_code}
              onClick={() => navigate(`/payment?s=${service.service_code}`)}
            >
              <img
                src={service.service_icon}
                alt={service.service_name}
                width={60}
                className="aspect-square rounded-lg"
              />
              <p className="text-xs font-semibold text-gray-400 wrap-anywhere">
                {service.service_name}
              </p>
            </div>
          );
        })}
      </div>

      {/* BANNER SECTION */}
      <div className="flex gap-5 overflow-auto">
        {loadingBanners && <p>Loading banners...</p>}
        {banners && (
          <EmblaCarousel
            options={{
              loop: true,
              dragThreshold: 0,
              align: "start",
            }}
            autoplay
            slides={banners.map((banner) => {
              return (
                <div key={banner.banner_name}>
                  <img src={banner.banner_image} alt={banner.banner_name} />
                </div>
              );
            })}
          />
        )}
      </div>
    </LayoutUser>
  );
};

export default Dashboard;
