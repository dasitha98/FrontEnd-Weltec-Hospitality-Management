import { apiBase } from './base';
import type { Food, ID } from '@/types/domain';

export const foodsApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    listFoods: b.query<Food[], void>({
      query: () => '/foods',
      providesTags: ['Foods'],
    }),
    getFood: b.query<Food, ID>({
      query: (id) => `/foods/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Foods', id }],
    }),
    createFood: b.mutation<Food, Omit<Food, 'id'>>({
      query: (body) => ({ url: '/foods', method: 'POST', body }),
      invalidatesTags: ['Foods'],
    }),
    updateFood: b.mutation<Food, Partial<Food> & { id: ID }>({
      query: ({ id, ...patch }) => ({ url: `/foods/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Foods', id }, 'Foods'],
    }),
    deleteFood: b.mutation<{ success: true }, ID>({
      query: (id) => ({ url: `/foods/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Foods', id }, 'Foods'],
    }),
  }),
});

export const {
  useListFoodsQuery,
  useGetFoodQuery,
  useCreateFoodMutation,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
} = foodsApi;
