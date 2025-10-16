import { DarkmodeToggle } from "@/components/common/darkmode-toggle";
import { Coffee } from "lucide-react";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-6 p-6 bg-muted min-h-svh md:p-10">
      <div className="absolute top-4 right-4">
        <DarkmodeToggle />
      </div>
      <div className="flex flex-col w-full max-w-sm gap-6">
        <div className="flex items-center self-center gap-2 font-medium">
          <div className="flex items-center justify-center p-2 bg-teal-500 rounded-md">
            <Coffee className="text-white dark:text-black size-4" />
          </div>
          Rony Cafe
        </div>
        {children}
      </div>
    </div>
  );
}
