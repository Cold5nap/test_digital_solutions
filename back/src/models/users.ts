// Хранилище данных в памяти
// export const users = Array.from({ length: 1000000 }, (_, i) => ({
// 	id: i + 1,
// 	name: `user ${i + 1}`,
// 	position: i + 1,
// }));

export enum OrderTypes {
	asc = "asc",
	desc = "desc",
}

export interface User {
	id: number;
	position: number;
	selected: boolean;
	name: string;
}
