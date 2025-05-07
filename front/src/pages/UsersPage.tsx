import {
	OrderTypes,
	userApi,
	UserTable,
	useSearchUsersQuery,
} from "@features/user";
import { Flex, Input, Space } from "antd";
import { SearchProps } from "antd/es/input";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";

let t = 0;
const UserListPage = () => {
	const dispatch = useDispatch();

	const [userState, setUserState] = useState({
		search: "",
		page: 1,
		pageSize: 20,
		order: OrderTypes.asc,
	});
	const { data, isLoading, isFetching } =
		useSearchUsersQuery(userState);
	const loaderRef = useRef<HTMLDivElement>(null);
	const keyedUsers = useMemo(
		() => data?.users.map((user) => ({ ...user, key: user.id + "" })),
		[data]
	);
	// отслеживаем пересечение с блоком через IntersectionObserver
	useEffect(() => {
		if (data) {
			const observer = new IntersectionObserver(
				(entries) => {
					if (
						entries[0].isIntersecting &&
						data?.hasMore &&
						entries[0].time - t > 1000
					) {
						t = entries[0].time;
						console.log(data.users.length);
						setUserState((state) => ({ ...state, page: state.page + 1 }));
					}
				},
				{ threshold: 1 }
			);

			if (loaderRef.current) {
				observer.observe(loaderRef.current);
			}

			return () => observer.disconnect();
		}
	}, [data]);

	const searchHandler: SearchProps["onSearch"] = (search) => {
		dispatch(userApi.util.resetApiState());
		setUserState((state) => ({ ...state, search, page: 0 }));
	};

	return (
		<Flex vertical gap={10}>
			<Space>
				<Input.Search
					loading={isLoading}
					allowClear
					onSearch={searchHandler}
					style={{ width: 200 }}
				/>
				Всего:{data?.total}
			</Space>
			<UserTable users={keyedUsers} loading={isLoading} />
			{(isLoading || isFetching) && <div>Loading...</div>}

			<div ref={loaderRef} style={{ height: "20px" }} />

			{data?.hasMore==false && (
				<div style={{ textAlign: "center", padding: "20px" }}>
					Больше нечего загружать
				</div>
			)}
		</Flex>
	);
};
export default UserListPage;
