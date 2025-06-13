/** @type {import('next').NextConfig} */
const repo = 'inspirational-phrases-project';

const nextConfig = {
	reactStrictMode: true,
	
	// Only use static export for GitHub Pages, not Vercel
	// Vercel can handle API routes, so we don't want static export there
	...(process.env.NODE_ENV === 'production' && 
		!process.env.VERCEL && {
		output: 'export',
		basePath: `/${repo}`,
		assetPrefix: `/${repo}/`,
		trailingSlash: true,
	}),
	
	sassOptions: {
		includePaths: ['node_modules'],
		modules: true,
	},
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
