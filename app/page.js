import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // if logged in, redirect based on role to dashboard
  redirect("/dashboard");
}
