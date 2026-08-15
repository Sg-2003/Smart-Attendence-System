import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import { findUserByEmail, createUser } from "@/lib/userStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, role, department, semester } = parsed.data;

    // Check for existing user
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const user = await createUser({
      name,
      email,
      password,
      role: role as "STUDENT" | "FACULTY",
      department: department || undefined,
      semester: semester || undefined,
    });

    return NextResponse.json(
      { message: "Account created successfully.", user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
