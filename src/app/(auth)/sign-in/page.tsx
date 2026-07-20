"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

const Page = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debouncedUsername = useDebounceValue(username, 300);

    //zod implementation

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        const checkUsernameUnqiue = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true);
                setUsernameMessage(""); //Reset username msg state

                try {
                    const response = await axios.get(
                        `/api/check-username-unique?username=${debouncedUsername}`,
                    );
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;

                    setUsernameMessage(
                        axiosError.response?.data.message ??
                            "Error checking username",
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnqiue();
    }, [debouncedUsername]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)

        try {
            const response = await axios.post<ApiResponse>("/api/sign-up", data)

            toast.success("Success", {
                description: response.data.message
            })

            router.replace(`/verify/${username}`);
        } catch (error) {
            console.error("Error in signup of user", error);

            const axiosError = error as AxiosError<ApiResponse>;

            const errorMessage = axiosError.response?.data.message || "Error in signup"

            toast.error("Signup failed", {
                description: errorMessage,
            })
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return <div>page</div>;
};

export default Page;
