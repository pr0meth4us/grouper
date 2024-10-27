import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { SparklesIcon, ArrowRightIcon, LogInIcon } from "lucide-react"; // Add LogInIcon

import { siteConfig } from "@/config/site";
import { title } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <Card className="w-full max-w-lg p-8 from-transparent to-violet-50/20">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="inline-block text-center">
              <span className={title({ size: "lg" })}>One Click to </span>
              <span className={title({ color: "violet", size: "lg" })}>
                Group
              </span>
              <span className={title({ size: "lg" })}> &apos;Em All!</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              className="w-full sm:w-auto"
              color="primary"
              endContent={<SparklesIcon className="h-4 w-4" />}
              href={siteConfig.links.docs}
              radius="full"
              size="lg"
              variant="shadow"
            >
              Get Started
            </Button>

            <Button
              as={Link}
              className="w-full sm:w-auto"
              endContent={<ArrowRightIcon className="h-4 w-4" />}
              href={siteConfig.links.github}
              radius="full"
              size="lg"
              variant="bordered"
            >
              Try as Guest
            </Button>
          </div>

          {/* New Login Button */}
          <div className="flex justify-center mt-4">
            <Button
              as={Link}
              className="w-full sm:w-auto"
              endContent={<LogInIcon className="h-4 w-4" />}
              href="/login" // Assuming your login page is at /login
              radius="full"
              size="lg"
              variant="flat"
            >
              Login
            </Button>
          </div>

          <div className="flex justify-center">
            <p className="text-sm py-2 px-4 rounded-full bg-violet-50/30 font-medium">
              ✨ Don&apos;t worry - both options are free forever! ✨
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
