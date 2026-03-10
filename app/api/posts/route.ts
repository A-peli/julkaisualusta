import { connectToDatabase } from "@/lib/db/mongodb";
import Post from "@/lib/models/Post";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const posts = await Post.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        status: "success",
        data: posts,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Virhe",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const post = new Post({
      title: body.title,
      content: body.content,
      author: body.author,
    });

    await post.save();

    return NextResponse.json(
      {
        status: "success",
        data: post,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Virhe",
      },
      { status: 500 },
    );
  }
}
