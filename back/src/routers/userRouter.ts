import express from "express";
import { OrderTypes } from "../models/users";
import { Request } from "express";

const userRouter = express.Router();
// Хранилище данных в памяти
let users = Array.from({ length: 1000000 }, (_, i) => ({
	id: i + 1,
	name: `user ${i + 1}`,
	position: i + 1,
}));
let selectedIds = new Set();

// Получение элементов с пагинацией
interface SearchQuery {
	search: string;
	page: number;
	pageSize: number;
	order: OrderTypes;
}


// Изменим последовательность
userRouter.post("/order", (req, res) => {
	const [from, to] = req.body;
	const ordered = users.sort((a, b) => a.position - b.position);
	const indexFrom = ordered.findIndex((user) => user.position == from);
	const indexTo = ordered.findIndex((user) => user.position == to);
	ordered[indexFrom].position = to;
	if (indexFrom < indexTo) {
		for (let i = indexFrom + 1; i <= indexTo; i++) {
			ordered[i].position--;
		}
	} else {
		for (let i = indexFrom - 1; i >= indexTo; i--) {
			ordered[i].position++;
		}
	}
	users = [...ordered]
	res.json({ success: true });
});

userRouter.get("", async (req: Request<any, any, any, SearchQuery>, res) => {
	let {
		search = "",
		page = 1,
		pageSize = 20,
		order = OrderTypes.asc,
	} = req.query;
	pageSize = +pageSize;
	page = +page;
	const offset = (page - 1) * pageSize;
	let filteredUsers = [...users];

	// Поиск
	if (search) {
		const searchName = search.toLowerCase();
		filteredUsers = filteredUsers.filter((item) =>
			item.name.toLowerCase().includes(searchName)
		);
	}

	// Сортировка
	const orderedUsers = [...filteredUsers].sort((a, b) => {
		return order == OrderTypes.desc
			? b.position - a.position
			: a.position - b.position;
	});

	// Срез для пагинации
	const paginatedItems = orderedUsers.slice(offset, offset + pageSize);
	res.json({
		users: paginatedItems,
		total: filteredUsers.length,
		hasMore: offset + pageSize < filteredUsers.length,
	});
});

// Получаем id selected users
userRouter.get("/selected", (req, res) => {
	res.json(Array.from(selectedIds));
});

// Обновляем id selected users
userRouter.post("/select/:id", (req, res) => {
	selectedIds.add(req.params.id);
	res.json({ success: true });
});

// Обновляем id unselected users
userRouter.post("/unselect/:id", (req, res) => {
	selectedIds.delete(req.params.id);
	res.json({ success: true });
});

export default userRouter;
