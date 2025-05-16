import React, {
	FunctionComponent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { User } from "../model/userModel";
import { Space, Spin } from "antd";
import { FixedSizeList, ListOnScrollProps, FixedSizeList as VirtualList } from "react-window";
import "./userList.css";
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import UserListItem from "./UserListItem";
import { useGetSelectedQuery } from "../api/userAPI";

interface UserListProps {
	onDrop: (from: number, to: number) => void;
	onLoad: () => void;
	users?: User[];
	loading?: boolean;
	search: string;
	hasMore?: boolean;
}

const IS_MOBILE = window.matchMedia("(max-width: 760px)").matches;
const VISIBLE_LIST_HEIGHT = window.innerHeight - 220;
const ITEM_HEIGHT = 60;
const UserList: FunctionComponent<UserListProps> = ({
	users,
	onDrop,
	onLoad,
	search,
	loading,
}) => {
	const [activeId, setActiveId] = useState<string | null>(null);
	const listRef = useRef<FixedSizeList>(null);
	const [needLoad, setNeedLoad] = useState(true);
	const { data: selectedUsersIds } = useGetSelectedQuery();
	const KS = useSensor(KeyboardSensor);
	const PS = useSensor(PointerSensor);
	const TS = useSensor(TouchSensor, {
		activationConstraint: {
			distance: 10, // Увеличьте расстояние активации
			delay: 100, // Добавьте небольшую задержку
			tolerance: 5, // Добавьте допуск
		},
	});
	const s = IS_MOBILE ? [TS] : [KS, PS];
	const sensors = useSensors(...s);

	const [listUsers, setListUsers] = useState<User[]>([]);

	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollToItem(0, "start");
		}
	}, [search]);

	useEffect(() => {
		if (users) {
			setListUsers([...users]);
			setNeedLoad(true);
		}
	}, [users]);

	const dropHandler = useCallback(
		({ active, over }: DragEndEvent) => {
			if (over && active.id !== over.id) {
				let startIndex;
				let endIndex;
				setListUsers((items) => {
					startIndex = items.findIndex((item) => item.id === active.id);
					endIndex = items.findIndex((item) => item.id === over.id);

					return arrayMove(items, startIndex, endIndex);
				});
				if (startIndex != undefined && endIndex != undefined)
					onDrop(listUsers[startIndex].position, listUsers[endIndex].position);
				setActiveId(null);
			}
		},
		[onDrop, listUsers]
	);

	const Row = useCallback(
		({ index, style }: { index: number; style: React.CSSProperties }) => {
			const user = listUsers[index];
			const checked = !!selectedUsersIds?.includes(user.id + "");
			return (
				<UserListItem
					checked={checked}
					key={user.id}
					user={user}
					style={{...style,width:260}}
				/>
			);
		},
		[listUsers, selectedUsersIds]
	);
	const handleScroll = useCallback(
		({ scrollOffset, scrollUpdateWasRequested }: ListOnScrollProps) => {
			const innerListHeight = ITEM_HEIGHT * (listUsers.length || 20);
			const isNearBottom =
				innerListHeight - scrollOffset - VISIBLE_LIST_HEIGHT <= 300;
			if (isNearBottom && !scrollUpdateWasRequested && needLoad) {
				setNeedLoad(false);
				onLoad();
			}
		},
		[listUsers.length, needLoad, onLoad]
	);

	const handleDragStart = (event:DragStartEvent) => {
		setActiveId(event.active.id.toString());
	};
	const Overlay = useMemo(
		() => (
			<DragOverlay>
				{activeId && selectedUsersIds ? (
					<div style={{ background: "gainsboro" }}>
						<UserListItem
							user={listUsers.find((u) => u.id.toString() == activeId)!}
							style={{ width: 280, height: 60, background: "gainsboro" }}
							checked={!!selectedUsersIds?.includes(activeId + "")}
						/>
					</div>
				) : null}
			</DragOverlay>
		),
		[activeId, listUsers, selectedUsersIds]
	);
	return (
		<Space direction="vertical" style={{ minWidth: "300px" }}>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={dropHandler}
			>
				<SortableContext
					items={listUsers}
					strategy={verticalListSortingStrategy}
				>
					<VirtualList
						ref={listRef}
						height={VISIBLE_LIST_HEIGHT}
						itemCount={listUsers.length}
						itemSize={ITEM_HEIGHT}
						width="100%"
						// style={{ overflowX: "hidden" }}
						onScroll={handleScroll}
					>
						{Row}
					</VirtualList>
				</SortableContext>
				{Overlay}
			</DndContext>

			{loading && (
				<Space>
					<Spin /> Загрузка...
				</Space>
			)}
		</Space>
	);
};

export default UserList;
