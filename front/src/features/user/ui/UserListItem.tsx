import { FunctionComponent, useState } from "react";
import { User } from "../model/userModel";
import { useSelectMutation, useUnselectMutation } from "../api/userAPI";
import { Checkbox, Flex, Space } from "antd";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface UserListItemProps {
	user: User;
	style: React.CSSProperties;
	checked: boolean;
}

const UserListItem: FunctionComponent<UserListItemProps> = ({
	user,
	style,
	checked,
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: user.id });
	const combinedStyle = {
		...style,
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 100 : undefined,
		opacity: isDragging ? 0 : 1,
		backgroundColor: isDragging ? "gainsboro" : undefined,
		touchAction: isDragging ? "none" : "auto",
	};
	const [select] = useSelectMutation();
	const [unselect] = useUnselectMutation();
	const [selected, setSelected] = useState(checked);

	const selectHandler = (checkedH: boolean, id: number) => {
		setSelected(checkedH);
		if (checkedH) {
			select(id);
		} else {
			unselect(id);
		}
	};
	return (
		<Space
			className="user-list-item"
			ref={setNodeRef}
			style={combinedStyle}
			{...attributes}

		>
			<Checkbox
				style={{
					transform: "scale(1.3)",
					transformOrigin: "top left",
					marginRight: 8,
				}}
				checked={selected}
				onChange={(e) => selectHandler(e.target.checked, user.id)}
			/>
			<Flex {...listeners} style={{height:65,width:200}} vertical justify="center"> <div>{user.name}</div> </Flex>
		</Space>
	);
};

export default UserListItem;
