import React, { useEffect, useState } from "react";
import { User } from "../model/userModel"; // Импортируйте ваш интерфейс
import DragSortingTable from "@shared/ui/DragSortingTable";
import {
	useGetSelectedQuery,
	useUpdateOrderMutation,
	useSelectMutation,
	useUnselectMutation,
} from "../api/userAPI";
import { RowSelectMethod, TableRowSelection } from "antd/es/table/interface";
import { TableProps } from "antd";

interface UserKey extends User {
	key: string;
}
interface UserTableProps {
	users?: UserKey[];
	loading?: boolean;
}

const columns = [{ title: "Имя", dataIndex: "name" }];

const UserTable: React.FC<UserTableProps> = ({ users, loading }) => {
	const [updateOrder] = useUpdateOrderMutation();
	const [select] = useSelectMutation();
	const [unselect] = useUnselectMutation();
	const { data: selectedIds } = useGetSelectedQuery();
	const [selectedRowKeys, setSelectedRowKeys] = useState<
		React.Key[] | undefined
	>();

	const moveHandler = (from: number, to: number) => {
		if (users) updateOrder([users[from].position, users[to].position]);
	};

	useEffect(() => {
		setSelectedRowKeys(selectedIds);
	}, [selectedIds]);

	const onSelectChange: TableRowSelection["onChange"] = (
		newSelectedRowKeys: React.Key[]
	) => {
		setSelectedRowKeys(newSelectedRowKeys);
	};
	const onSelect: TableRowSelection["onSelect"] = (user, selected) => {
		if (selected) {
			select(user.id);
		} else {
			unselect(user.id);
		}
	};

	return (
		<DragSortingTable<UserKey>
			loading={loading}
			columns={columns}
			data={users}
			onMove={moveHandler}
			pagination={false}
			rowSelection={{
				hideSelectAll:true,
				selectedRowKeys,
				onChange: onSelectChange,
				onSelect,
			}}
		/>
	);
};

export default UserTable;
