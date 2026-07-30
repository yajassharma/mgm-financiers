import { defineRailway, project, service } from "railway/iac";

export default defineRailway(() => {
  const mongo = service("MongoDB");

  const api = service("api", {
    rootDirectory: "api",
    build: "npm run build",
    start: "node dist/main.js",
  });

  const web = service("web", {
    rootDirectory: "app",
    build: "npx vite build",
    start: "npx serve -s dist -l $PORT",
  });

  const admin = service("admin", {
    rootDirectory: "admin",
    build: "npm run build",
    start: "npx serve -s build -l $PORT",
  });

  const consent = service("consent", {
    rootDirectory: "consent",
    build: "npm run build",
    start: "npx serve -s build -l $PORT",
  });

  return project("mgm-financiers", {
    resources: [mongo, api, web, admin, consent],
  });
});
