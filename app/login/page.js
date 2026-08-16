"use client";
import { login } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(["current-user"], data);
      router.push("/dashboard");
      router.refresh();
    },
  });

  function onSubmit(values) {
    mutation.mutate(values);
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
      <p className="text-sm text-gray-500 mb-6">Login to manage your posts.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email ? <p className="mt-1 text-sm text-error">{errors.email.message}</p> : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Your password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.password ? <p className="mt-1 text-sm text-error">{errors.password.message}</p> : null}
        </div>

        {mutation.error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
            {mutation.error.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-5 text-sm text-center text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-indigo-600 hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
