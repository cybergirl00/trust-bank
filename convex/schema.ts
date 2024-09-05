import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema( {
    users: defineTable({
      clerkId: v.string(),
      email: v.string(),
      firstName: v.string(),
      lastName: v.string(),
      username: v.string(),
      imageUrl: v.string()
    }),
  },
  { schemaValidation: true }
);
