import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "@widgets/layout/MainLayout";
import UsersPage from "@pages/UsersPage";

const App = () => {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route element={<MainLayout />}>
						<Route path="*" index element={<UsersPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</Provider>
	);
};

export default App;
