module.exports = {
  name: "documents",
  port: 3020,
  exposes: {
    "./routes": "./src/routes.tsx",
  },
  routes: {
    url: "http://localhost:3020/remoteEntry.js",
    scope: "documents",
    module: "./routes",
  },
  menus: [
    {
      text: "Documents",
      to: "/settings/documents",
      image: "/images/icons/erxes-09.svg",
      location: "settings",
      scope: "documents",
      action: "",
      permissions: [],
    },
  ],
};
