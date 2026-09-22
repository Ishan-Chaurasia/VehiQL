import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "./ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft, CarFront, Heart, Layout } from "@hugeicons/core-free-icons";
import { checkUser } from "@/lib/checkUser";

const Header = async ({ isAdminPage = false }) => {
  const user = await checkUser();

  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={isAdminPage ? "/admin" : "/"} className="flex">
          <Image
            src={"/logo.png"}
            alt="Vehiql Logo"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
          />
          {isAdminPage && (
            <span className="text-xs font-extralight">admin</span>
          )}
        </Link>

        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <HugeiconsIcon icon={ArrowLeft} size={18} />
                <span className="hidden md:inline">Back to App</span>
              </Button>
            </Link>
          ) : (
            <Show when="signed-in">
              <Link href="/saved-cars">
                <Button>
                  <HugeiconsIcon icon={Heart} size={18} />
                  <span className="hidden md:inline">Saved Cars</span>
                </Button>
              </Link>

              {!isAdmin ? (
                <Link href="/reservations">
                  <Button variant="outline">
                    <HugeiconsIcon icon={CarFront} size={18} />
                    <span className="hidden md:inline">My Reservations</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/admin">
                  <Button variant="outline">
                    <HugeiconsIcon icon={Layout} size={18} />
                    <span className="hidden md:inline">Admin Portal</span>
                  </Button>
                </Link>
              )}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </Show>
          )}

          <Show when="signed-out">
            <SignInButton forceRedirectUrl="/">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </Show>
        </div>
      </nav>
    </header>
  );
};

export default Header;
