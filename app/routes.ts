import type { RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// File-based routing over app/routes/ using React Router's flat-routes
// convention (_index.tsx -> "/", examples._index.tsx -> "/examples",
// examples.$slug.tsx -> "/examples/:slug").
export default flatRoutes() satisfies RouteConfig;
