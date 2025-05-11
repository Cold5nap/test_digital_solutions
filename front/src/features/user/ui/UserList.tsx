import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import VirtualList from "react-virtual-drag-list";
import { User } from "../model/userModel";
import { Checkbox, Space, Spin } from "antd";
import "./userList.css";
import {
	useGetSelectedQuery,
	useSelectMutation,
	useUnselectMutation,
} from "../api/userAPI";

interface UserListProps {
	onDrop: (from: number, to: number) => void;
	onBottom: () => void;
	users?: User[];
	loading?: boolean;
	search: string;
}
interface VirtualDragListRef {
	scrollToTop: () => void;
	// other methods you want to expose
}
interface LibListProps {
	list: User[];
	oldList: User[];
	newIndex: number;
	oldIndex: number;
}

const UserList: FunctionComponent<UserListProps> = ({
	users,
	onDrop,
	onBottom,
	loading,
	search,
}) => {
	const [listUsers, setListUsers] = useState<User[] | undefined>();
	const { data: selectedUsersIds } = useGetSelectedQuery();
	const [select] = useSelectMutation();
	const [unselect] = useUnselectMutation();
	const virtualRef = useRef(null);
	useEffect(() => {
		if (virtualRef) {
			const c = virtualRef.current as unknown as VirtualDragListRef;
			c.scrollToTop();
		}
	}, [virtualRef, search]);
	useEffect(() => {
		if (users) {
			setListUsers([...users]);
		}
	}, [users]);

	// const dropHandler = (e: LibListProps) => {
	const dropHandler = ({ list, newIndex, oldIndex, oldList }: LibListProps) => {
		onDrop(oldList[oldIndex].position, oldList[newIndex].position);
		setListUsers(list);
	};
	const selectHandler = (checked: boolean, id: number) => {
		if (checked) {
			select(id);
		} else {
			unselect(id);
		}
	};
	return (
		<Space direction="vertical">
			<VirtualList
				ref={virtualRef}
				className="virtual-list user-list"
				dataKey="id"
				dataSource={listUsers || []}
				handle=".handle"
				onDrop={dropHandler}
				onBottom={onBottom}
			>
				{(record) => (
					<div className="handle user-handle">
						<Space>
							<Checkbox
								defaultChecked={
									selectedUsersIds && selectedUsersIds.includes(record.id + "")
								}
								onChange={(e) => selectHandler(e.target.checked, record.id)}
							/>
							<div>{record.name}</div>
						</Space>
					</div>
				)}
			</VirtualList>
			{loading && (
				<Space>
					<Spin /> Загрузка...
				</Space>
			)}
		</Space>
	);
};

export default UserList;
