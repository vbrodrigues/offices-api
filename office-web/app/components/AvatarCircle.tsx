"use client";
import { getInitials } from "@/app/lib/utils";
import * as Avatar from "@radix-ui/react-avatar";
import React from "react";

interface AvatarCircleProps {
  image?: string | null;
  name: string;
  size?: "small" | "large";
}

export default function AvatarCircle({
  image,
  name,
  size = "large",
}: AvatarCircleProps) {
  return (
    <Avatar.Root>
      <Avatar.Image
        src={image || ""}
        alt=""
        className={`rounded-full border border-blue-300 ${
          size === "small" ? "w-8 h-8" : "w-14 h-14"
        }`}
      />
      <Avatar.Fallback
        className={` rounded-full bg-blue-100 border border-blue-300 p-4 font-bold flex items-center justify-center text-center ${
          size === "small" ? "w-2 h-2" : "w-14 h-14"
        }`}
      >
        {getInitials(name)}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
