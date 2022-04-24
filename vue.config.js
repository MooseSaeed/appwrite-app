const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
});

module.exports = {
  devServer: {
    proxy: {
      "^/v1/users": {
        target: "http://localhost:3080",
        changeOrigin: true,
      },
    },
  },
};
