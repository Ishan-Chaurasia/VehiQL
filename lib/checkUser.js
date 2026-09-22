import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }

    const loggedUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });
    if (loggedUser) {
      return loggedUser;
    }

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        imageUrl: user.imageUrl,
        email: user.emailAddresses?.[0]?.emailAddress,
      },
    });
    return newUser;
  } catch (error) {
    if (
      error.digest === "DYNAMIC_SERVER_USAGE" ||
      error.message?.includes("Dynamic server usage")
    ) {
      throw error;
    }
    console.error("Error in checkUser:", error.message);
    return null;
  }
};
