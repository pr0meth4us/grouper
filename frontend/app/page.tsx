"use client";

import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { SparklesIcon, ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

import { siteConfig } from "@/config/site";
import { title } from "@/components/primitives";
import { useAuth } from "@/app/hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <Card className="w-full max-w-lg p-8 from-transparent to-violet-50/20">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <div className="flex justify-center mb-6">
              <Image
                priority
                alt="hestia"
                className="object-cover"
                height={150}
                src="/hestia.png"
                width={150}
              />
            </div>
            <h1 className="inline-block text-center">
              <span className={title({ size: "lg" })}>One Click to </span>
              <span className={title({ color: "violet", size: "lg" })}>
                Group
              </span>
              <span className={title({ size: "lg" })}> &apos;Em All!</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Button
                  as={Link}
                  className="w-full sm:w-auto group"
                  color="primary"
                  endContent={
                    <SparklesIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  }
                  href={siteConfig.links.docs}
                  radius="full"
                  size="lg"
                  variant="shadow"
                >
                  Get Started
                </Button>
                <Button
                  as={Link}
                  className="w-full sm:w-auto group"
                  endContent={
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  }
                  href="/guest"
                  radius="full"
                  size="lg"
                  variant="bordered"
                >
                  Continue as Guest
                </Button>
              </>
            ) : (
              <Button
                as={Link}
                className="w-full sm:w-auto group"
                endContent={
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                }
                href="/dashboard"
                radius="full"
                size="lg"
                variant="bordered"
              >
                Do the Grouping Now
              </Button>
            )}
          </div>
          {!isAuthenticated && (
            <div className="flex justify-center">
              <p className="text-sm py-2 px-4 rounded-full bg-violet-50/30 font-medium">
                ✨ Don&apos;t worry - both options are free forever! ✨
              </p>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}
