/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    domains: ['ecomm-project-bucket.s3.amazonaws.com','ecomm-project-bucket.s3.ap-southeast-2.amazonaws.com','lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig;
