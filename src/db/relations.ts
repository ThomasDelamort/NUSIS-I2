import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.ts";

// Add relations here once tables reference each other, e.g.
// defineRelations(schema, (r) => ({ users: { posts: r.many.posts() } }))
export const relations = defineRelations(schema);
