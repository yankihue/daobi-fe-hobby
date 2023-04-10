import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

// eslint-disable-next-line import/no-anonymous-default-export
export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0", // opt-in to Twitter OAuth 2.0
    }),
  ],
});
