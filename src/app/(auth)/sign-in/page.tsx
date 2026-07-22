"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

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

    const [isSubmitting, setIsSubmitting] = useState(false);

    //zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    //Not using traditional method here since sign-in uses nextauth
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        console.log("Result of signin: ", result);

        if (result?.error) {
            if (result.error == "CredentialsSignin") {
                toast.error("Error", {
                    description: "Invalid credentials",
                });
            } else {
                toast.error("Error", {
                    description: result.error,
                });
            }
        }

        setIsSubmitting(false);
        if (result?.url) {
            router.replace("/dashboard");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome Back
                    </h1>
                </div>

                {/* Signin Form */}
                <Card className="w-full sm:max-w-md tracking-tight">
                    <CardHeader>
                        <CardTitle>Enter WhisperBox</CardTitle>
                        <CardDescription>
                            Sign In to start your anonymous adventure
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            id="signin-form"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FieldGroup>
                                <Controller
                                    name="identifier"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="signin-form-email-username">
                                                Email/Username
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="signin-form-email-username"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Your Email/Username"
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
                                            <FieldLabel htmlFor="signin-form-password">
                                                Password
                                            </FieldLabel>
                                            <Input
                                                type="password"
                                                {...field}
                                                id="signin-form-password"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Your Password"
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
                                form="signin-form"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        {" "}
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                        Please Wait{" "}
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </Field>

                        <div>
                            <p>
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/sign-up"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Create Account
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
