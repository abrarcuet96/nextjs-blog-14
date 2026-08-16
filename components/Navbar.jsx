"use client";

import { getCurrentUser, logout } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["current-user"], null);
      router.push("/");
      router.refresh();
    },
  });

  return (
    <header className="border-b border-base-300 bg-base-100">
      <nav className="navbar mx-auto max-w-6xl px-4 sm:px-6">
        <div className="navbar-start">
          <Link href="/" className="text-xl font-bold text-primary">
            NextBlog
          </Link>
        </div>
        <div className="navbar-end gap-2">
          {data?.user ? (
            <>
              <Link href="/dashboard" className="btn btn-ghost btn-sm">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="btn btn-outline btn-sm"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm">
                Start writing
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
