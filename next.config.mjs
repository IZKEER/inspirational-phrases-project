/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	sassOptions: {
		includePaths: ['node_modules'],
		modules: true,
	},
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
