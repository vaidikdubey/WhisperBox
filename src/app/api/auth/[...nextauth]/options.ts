import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials?.identifier },
                            { username: credentials?.identifier },
                        ],
                    }).lean();

                    if (!user) throw new Error("No user found with this email");

                    if (!user.isVerified)
                        throw new Error(
                            "Please verify your account before login",
                        );

                    const enteredPassword = credentials?.password || "";
                    const isPasswordCorrect = await bcrypt.compare(
                        enteredPassword,
                        user.password,
                    );

                    if (isPasswordCorrect)
                        return {
                            _id: user._id.toString(),
                            username: user.username,
                            email: user.email,
                            isVerified: user.isVerified,
                            isAcceptingMessage: user.isAcceptingMessage,
                        } as User;
                    else throw new Error("Invalid credentials");
                } catch (error) {
                    throw new Error(
                        error instanceof Error ? error.message : "Auth Failed",
                    );
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }

            return session;
        },
    },

    pages: {
        signIn: "/sign-in",
    },

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,
};
