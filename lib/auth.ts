import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Polar } from "@polar-sh/sdk";

import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";

import { insertPurchase } from "@/actions/tokens";
import { db } from "@/db/drizzle";
import { betterAuthSchema } from "@/db/schema";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN as string,
  server: "sandbox",
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: betterAuthSchema,
  }),
  emailAndPassword: {
    enabled: true,
    // Note: Image validation is handled client-side in the sign-up component
    // Server-side validation can be added via custom API route if needed
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
 plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "50f840ad-1c0a-4abb-8299-da42bd0efcb4",
              slug: "intro",
            },
            {
              productId: "142aec44-e133-470a-a974-4bad5fd2e3b5",
              slug: "bronze",
            },
            {
              productId: "11214f6f-6306-479a-a39c-2889ad238791",
              slug: "silver",
            },
            {
              productId: "993054d0-69a6-4b76-a71f-a45489049be2",
              slug: "gold",
            },
          ],
          successUrl: "/success",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET as string,
          onOrderPaid: async (order) => {
            const externalCustomerId = order.data.customer.externalId;

            if (!externalCustomerId) {
              console.error("No external customer ID found.");
              throw new Error("No external customer id found.");
            }

            const productId = order.data.productId;

            if (!productId) {
              console.error("No product ID found in order.");
              throw new Error("No product ID found in order.");
            }

            console.log("Webhook received productId:", productId);
            console.log("Webhook received externalCustomerId:", externalCustomerId);

            // Insert purchase into purchases table (which getUserTokens() uses)
            // This will properly update the token count
            try {
              await insertPurchase(productId, externalCustomerId);
              console.log("Purchase inserted successfully for productId:", productId);
            } catch (error) {
              console.error("Error inserting purchase:", error);
              console.error("Failed productId:", productId);
              throw error;
            }
          },
        }),
      ],
    }),
  ],
});