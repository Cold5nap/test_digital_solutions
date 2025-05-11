import {
	OrderTypes,
	userApi,
	UserList,
	useSearchUsersQuery,
	useUpdateOrderMutation,
} from "@features/user";
import { Input, Space } from "antd";
import { SearchProps } from "antd/es/input";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const UserListPage = () => {
	const dispatch = useDispatch();

	const [userState, setUserState] = useState({
		search: "",
		page: 1,
		pageSize: 20,
		order: OrderTypes.asc,
	});
	const { data, isLoading,isFetching } = useSearchUsersQuery(userState);
	const [swapUsers, { isLoading: swapLoading }] = useUpdateOrderMutation();

	const nextPage = () => {
		setUserState((state) => ({ ...state, page: state.page + 1, pageSize: 20 }));
	};

	const searchHandler: SearchProps["onSearch"] = (search) => {
		dispatch(userApi.util.resetApiState());
		setUserState((state) => {
			return {
				...state,
				search,
				page: 1,
				pageSize: 20,
			};
		});
	};

	const onDrop = (from: number, to: number) => {
		swapUsers([from, to]);
		dispatch(userApi.util.resetApiState());
		setUserState((state) => {

			return {
				...state,
				page: 1,
				pageSize: state.page * state.pageSize,
			};
		});
	};

	return (
		<Space direction="vertical">
			<Space>
				<Input.Search
					loading={isLoading}
					allowClear
					onSearch={searchHandler}
					style={{ width: 200 }}
				/>
				Всего:{data?.total}
			</Space>
			<UserList
				search={userState.search}
				users={data?.users}
				onDrop={onDrop}
				onBottom={nextPage}
				loading={isFetching||isLoading || swapLoading}
			/>
		</Space>
	);
};
export default UserListPage;
