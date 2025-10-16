"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/strores/auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  
  const [isClick, setIsClick] = useState(false);
  const router = useRouter();
  const handleClick = () => {
    setIsClick(true);
    router.push(`/${profile?.role === "admin" ? "admin" : "order"}`);
  };
  const profile = useAuthStore((state) => state.profile);
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-muted">
      <h4 className=" text-center font-semibold">Welcome {profile?.name}</h4>

      {isClick ? (
        <Button className=" text-white bg-teal-500" disabled>
          <Spinner />
        </Button>
      ) : (
        <Button
          className=" text-white bg-teal-500 hover:bg-teal-600"
          onClick={handleClick}
        >
          Access Dashboard
        </Button>
      )}
    </div>
  );
}
