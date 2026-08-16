"use client";
import { signup } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function SignupPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const mutation = useMutation({
    mutationFn: signup,
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
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Create an account
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Start writing and sharing today.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="signup-name"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Use at least 2 characters" },
            })}
            placeholder="Your name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.name ? <p className="mt-1 text-sm text-error">{errors.name.message}</p> : null}
        </div>
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Use at least 6 characters" },
            })}
            placeholder="Min. 6 characters"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.password ? <p className="mt-1 text-sm text-error">{errors.password.message}</p> : null}
        </div>

        {mutation.error ? (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
            {mutation.error.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {mutation.isPending ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-5 text-sm text-center text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-indigo-600 hover:underline font-medium"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
