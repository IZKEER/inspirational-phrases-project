/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: 'export',
	// output: {
	// 	publicPath: "/",
	// },
	sassOptions: {
		includePaths: ['node_modules'],
		modules: true,
	},
};

export default nextConfig;
