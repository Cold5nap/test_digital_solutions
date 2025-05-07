import React, { useEffect, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table } from "antd";
import type { TableProps } from "antd";
import { ColumnsType } from "antd/es/table";

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
	"data-row-key": string;
}

const Row: React.FC<Readonly<RowProps>> = (props) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: props["data-row-key"],
	});

	const style: React.CSSProperties = {
		...props.style,
		transform: CSS.Translate.toString(transform),
		transition,
		cursor: "move",
		...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
	};

	return (
		<tr
			{...props}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		/>
	);
};
interface BaseRecord {
	id: number;
	key: string;
}
interface DragSortingTableProps<T extends BaseRecord> extends TableProps<T> {
	data?: T[];
	columns: ColumnsType<T>;
	onMove: (from: number, to: number) => void;
}

export function DragSortingTable<T extends BaseRecord>({
	data,
	columns,
	onMove,
	...rest
}: DragSortingTableProps<T>) {
	const [dataSource, setDataSource] = useState(data);

	useEffect(() => {
		setDataSource(data);
		// console.log(data);
	}, [data]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 1,
			},
		})
	);

	const onDragEnd = ({ active, over }: DragEndEvent) => {
		if (active.id !== over?.id) {
			let activeIndex = -1;
			let overIndex = -1;
			setDataSource((prev) => {
				if (prev) {
					activeIndex = prev?.findIndex((i) => i.key === active.id);
					overIndex = prev?.findIndex((i) => i.key === over?.id);
					const newArr = arrayMove(prev, activeIndex, overIndex);
					return newArr;
				} else {
					return prev;
				}
			});
			onMove(activeIndex, overIndex);
		}
	};

	return (
		<DndContext
			sensors={sensors}
			modifiers={[restrictToVerticalAxis]}
			onDragEnd={onDragEnd}
		>
			<SortableContext
				items={dataSource?.map((i) => i.key) || []}
				strategy={verticalListSortingStrategy}
			>
				<Table<T>
					{...rest}
					components={{
						body: { row: Row },
					}}
					rowKey="key"
					columns={columns}
					dataSource={dataSource}
				/>
			</SortableContext>
		</DndContext>
	);
}

export default DragSortingTable;
