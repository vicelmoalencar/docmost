import * as z from "zod";
import { useForm, zodResolver } from "@mantine/form";
import useAuth from "@/features/auth/hooks/use-auth";
import { IPasswordReset } from "@/features/auth/types/auth.types";
import {
  Box,
  Button,
  Container,
  PasswordInput,
  Text,
  Title,
} from "@mantine/core";
import classes from "./auth.module.css";
import { useRedirectIfAuthenticated } from "@/features/auth/hooks/use-redirect-if-authenticated.ts";

const formSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Password must contain at least 8 characters" }),
});

interface PasswordResetFormProps {
  resetToken?: string;
}

export function PasswordResetForm({ resetToken }: PasswordResetFormProps) {
  const { passwordReset, isLoading } = useAuth();
  useRedirectIfAuthenticated();

  const form = useForm<IPasswordReset>({
    validate: zodResolver(formSchema),
    initialValues: {
      newPassword: "",
    },
  });

  async function onSubmit(data: IPasswordReset) {
    await passwordReset({
      token: resetToken,
      newPassword: data.newPassword
    })
  }

  return (
    <Container size={420} my={40} className={classes.container}>
      <Box p="xl" mt={200}>
        <Title order={2} ta="center" fw={500} mb="md">
          Password reset
        </Title>

        <form onSubmit={form.onSubmit(onSubmit)}>
          <PasswordInput
            label="New password"
            placeholder="Your new password"
            variant="filled"
            mt="md"
            {...form.getInputProps("newPassword")}
          />

          <Button type="submit" fullWidth mt="xl" loading={isLoading}>
            Set password
          </Button>
        </form>
      </Box>
    </Container>
  );
}
