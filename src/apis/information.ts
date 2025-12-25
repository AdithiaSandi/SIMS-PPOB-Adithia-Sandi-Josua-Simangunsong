import { getMethod, type TApiResponse } from ".";

export interface BannerItem {
  banner_name: string;
  banner_image: string;
  description: string;
}

export const getBanner = async () => {
  return getMethod<TApiResponse<BannerItem[]>>("/banner");
};

export interface ServiceItem {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
}

export const getServices = async () => {
  return getMethod<TApiResponse<ServiceItem[]>>("/services");
};
