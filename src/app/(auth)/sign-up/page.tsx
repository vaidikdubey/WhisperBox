"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

//Shadcn components
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FieldGroup,
    Field,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";
import { Loader2 } from "lucide-react";

const Page = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 500);

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
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage(""); //Reset username msg state

                try {
                    const response = await axios.get(
                        `/api/check-username-unique?username=${username}`,
                    );

                    console.log(response.data.message);

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
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);

        try {
            const response = await axios.post<ApiResponse>(
                "/api/sign-up",
                data,
            );

            toast.success("Success", {
                description: response.data.message,
            });

            router.replace(`/verify/${username}`);
        } catch (error) {
            console.error("Error in signup of user", error);

            const axiosError = error as AxiosError<ApiResponse>;

            const errorMessage =
                axiosError.response?.data.message || "Error in signup";

            toast.error("Signup failed", {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join WhisperBox
                    </h1>
                </div>

                {/* Signup Form */}
                <Card className="w-full sm:max-w-md">
                    <CardHeader>
                        <CardTitle>Enter your details</CardTitle>
                        <CardDescription>
                            Sign Up to start your anonymous adventure
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            id="signup-form"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FieldGroup>
                                <Controller
                                    name="username"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="signup-form-username">
                                                Username
                                            </FieldLabel>
                                            <div className="flex justify-center items-center gap-2">
                                                <Input
                                                    {...field}
                                                    id="signup-form-username"
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    placeholder="johndoe"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        debounced(
                                                            e.target.value,
                                                        );
                                                    }}
                                                />
                                                {isCheckingUsername && (
                                                    <Loader2
                                                        className="animate-spin"
                                                        size={14}
                                                    />
                                                )}
                                            </div>
                                            <p
                                                className={`${usernameMessage.length > 0 ? "block" : "hidden"} text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}
                                            >
                                                {usernameMessage}
                                            </p>
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="signup-form-email">
                                                Email
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="signup-form-email"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="john.doe@example.com"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="password"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="signup-form-password">
                                                Password
                                            </FieldLabel>
                                            <Input
                                                type="password"
                                                {...field}
                                                id="signup-form-password"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Strong Password"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Field orientation="responsive">
                            <Button
                                type="submit"
                                form="signup-form"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        {" "}
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                        Please Wait{" "}
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                        </Field>

                        <div>
                            <p>
                                Already a member?{" "}
                                <Link
                                    href="/sign-in"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Page;
