import { z } from "zod";

export const signInSchema = z.object({
    identifier: z.string(), //Username/email or any unique identifier
    password: z.string(),
});
