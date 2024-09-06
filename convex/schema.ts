import { PhoneNumber } from "@clerk/nextjs/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema( {
    users: defineTable({
      clerkId: v.string(),
      email: v.string(),
      firstName: v.string(),
      lastName: v.string(),
      username: v.string(),
      imageUrl: v.string(),
    }),
    accounts: defineTable({
      holderName: v.string(),
      userId: v.string(),
      accountNumber: v.string(),
      bankName: v.string(),
      phoneNumber: v.string(),
     firstName: v.string(),
     lastName: v.string(),
      email: v.string(),
      username: v.string(),
      accountRef: v.string()
    })
  },
  { schemaValidation: true }
);
