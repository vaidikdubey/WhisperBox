"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { useCompletion } from "@ai-sdk/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const specialChar = "||"; //For future updates

const initialMessage =
    "If you could instantly become an expert in any skill or topic overnight, what would you choose?||What’s a small, unexpected thing that made you smile recently?||If you could design a dream vacation with no budget limits, where would we be heading?";

const Page = () => {
    const params = useParams<{ username: string }>();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    });

    const messageContent = form.watch("content");

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

            form.reset({ ...form.getValues(), content: "" });
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

    const {
        complete,
        completion,
        isLoading: isSuggestLoading,
        error,
    } = useCompletion({
        api: "/api/suggest-messages",
        initialCompletion: initialMessage,
    });

    const fetchAISuggestionMessages = async () => {
        try {
            await complete(" ");
        } catch (error) {
            console.error("Error generating message ", error);
            toast.error("Error", {
                description: "Error generating messages",
            });
        }
    };

    const parseStringMessages = (message: string): string[] => {
        return message.split(specialChar);
    };

    const handleMessageClick = (message: string) => {
        form.setValue("content", message);
    };

    return (
        <div className="my-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
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
                                    Send Anonymous Message to
                                    <span className="font-bold">
                                        @{params.username}
                                    </span>
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
                    disabled={isSubmitting || !messageContent}
                    className="w-fit mx-auto my-5"
                >
                    Send It
                </Button>
            </div>

            <Button
                onClick={fetchAISuggestionMessages}
                disabled={isSuggestLoading}
            >
                {isSuggestLoading ? (
                    <>
                        {" "}
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Getting Suggestions{" "}
                    </>
                ) : (
                    "Suggest Messages"
                )}
            </Button>
            <Separator className="my-4" />

            {/* AI Generated Messages */}
            <div className="flex flex-col gap-2">
                <h3>Click on any message below to select it.</h3>
                <Card>
                    <CardHeader>
                        <h3 className="text-xl font-semibold">Messages</h3>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        {error ? (
                            <p className="text-red-500">{error.message}</p>
                        ) : (
                            parseStringMessages(completion).map(
                                (message, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="mb-2 whitespace-normal h-fit p-3"
                                        onClick={() =>
                                            handleMessageClick(message)
                                        }
                                    >
                                        {message}
                                    </Button>
                                ),
                            )
                        )}
                    </CardContent>
                </Card>
            </div>
            <Separator className="my-6" />
            <div className="text-center">
                <div className="mb-4">Start Your Anonymous Adventure Today</div>
                <Link href={"/sign-up"}>
                    <Button>Join WhisperBox</Button>
                </Link>
            </div>
        </div>
    );
};
export default Page;
