"use client";

import type { Metadata } from "next";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthInput from "@/components/authInput/AuthInput";

export const metadata: Metadata = {
  title: "ورود و ثبت‌نام کاربر | بهمن سبز",
  description:
    "فرم ورود و ثبت‌نام کاربر آزمایشی با ذخیره اطلاعات در کوکی و هدایت به صفحه اصلی و داشبورد.",
};

type StoredUser = {
  name: string;
  username: string;
  password: string;
};

const COOKIE_NAME = "fakeUser";

// گرفتن کاربر از کوکی
function getUserFromCookie(): StoredUser | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));

  if (!match) return null;

  try {
    const value = decodeURIComponent(match.split("=")[1]);
    return JSON.parse(value) as StoredUser;
  } catch {
    return null;
  }
}

// ست‌کردن کاربر در کوکی
function setUserCookie(user: StoredUser) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(user)
  )}; expires=${expires.toUTCString()}; path=/`;
}


function Login() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [storedUser, setStoredUser] = useState<StoredUser | null>(null);

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [name, setName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getUserFromCookie();
    if (user) {
      setStoredUser(user);
      setMode("login");
      // ریست اینپوت‌های ورود بعد از تغییر مود
      setLoginUsername("");
      setLoginPassword("");
      setName("");
    } else {
      setMode("signup");
      // ریست اینپوت‌های ورود بعد از تغییر مود
      setLoginUsername("");
      setLoginPassword("");
      setName("");
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const user = getUserFromCookie();

    if (!user) {
      setError("کاربری در کوکی پیدا نشد. لطفاً ثبت‌نام کنید.");
      setMode("signup");
      return;
    }

    // یوزرنیم اشتباه
    if (user.username !== loginUsername) {
      setError("کاربری با این نام کاربری پیدا نشد. لطفاً ثبت‌نام کنید.");
      setMode("signup");
      return;
    }

    // یوزرنیم درست ولی رمز اشتباه
    if (user.password !== loginPassword) {
      setError("رمز عبور اشتباه است.");
      // در حالت ورود بماند
      setMode("login");
      return;
    }

    // موفق
    setMessage(`ورود موفقیت‌آمیز بود، خوش آمدید ${user.name}.`);
    setError(null);

    // ذخیره دوباره اطلاعات کاربری که با آن وارد شده‌ایم در کوکی
    setUserCookie(user);
    setStoredUser(user);

    // ریست اینپوت‌های ورود بعد از موفقیت
    setLoginUsername("");
    setLoginPassword("");

    // هدایت به صفحه خانه
    router.push("/");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!name || !signupUsername || !signupPassword) {
      setError("لطفاً تمام فیلدها را پر کنید.");
      return;
    }

    const newUser: StoredUser = {
      name,
      username: signupUsername,
      password: signupPassword,
    };

    setUserCookie(newUser);
    setStoredUser(newUser);
    setMessage("ثبت‌نام با موفقیت انجام شد. حالا می‌توانید وارد شوید.");
    setMode("login");

    // پاک کردن فیلدهای ثبت‌نام بعد از موفقیت
    setName("");
    setSignupUsername("");
    setSignupPassword("");
  };

  return (
    <div
      dir="rtl"
      className="font-baloo min-h-screen flex items-center justify-center font-sans px-4"
    >
      <div className="w-full relative max-w-sm bg-white rounded-xl p-6 shadow-lg shadow-slate-800/20">
        <h1 className="text-xl font-bold mb-2 text-center">بهمن سبز</h1>

        <p className="text-xs text-gray-500 text-center mb-5 leading-relaxed">
          {mode === "login"
            ? "اگر قبلاً ثبت‌نام کرده‌اید، نام‌کاربری و رمز خود را وارد کنید."
            : "برای ثبت‌نام، اطلاعات خود را وارد کنید ."}
        </p>

        <div className="flex justify-center mb-4 gap-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-full border text-xs transition-colors ${mode === "login"
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-900 border-gray-200 hover:bg-gray-50"
              }`}
          >
            ورود
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-full border text-xs transition-colors ${mode === "signup"
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-900 border-gray-200 hover:bg-gray-50"
              }`}
          >
            ثبت‌نام
          </button>
        </div>

        {message && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs">
            {error}
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            <AuthInput
              className="mb-3"
              label="نام کاربری"
              value={loginUsername}
              onChange={setLoginUsername}
              placeholder="نام کاربری ذخیره شده"
            />

            <AuthInput
              className="mb-4"
              label="رمز عبور"
              type="password"
              value={loginPassword}
              onChange={setLoginPassword}
              placeholder="رمز عبور"
            />

            {storedUser && (
              <p className="text-[11px] text-gray-500 mb-3">
                کاربر ذخیره‌شده در کوکی: {storedUser.username}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-full border-0 bg-slate-900 text-white text-sm font-semibold cursor-pointer hover:bg-slate-800 transition-colors"
            >
              ورود
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <AuthInput
              className="mb-3"
              label="نام"
              value={name}
              onChange={setName}
              placeholder="نام شما"
            />

            <AuthInput
              className="mb-3"
              label="نام کاربری"
              value={signupUsername}
              onChange={setSignupUsername}
              placeholder="نام کاربری دلخواه"
            />

            <AuthInput
              className="mb-4"
              label="رمز عبور"
              type="password"
              value={signupPassword}
              onChange={setSignupPassword}
              placeholder="رمز عبور"
            />

            <button
              type="submit"
              className="w-full py-2.5 rounded-full border-0 bg-slate-900 text-white text-sm font-semibold cursor-pointer hover:bg-slate-800 transition-colors"
            >
              ثبت‌نام
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;