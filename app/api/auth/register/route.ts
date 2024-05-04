import { createJWT, hashPassword } from "../../../../utils/functions";
import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const cookieStore = cookies();

    const isWithUsername =
      await sql`SELECT * FROM usersdb where username = ${body.username};`;
    const isWithEmail =
      await sql`SELECT * FROM usersdb where username = ${body.email};`;

    if (isWithUsername.rows.length > 0) {
      return NextResponse.json(
        { error: "user with this username already exists" },
        { status: 409 }
      );
    }

    if (isWithEmail.rows.length > 0) {
      return NextResponse.json(
        { error: "user with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(body.password);

    await sql`INSERT INTO usersdb (username, email, password) VALUES (${body.username}, ${body.email}, ${hashedPassword});`;

    const data =
      await sql`SELECT * FROM usersdb where username = ${body.username};`;
    const { id, username, email } = data.rows[0];

    const jwt = await createJWT({ username, email, id });

    cookieStore.set("token", jwt);

    return NextResponse.json(
      { msg: "Registered successfully!" },
      { status: 201 }
    );
  } catch (error) {
    return new Response("Failed to register", {
      status: 400,
    });
  }
};