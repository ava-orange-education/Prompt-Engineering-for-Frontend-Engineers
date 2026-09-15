"use server";

import { db } from "@/lib/db";

export interface ProfileState {
  error: string | null;
  success: boolean;
}

// From the book, section "Core Architecture: JSX and Functional Components"
export async function addToCart(productId: number) {
  console.log(`add to cart: product ${productId}`);
}

// From the book, section "Hooks and the Actions API"
export async function updateProfile(prevState: ProfileState, formData: FormData) {
  const name = formData.get("displayName") as string;
  try {
    await db.user.update({ where: { id: "user-1" }, data: { displayName: name } });
    return { error: null, success: true };
  } catch {
    return { error: "Failed to update profile", success: false };
  }
}
