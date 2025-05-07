
export interface User {
	id:number
	name:string
	selected: boolean;
	position: number;
}
export enum OrderTypes {
	asc = "asc",
	desc = "desc",
}