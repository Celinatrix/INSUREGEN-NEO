"use client";

import { FormEvent, useState } from "react";

const childAgeOptions = [
  { value: "0-2", label: "0–2 tuổi" },
  { value: "3-5", label: "3–5 tuổi" },
  { value: "6-8", label: "6–8 tuổi" },
  { value: "khac", label: "Ngoài độ tuổi trên / muốn tìm hiểu thêm" },
];

type Status = "idle" | "submitting" | "success" | "error";

export function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      childAge: String(data.get("childAge") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(result.error ?? "Có lỗi xảy ra, vui lòng thử lại.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Không thể kết nối máy chủ, vui lòng thử lại sau.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-border bg-card p-8 text-center shadow-card"
      >
        <p className="text-lg font-semibold text-foreground">
          Cảm ơn bạn đã gửi yêu cầu!
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Chuyên viên tư vấn INSUREGEN NEO sẽ liên hệ với bạn trong vòng 24 giờ
          làm việc.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-card p-8 shadow-card"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Họ và tên
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus-visible:border-primary"
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Số điện thoại
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="0912345678"
            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus-visible:border-primary"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus-visible:border-primary"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="childAge" className="text-sm font-medium text-foreground">
            Độ tuổi của con
          </label>
          <select
            id="childAge"
            name="childAge"
            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus-visible:border-primary"
            defaultValue=""
          >
            <option value="" disabled>
              Chọn độ tuổi
            </option>
            {childAgeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="text-sm font-medium text-foreground">
            Nội dung cần tư vấn (không bắt buộc)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus-visible:border-primary"
          />
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-4 text-sm font-medium text-destructive">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-[#128a3e] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
      </button>

      <p className="mt-3 text-xs text-muted-foreground">
        Bằng việc gửi yêu cầu, bạn đồng ý để INSUREGEN NEO liên hệ tư vấn qua
        số điện thoại hoặc email đã cung cấp.
      </p>
    </form>
  );
}
