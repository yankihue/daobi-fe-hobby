import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

// eslint-disable-next-line import/no-anonymous-default-export
export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CONSUMER_KEY as string,
      clientSecret: process.env.TWITTER_CONSUMER_SECRET as string,
      version: "2.0", // opt-in to Twitter OAuth 2.0
    }),
  ],
});
