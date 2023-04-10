import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// eslint-disable-next-line import/no-anonymous-default-export
export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  debug: true,
});
