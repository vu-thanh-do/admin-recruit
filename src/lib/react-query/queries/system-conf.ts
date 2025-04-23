// import { API_ENDPOINTS } from '@/conf/apiUrl';
// import { useQuery } from '@tanstack/react-query';

// export const useGetAllGroupLanguage = () => {
//   return useQuery({
//     queryKey: ['all-group-language'],
//     queryFn: () =>
//       apiClientV2.get(API_ENDPOINTS.SYSTEM_CONFIG.LANGUAGES.GET_ALL_GROUP)
//   });
// };

// export const useGetByGroupLanguage = (group: string) => {
//   return useQuery({
//     queryKey: ['by-group-language', group],
//     queryFn: () =>
//       apiClientV2.get(API_ENDPOINTS.SYSTEM_CONFIG.LANGUAGES.GET_BY_GROUP(group))
//   });
// };

// export const useGetDetailLanguage = (id: string) => {
//   return useQuery({
//     queryKey: ['detail-language', id],
//     queryFn: () =>
//       apiClientV2.get(API_ENDPOINTS.SYSTEM_CONFIG.LANGUAGES.GET_DETAIL_ID(id))
//   });
// };
