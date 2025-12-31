import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Polar } from "@polar-sh/sdk";

import {
  polar,
  checkout,
  portal,
  webhooks,
} from "@polar-sh/better-auth";

import { insertPurchase } from "@/actions/tokens";
import { db } from "@/db/drizzle";
import { betterAuthSchema } from "@/db/schema";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN as string,
  server: "production",
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: betterAuthSchema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
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
              productId: "0d8672dd-3e65-4040-9367-661502ad38a7",
              slug: "intro",
            },
            {
              productId: "57b45a66-8a91-48e8-90fe-c704d0e48859",
              slug: "bronze",
            },
            {
              productId: "7fcbe7f1-6b47-4efa-acd9-04c9e3c3b5f4",
              slug: "silver",
            },
            {
              productId: "06642b89-e72f-4613-afa7-ad8bee30761f",
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
            const externalCustomerId = order.data.customer?.externalId;

            if (!externalCustomerId) {
              console.error("No external customer ID found in order:", order);
              throw new Error("No external customer id found.");
            }

            const productId = order.data.productId;

            if (!productId) {
              console.error("No product ID found in order:", order);
              throw new Error("No product ID found in order.");
            }

            try {
              await insertPurchase(productId, externalCustomerId);
            } catch (error) {
              console.error("Error inserting purchase:", error);
              console.error("Failed productId:", productId);
              console.error("Failed externalCustomerId:", externalCustomerId);
              throw error;
            }
          },
        }),
      ],
    }),
  ],
});