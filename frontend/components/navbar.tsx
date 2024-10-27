"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import NextLink from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";

export const Navbar = () => {
  const { data: session } = useSession();

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
                src="/hestia.png"
              />
            </div>
            <p className="font-bold text-inherit text-xl">Hestia</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/2 gap-4" justify="end">
        {session && (
          <NavbarItem>
            <Button
              as={Link}
              className="text-sm font-medium"
              color="primary"
              href="/dashboard"
              variant="flat"
            >
              Dashboard
            </Button>
          </NavbarItem>
        )}
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
