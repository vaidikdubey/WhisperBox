"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner"
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter()

    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debouncedUsername = useDebounceValue(username, 300)

    // toast("Event has been created.")

    //zod implementation

  return (
    <div>page</div>
  )
}

export default Page