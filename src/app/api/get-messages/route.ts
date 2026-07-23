import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request): Promise<Response> {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            { status: 401 },
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id); //Convert string _id to ObjectID

    try {
        const user = await UserModel.aggregate([
            { $match: { id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } },
        ]);

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 },
            );
        }

        if (user.length === 0) {
            return Response.json(
                {
                    success: true,
                    message: "No messages found",
                },
                { status: 200 },
            );
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error getting user messages", error);
        return Response.json(
            {
                success: false,
                message: "Error getting user messages",
            },
            { status: 500 },
        );
    }
}
