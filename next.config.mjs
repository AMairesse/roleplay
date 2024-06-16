/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export", // Outputs a Single-Page Application (SPA).
    distDir: "./dist", // Changes the build output directory to `./dist/`.
    webpack: (config, { isServer }) => {
        // Ajout de la règle pour gérer les fichiers .node
        config.module.rules.push({
            test: /\.node$/,
            use: "node-loader",
        });

        // Configuration additionnelle si nécessaire
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
                path: false,
                os: false,
            };
        }

        return config;
    },
};

export default nextConfig;
