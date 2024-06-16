/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Ajoutez la règle pour le node-loader
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader',
      });
  
      // Retournez la configuration modifiée
      return config;
    },
  };

export default nextConfig;
