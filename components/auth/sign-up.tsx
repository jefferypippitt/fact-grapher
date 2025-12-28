"use client";

import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { validateImageFile } from "@/lib/image-validation";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageError(null);

      const validation = await validateImageFile(file);

      if (!validation.valid) {
        setImageError(validation.error || "Invalid image file");
        setImage(null);
        setImagePreview(null);
        e.target.value = "";
        return;
      }

      setImage(file);
      if (validation.base64) {
        setImagePreview(validation.base64);
      }
    }
  };

  return (
    <Card className="z-50 w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                placeholder="Max"
                required
                value={firstName}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                placeholder="Robinson"
                required
                value={lastName}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="m@example.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              autoComplete="new-password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              value={password}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Confirm Password</Label>
            <Input
              autoComplete="new-password"
              id="password_confirmation"
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm Password"
              type="password"
              value={passwordConfirmation}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Profile Image (optional)</Label>
            <div className="flex items-end gap-4">
              {imagePreview ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                  <Image
                    alt="Profile preview"
                    className="object-cover"
                    fill
                    src={imagePreview}
                  />
                </div>
              ) : null}
              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full items-center gap-2">
                  <Input
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="w-full"
                    id="image"
                    onChange={handleImageChange}
                    type="file"
                  />
                  {imagePreview ? (
                    <X
                      className="cursor-pointer"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                        setImageError(null);
                      }}
                    />
                  ) : null}
                </div>
                {imageError ? (
                  <p className="text-destructive text-xs">{imageError}</p>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    Max 5MB. Allowed: JPEG, PNG, WebP
                  </p>
                )}
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            disabled={loading}
            onClick={async () => {
              let imageBase64 = "";

              if (image) {
                const validation = await validateImageFile(image);
                if (!validation.valid) {
                  toast.error(validation.error || "Invalid image file");
                  return;
                }
                imageBase64 = validation.base64 || "";
              }

              await authClient.signUp.email({
                email,
                password,
                name: `${firstName} ${lastName}`,
                image: imageBase64,
                callbackURL: "/dashboard",
                fetchOptions: {
                  onResponse: () => {
                    setLoading(false);
                  },
                  onRequest: () => {
                    setLoading(true);
                  },
                  onError: (ctx) => {
                    // Handle Arcjet-specific errors
                    // Check error code first (more reliable than string matching)
                    const errorCode = ctx.error?.code;
                    const errorMessage =
                      ctx.error?.message ||
                      ctx.error?.error ||
                      "An error occurred";

                    if (errorCode === "INVALID_EMAIL") {
                      // Arcjet email validation error - show the specific message
                      toast.error(errorMessage);
                    } else if (
                      errorCode === "RATE_LIMIT" ||
                      errorMessage.includes("RATE_LIMIT") ||
                      errorMessage.includes("rate limit") ||
                      errorMessage.includes("too many")
                    ) {
                      toast.error(
                        "Too many signup attempts. Please try again later."
                      );
                    } else if (
                      errorCode === "FORBIDDEN" ||
                      errorMessage.includes("BOT_DETECTED") ||
                      errorMessage.includes("bot detected")
                    ) {
                      toast.error(
                        "Unable to complete signup. Please contact support if this persists."
                      );
                    } else {
                      toast.error(errorMessage);
                    }
                  },
                  onSuccess: () => {
                    router.push("/dashboard");
                  },
                },
              });
            }}
            type="submit"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Create an account"
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center border-t py-4">
          <p className="text-center text-neutral-500 text-xs">
            Secured by <span className="text-orange-400">better-auth.</span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
