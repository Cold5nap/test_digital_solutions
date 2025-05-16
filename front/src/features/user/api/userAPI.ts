import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrderTypes, User } from "../model/userModel";


interface SearchParams {
	search: string;
	pageSize: number;
	page: number;
	order: OrderTypes;
}
interface UserPagination {
	total: number;
	users: User[];
	hasMore: boolean;
}

export const userApi = createApi({
	reducerPath: "userApi",
	baseQuery: fetchBaseQuery({ baseUrl: "/api/users" }),
	tagTypes: ["User", "Selected"],
	endpoints: (builder) => ({
		searchUsers: builder.query<UserPagination, SearchParams>({
			query: (params) => ({ url: ``, params }),
			providesTags: ["User"],
			// Важно для merge pagination
			serializeQueryArgs: ({ endpointName }) => {
				return endpointName;
			},
			merge: (currentCache, newItems) => {
				currentCache.users.push(...newItems.users);
				currentCache.total = newItems.total;
				currentCache.hasMore = newItems.hasMore;
			},
			forceRefetch({ currentArg, previousArg }) {
				return currentArg !== previousArg;
			},
		}),
		updateOrder: builder.mutation({
			query: (indexes: [number, number]) => ({
				url: "/order",
				method: "POST",
				body: indexes,
			}),
		}),
		getSelected: builder.query<string[], void>({
			query: () => "/selected",
			providesTags: ["Selected"],
		}),
		select: builder.mutation({
			query: (id: number) => ({
				url: "/select/" + id,
				method: "POST",
			}),
			invalidatesTags: ["Selected"],
		}),
		unselect: builder.mutation({
			query: (id: number) => ({
				url: "/unselect/" + id,
				method: "POST",
			}),
			invalidatesTags: ["Selected"],
		}),
	}),
});

export const {
	useLazySearchUsersQuery,
	useSearchUsersQuery,
	useUpdateOrderMutation,
	useGetSelectedQuery,
	useSelectMutation,
	useUnselectMutation,
} = userApi;
export default userApi;
