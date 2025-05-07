import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		alias: {
			"@app": path.resolve(__dirname, "src", "app"),
			"@shared": path.resolve(__dirname, "src", "shared"),
			"@entities": path.resolve(__dirname, "src", "entities"),
			"@features": path.resolve(__dirname, "src", "features"),
			"@widgets": path.resolve(__dirname, "src", "widgets"),
			"@pages": path.resolve(__dirname, "src", "pages"),
			"@src": path.resolve(__dirname, "src"),
		},
	},
	// preview: {
	// 	port: 3000,
	// 	proxy: {
	// 		"^/api/.*": {
	// 			target: "http://localhost:8000",
	// 			changeOrigin: true,
	// 			secure: false,
	// 			followRedirects: true,
	// 		},
	// 	},
	// },

	server: {
		port: 3000,
		proxy: {
			"^/(api|uploads)/.*": {
				target: "http://localhost:3001",
				changeOrigin: true,
				secure: false,
				followRedirects: true,
			},
		},
	},
});
