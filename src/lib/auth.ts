import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

const mongoClient = new MongoClient(process.env.MONGODB_URI!);

const db = mongoClient.db("fix-mate");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
  client: mongoClient,
}),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: () => ({
        role: "customer",
      }),
    },
  },

 user: {
  additionalFields: {
    role: {
      type: "string",
      required: false,
      defaultValue: "customer",
      input: true,
    },
    phone: {
      type: "string",
      required: false,
      input: true,
    },
    area: {
      type: "string",
      required: false,
      input: true,
    },
    bio: {
      type: "string",
      required: false,
      input: true,
    },
  },
},

databaseHooks: {
  user: {
    create: {
      before: async (user) => {
        return {
          data: {
            ...user,
            role: user.role === "technician"
              ? "technician"
              : "customer",
          },
        };
      },
    },

    update: {
      before: async (data) => {
        if ("role" in data) {
          return false;
        }

        return { data };
      },
    },
  },
},

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL,

  plugins: [
  jwt({
    jwt: {
      definePayload: ({ user }) => {
        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    },
  }),
],
});