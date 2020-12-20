const withPlugins = require("next-compose-plugins");

const nextConfig = {
  //next images
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

module.exports = withPlugins([], nextConfig);
