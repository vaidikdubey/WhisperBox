"use client";

import { Message, User } from "@/model/User";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";

const UserDashboard = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false); //Anonymous msgs switch

    //Optimistic UI Update -> Removing message instantly and backend update will happen in bg
    const handleDeleteMessage = (messageId: Types.ObjectId) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessagesSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch("acceptMessages");

    //API call optimization using useCallback hook for memoization
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);

        try {
            const response = await axios.get("/api/accept-messages");
            setValue("acceptMessages", response.data.isAcceptingMessage);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            toast.error("Error", {
                description:
                    axiosError.response?.data.message ||
                    "Failed to fetch message settings",
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(true);
            setIsSwitchLoading(false);

            try {
                const response =
                    await axios.get<ApiResponse>("/api/get-messages");

                setMessages(response.data.messages || []);

                if (refresh) {
                    toast.success("Refreshed Messages", {
                        description: "Showing latest messages",
                    });
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;

                toast.error("Error", {
                    description:
                        axiosError.response?.data.message ||
                        "Failed to fetch new messages",
                });
            } finally {
                setIsLoading(false);
            }
        },
        [setIsLoading, setMessages],
    );

    useEffect(() => {
        if (!session || !session.user) return;

        fetchMessages();
        fetchAcceptMessage();
    }, [session, setValue, fetchAcceptMessage, fetchMessages]);

    //handle accept msg switch change
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>(
                "/api/accept-messages",
                {
                    acceptMessages: !acceptMessages,
                },
            );

            setValue("acceptMessages", !acceptMessages);
            toast.success("Success", {
                description: response.data.message,
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            toast.error("Error", {
                description:
                    axiosError.response?.data.message ||
                    "Failed to fetch message settings",
            });
        }
    };

    const { username } = session?.user as unknown as User;

    const [baseUrl, setBaseUrl] = useState("");

    useEffect(() => {
        if (window !== undefined) {
            setBaseUrl(`${window.location.protocol}//${window.location.host}`);
        }
    }, []);
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);

        toast.success("Success", {
            description: "Profile URL has been copied to clipboard.",
        });
    };

    if (!session || !session.user) {
        return <div>Please sign in to view this page</div>;
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">
                    Copy Your Unique Link
                </h2>{" "}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register("acceptMessages")}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? "On" : "Off"}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                            key={message._id.toString()}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
};
export default UserDashboard;
