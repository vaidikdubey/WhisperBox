"use client";

import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useState } from "react";

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

const VerifyAccount = () => {
    const router = useRouter();

    const params = useParams<{ username: string }>();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            });

            if (response.data.success) {
                toast.success("Succes", {
                    description: response.data.message,
                });

                setTimeout(() => router.replace("/sign-in"), 500);
            }
        } catch (error) {
            console.error("Error in signup of user", error);

            const axiosError = error as AxiosError<ApiResponse>;

            const errorMessage =
                axiosError.response?.data.message || "Error verifying code";

            toast.error("Error", {
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
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
                        Verify Your Account
                    </h1>
                </div>

                {/* Verify Form */}
                <Card className="w-full sm:max-w-md tracking-tight">
                    <CardHeader>
                        <CardTitle>Enter your details</CardTitle>
                        <CardDescription>
                            Sign Up to start your anonymous adventure
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            id="verify-code-form"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FieldGroup>
                                <Controller
                                    name="code"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="verify-code-form-code">
                                                Code
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="verify-code-form-email"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="123456"
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
                                form="verify-code-form"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        {" "}
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                        Please Wait{" "}
                                    </>
                                ) : (
                                    "Verify Account"
                                )}
                            </Button>
                        </Field>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
export default VerifyAccount;
