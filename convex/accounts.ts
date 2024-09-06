import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";



export const getAccountbyId = query({
    args: {userId: v.string()},
    handler: async (ctx, args) => {  
        const user = await ctx.db
        .query("accounts")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .unique();
  
      if (!user) {
     console.log('User not found')
      }
  
      return user;
    }

})

export const createAccount = mutation({
    args: {
        holderName: v.string(),
        userId: v.string(),
        accountNumber: v.string(),
        phoneNumber: v.string(),
        bankName: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        email: v.string(),
        username: v.string(),
        accountRef: v.string()
    },
    handler: async (ctx, args) => {
    const account =   await ctx.db.insert('accounts', {
            holderName: args.holderName,
            userId: args.userId,
            accountNumber: args.accountNumber,
            firstName: args.firstName,
            lastName: args.lastName,
            phoneNumber: args.phoneNumber,
            bankName: args.bankName,
            email: args.email,
            username: args.username,
            accountRef: args.accountRef
        })
        return account;
    }
})