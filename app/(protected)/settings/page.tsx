import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DeleteAccountButton } from "@/components/delete-account-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const userInitials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ??
    session?.user?.email?.[0].toUpperCase() ??
    "U";

  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] p-6">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      <Card className="max-w-3xl">
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 font-semibold text-lg">
                Profile Information
              </h3>
              <div className="flex items-center gap-4 pb-6">
                <Avatar className="size-16 rounded-lg">
                  <AvatarImage
                    alt={session?.user?.name ?? "User"}
                    src={session?.user?.image ?? undefined}
                  />
                  <AvatarFallback className="rounded-lg text-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <h4 className="font-semibold text-lg">
                    {session?.user?.name ?? "User"}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <span className="font-medium text-muted-foreground text-sm">
                    Name
                  </span>
                  <p className="font-medium">
                    {session?.user?.name ?? "Not set"}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-medium text-muted-foreground text-sm">
                    Email
                  </span>
                  <p className="font-medium">
                    {session?.user?.email ?? "Not set"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-4 font-semibold text-destructive text-lg">
                Danger Zone
              </h3>
              <p className="mb-4 text-muted-foreground text-sm">
                Irreversible and destructive actions. Please proceed with
                caution.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Delete Account</span>
                  <span className="text-muted-foreground text-sm">
                    Permanently delete your account and all associated data.
                  </span>
                </div>
                <DeleteAccountButton />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
