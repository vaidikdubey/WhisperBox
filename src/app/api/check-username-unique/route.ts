import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    //Used in legacy Next.js code, when next internall didn't handle other methods for the route
    // if (request.method !== "GET") {
    //     return Response.json(
    //         {
    //             success: false,
    //             message: "Method not allowed. Only GET method is allowed",
    //         },
    //         { status: 405 },
    //     );
    // }

    await dbConnect();

    //URL - localhost:3000/api/check-username-unique?username=vaidik?phone=android
    try {
        const { searchParams } = new URL(request.url);

        const queryParam = {
            username: searchParams.get("username"),
        };

        //validate username with zod
        const result = UsernameQuerySchema.safeParse(queryParam);

        console.log("Result of username validation with zod: ", result);

        if (!result.success) {
            const usernameErrors =
                result.error.format().username?._errors || [];

            return Response.json(
                {
                    succes: false,
                    message:
                        usernameErrors?.length > 0
                            ? usernameErrors.join(", ")
                            : "Invalid query parameters",
                },
                { status: 400 },
            );
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 400 },
            );
        }

        return Response.json(
            {
                success: true,
                message: "Username is available",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error checking username ", error);

        return Response.json(
            {
                success: false,
                message: "Error checking username",
            },
            {
                status: 500,
            },
        );
    }
}
