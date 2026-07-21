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

//Shadcn components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"

import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group"

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

    return <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join WhisperBox</h1>
                <p className="mb-4">Sign Up to start your anonymous adventure</p>
            </div>

        {/* Signup Form */}
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Bug Report</CardTitle>
                <CardDescription>
                Help us improve by reporting bugs you encounter.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller
                    name="username"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                            Username
                        </FieldLabel>
                        <Input
                            {...field}
                            id="form-rhf-demo-title"
                            aria-invalid={fieldState.invalid}
                            placeholder="Login button not working on mobile"
                            autoComplete="off"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                        </Field>
                    )}
                    />
                    <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-description">
                            Description
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupTextarea
                            {...field}
                            id="form-rhf-demo-description"
                            placeholder="I'm having an issue with the login button on mobile."
                            rows={6}
                            className="min-h-24 resize-none"
                            aria-invalid={fieldState.invalid}
                            />
                            <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                                {field.value.length}/100 characters
                            </InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                        <FieldDescription>
                            Include steps to reproduce, expected behavior, and what
                            actually happened.
                        </FieldDescription>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                        </Field>
                    )}
                    />
                    <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-description">
                            Description
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupTextarea
                            {...field}
                            id="form-rhf-demo-description"
                            placeholder="I'm having an issue with the login button on mobile."
                            rows={6}
                            className="min-h-24 resize-none"
                            aria-invalid={fieldState.invalid}
                            />
                            <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                                {field.value.length}/100 characters
                            </InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                        <FieldDescription>
                            Include steps to reproduce, expected behavior, and what
                            actually happened.
                        </FieldDescription>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                        </Field>
                    )}
                    />
                </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button type="submit" form="form-rhf-demo">
                    Submit
                </Button>
                </Field>
            </CardFooter>
        </Card>
        </div>
    </div>;
};

export default Page;

// New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force


// LongPathsEnabled : 1
// PSPath           : Microsoft.PowerShell.Core\Registry::HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem
// PSParentPath     : Microsoft.PowerShell.Core\Registry::HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control
// PSChildName      : FileSystem
// PSDrive          : HKLM
// PSProvider       : Microsoft.PowerShell.Core\Registry
