import {
	OrderTypes,
	userApi,
	UserList,
	useSearchUsersQuery,
	useUpdateOrderMutation,
} from "@features/user";
import { Input, Space } from "antd";
import { InputRef, SearchProps } from "antd/es/input";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";

const UserListPage = () => {
	const inputRef = useRef<InputRef>(null);
	const dispatch = useDispatch();

	const [userState, setUserState] = useState({
		search: "",
		page: 1,
		pageSize: 20,
		order: OrderTypes.asc,
	});
	const { data, isLoading, isFetching } = useSearchUsersQuery(userState);
	const [swapUsers, { isLoading: swapLoading }] = useUpdateOrderMutation();

	const nextPage = () => {
		setUserState((state) => ({ ...state, page: state.page + 1, pageSize: 20 }));
	};

	const searchHandler: SearchProps["onSearch"] = (search) => {
		if (inputRef.current) {
			inputRef.current.blur();
		  }
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
			<Space direction="vertical">
				<div>Всего:{data?.total}</div>
				<Input.Search
					ref={inputRef}
					size="large"
					loading={isLoading}
					allowClear
					onSearch={searchHandler}
					style={{ width: 300 }}
				/>
			</Space>
			<UserList
				search={userState.search}
				users={data?.users}
				onDrop={onDrop}
				onLoad={nextPage}
				loading={isFetching || isLoading || swapLoading}
			/>
		</Space>
	);
};
export default UserListPage;
