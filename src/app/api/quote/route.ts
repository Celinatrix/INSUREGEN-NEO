import { NextResponse } from "next/server";

type QuoteRequestBody = {
  name?: string;
  phone?: string;
  email?: string;
  childAge?: string;
  message?: string;
};

const phonePattern = /^(0|\+84)\d{9,10}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: QuoteRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu gửi lên không hợp lệ." },
      { status: 400 }
    );
  }

  const { name, phone, email, childAge, message } = body;

  if (!name || name.trim().length < 2) {
    return NextResponse.json(
      { error: "Vui lòng nhập họ tên hợp lệ." },
      { status: 400 }
    );
  }

  if (!phone || !phonePattern.test(phone.trim())) {
    return NextResponse.json(
      { error: "Số điện thoại không hợp lệ." },
      { status: 400 }
    );
  }

  if (!email || !emailPattern.test(email.trim())) {
    return NextResponse.json(
      { error: "Email không hợp lệ." },
      { status: 400 }
    );
  }

  // TODO: kết nối CRM/email thật (ví dụ SendGrid, HubSpot) khi có thông tin thật.
  console.log("[quote-request]", {
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    childAge: childAge?.trim() || "Chưa xác định",
    message: message?.trim() || "",
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
