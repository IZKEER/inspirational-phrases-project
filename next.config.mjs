/** @type {import('next').NextConfig} */
const repo = 'inspirational-phrases-project'; // Replace with your actual repository name

const nextConfig = {
	reactStrictMode: true,
	output: 'export',
	basePath: process.env.NODE_ENV === 'production' ? `/${repo}` : '',
	assetPrefix: process.env.NODE_ENV === 'production' ? `/${repo}/` : '',
	sassOptions: {
		includePaths: ['node_modules'],
		modules: true,
	},
	images: {
		unoptimized: true, // Required for static export
	},
	trailingSlash: true, // Helps with GitHub Pages routing
};

export default nextConfig;
