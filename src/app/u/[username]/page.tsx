"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const Page = () => {
    const params = useParams<{ username: string }>();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsSubmitting(true);

        try {
            const response = await axios.post("/api/send-message", {
                username: params.username,
                content: data.content,
            });

            toast.success("Success", {
                description: response.data.message,
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            const errorMessage =
                axiosError.response?.data.message ||
                "Error sending anonymous message";

            toast.error("Error", {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4 text-center">
                Public Profile Link
            </h1>

            <div className="flex flex-col">
                <form
                    id="send-message-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <Controller
                        name="content"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="send-message-form-content">
                                    Send Anonymous Message to @{params.username}
                                </FieldLabel>
                                <Textarea
                                    {...field}
                                    id="send-message-form-content"
                                    placeholder="Write your anonymous message here"
                                    maxLength={400}
                                    minLength={10}
                                    className="bg-transparent"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </form>
                <Button
                    variant="secondary"
                    type="submit"
                    form="send-message-form"
                    disabled={isSubmitting}
                    className="w-fit mx-auto mt-5"
                >
                    Send It
                </Button>
            </div>

            <Button>Suggest Messages</Button>
            <Separator className="my-4" />

            {/* AI Generated Messages */}
            <div></div>
        </div>
    );
};
export default Page;
