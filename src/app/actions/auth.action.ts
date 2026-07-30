"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

import { handleError } from "@/lib/utils";
import {
  signInFormSchema,
  signUpFormSchema,
  SignInFormData,
  SignUpFormData,
} from "@/lib/validations/auth";

export const signIn = async (formData: SignInFormData) => {
  const validation = signInFormSchema.safeParse(formData);

  if (!validation.success) {
    return { success: false, errors: validation.error };
  }

  const { email, password } = validation.data;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return { success: true };
  } catch (error) {
    handleError(error);
    return { success: false, error: "Failed to sign in" };
  }
};

export const signUp = async (formData: SignUpFormData) => {
  const validation = signUpFormSchema.safeParse(formData);

  if (!validation.success) {
    return { success: false, errors: validation.error };
  }

  const { name, email, password } = validation.data;

  try {
    await auth.api.signUpEmail({
      body: {
        name: name || email.split("@")[0],
        email,
        password,
      },
      headers: await headers(),
    });
    return { success: true };
  } catch (error) {
    handleError(error);
    return { success: false, error: "Failed to sign up" };
  }
};

export const signOut = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
};

export const sendEmail = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  } catch (error) {
    handleError(error);
    return false;
  }
};
