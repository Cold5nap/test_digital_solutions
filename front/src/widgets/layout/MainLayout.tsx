import { Tabs } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const items = [
	{ key: "", label: "Пользователи" },
].map((item) => ({ ...item, children: <Outlet /> }));

const MainLayout = () => {
	const navigate = useNavigate();
	const tabChangeHandler = (activeKey: string) => {
		navigate("/" + activeKey);
	};
	return (
			<div style={{ padding: 24 }}>
				<Tabs
					defaultActiveKey="1"
					items={items}
					onChange={tabChangeHandler}
				/>
			</div>
	);
};
export default MainLayout;
