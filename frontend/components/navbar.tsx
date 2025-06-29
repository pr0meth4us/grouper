"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { LogInIcon, LogOutIcon } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/hooks/useAuth";
import { GithubIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const { isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  const isDashboard =
    typeof window !== "undefined" && window.location.pathname === "/dashboard";

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <NextUINavbar
      className="bg-background/60 backdrop-blur-lg border-b border-default-100"
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent className="basis-1/2" justify="start">
        <NavbarBrand as="li" className="gap-4 max-w-fit">
          <NextLink className="flex justify-start items-center gap-4" href="/">
            <div className="relative w-12 h-12 overflow-hidden rounded-xl">
              <Image
                fill
                priority
                alt="hestia"
                className="object-cover"
                src="/grouper.png"
              />
            </div>
            <p className="font-bold text-inherit text-xl">Grouper</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/2 gap-4" justify="end">
        <NavbarItem>
          {isAuthenticated ? (
            <div className="flex gap-2">
              {!isDashboard && (
                <Button
                  as={Link}
                  className="text-sm font-medium"
                  color="primary"
                  href="/dashboard"
                  variant="flat"
                  isDisabled={loading}
                >
                  Dashboard
                </Button>
              )}
              <Button
                className="text-sm font-medium"
                color="danger"
                startContent={<LogOutIcon className="h-4 w-4" />}
                variant="ghost"
                onClick={handleLogout}
                isDisabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </Button>
            </div>
          ) : (
            <Button
              as={Link}
              className="w-full sm:w-auto"
              endContent={<LogInIcon className="h-4 w-4" />}
              href="/login"
              radius="full"
              size="lg"
              variant="flat"
              isDisabled={loading}
            >
              Login
            </Button>
          )}
        </NavbarItem>
        <NavbarItem>
          <Link
            isExternal
            className="p-2 rounded-full hover:bg-default-100 transition-colors"
            href={siteConfig.links.github}
          >
            <GithubIcon className="text-default-500 w-6 h-6" />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="end">
        <Link
          isExternal
          className="p-2 rounded-full hover:bg-default-100 transition-colors"
          href={siteConfig.links.github}
        >
          <GithubIcon className="text-default-500 w-6 h-6" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className="pt-6">
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                className="w-full"
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};

export default Navbar;
