"use client";

import styles from "./page.module.css";
import { useState, useEffect, FormEvent, useRef } from "react";

type User = {
  name: string;
  email: string;
};
export default function Home() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const signupFormRef = useRef<HTMLFormElement>(null);
  const loginFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleGetUser = async () => {
      await getUser();
    };
    try {
      handleGetUser();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getCsrfToken = async () => {
    const res = await fetch("http://localhost:3001/api/v1/csrf", {
      // sessionを使うリクエストに必要
      credentials: "include", // CSRFトークンをsessionに入れるために必要
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data.authenticity_token);
    setCsrfToken(data.authenticity_token);
  };

  const setSession = async () => {
    const res = await fetch("http://localhost:3001/api/v1/session", {
      credentials: "include", // CSRFトークンを渡すために必要
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken as string,
      },
    });
    const data = await res.json();
    console.log(data);
  };
  const getSession = async () => {
    const res = await fetch("http://localhost:3001/api/v1/session", {
      // sessionやcookieをセットするような処理なら必要だがGETメソッドなので基本不要
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data);
  };

  const getUser = async () => {
    const res = await fetch("http://localhost:3001/api/v1/user", {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setUser(data.user);
  };

  const signup = async (formData: Iterable<readonly [PropertyKey, any]>) => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/signup", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken as string,
        },
        body: JSON.stringify({ user: Object.fromEntries(formData) }),
      });
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (formData: Iterable<readonly [PropertyKey, any]>) => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/login", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken as string,
        },
        body: JSON.stringify({ session: Object.fromEntries(formData) }),
      });
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/logout", {
        credentials: "include",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken as string,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await signup(formData);
    if (signupFormRef.current) {
      signupFormRef.current.reset();
    }
  }

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await login(formData);
    if (loginFormRef.current) {
      loginFormRef.current.reset();
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h2 className={styles.title}>Session</h2>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={() => getCsrfToken()}>
            CSRFトークン発行
          </button>
          <button className={styles.button} onClick={() => setSession()}>
            セッションをセット
          </button>
          <button className={styles.button} onClick={() => getSession()}>
            セッションを取得
          </button>
        </div>
      </div>

      <form
        className={styles.container}
        onSubmit={handleSignup}
        ref={signupFormRef}
      >
        <h2 className={styles.title}>Sign Up</h2>
        <label className={styles.label}>Name:</label>
        <input
          className={styles.input}
          type="text"
          name="name"
          autoComplete="name"
        />
        <label className={styles.label}>Email:</label>
        <input
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
        />
        <label className={styles.label}>Password:</label>
        <input className={styles.input} type="password" name="password" />
        <label className={styles.label}>Confirm Password:</label>
        <input
          className={styles.input}
          type="password"
          name="password_confirmation"
        />
        <button className={styles.button} type="submit">
          Submit
        </button>
      </form>
      <form
        className={styles.container}
        onSubmit={handleLogin}
        ref={loginFormRef}
      >
        <h2 className={styles.title}>Login</h2>
        <label className={styles.label}>Email:</label>
        <input
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
        />
        <label className={styles.label}>Password:</label>
        <input className={styles.input} type="password" name="password" />
        <button className={styles.button} type="submit">
          Submit
        </button>
      </form>
      <div className={styles.container}>
        <h2 className={styles.title}>ユーザー情報</h2>
        {user ? (
          <div className={styles.userContainer}>
            <label className={styles.label}>Name:</label>
            <div className={styles.user}>{user.name}</div>
            <label className={styles.label}>Email:</label>
            <div className={styles.user}>{user.email}</div>
          </div>
        ) : (
          <div className={styles.notLogin}>ログインしてください</div>
        )}
        {user ? (
          <button className={styles.button} onClick={() => logout()}>
            Logout
          </button>
        ) : null}
      </div>
    </main>
  );
}
