import { connectToDatabase } from "@/lib/db/mongodb";
import Post from "@/lib/models/Post";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// Hae yksittäinen postaus
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    // Await params koska se on Promise
    const { id } = await params;

    // Tarkista, onko ID validia Mongoose ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Virheellinen ID",
        },
        { status: 400 },
      );
    }

    // Etsi postaus ID:n perusteella
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        {
          status: "error",
          message: "Postausta ei löytynyt",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        status: "success",
        data: post,
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

// Päivitä postaus
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    // Await params koska se on Promise
    const { id } = await params;

    // Tarkista, onko ID validia Mongoose ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Virheellinen ID",
        },
        { status: 400 },
      );
    }

    // Parse JSON body
    const body = await request.json();

    // Päivitä postaus ja palauta uusi versio
    const post = await Post.findByIdAndUpdate(
      id,
      {
        title: body.title,
        content: body.content,
        author: body.author,
      },
      { new: true, runValidators: true },
    );

    if (!post) {
      return NextResponse.json(
        {
          status: "error",
          message: "Postausta ei löytynyt",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        status: "success",
        data: post,
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

// Poista postaus
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    // Await params koska se on Promise
    const { id } = await params;

    // Tarkista, onko ID validia Mongoose ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Virheellinen ID",
        },
        { status: 400 },
      );
    }

    // Poista postaus
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return NextResponse.json(
        {
          status: "error",
          message: "Postausta ei löytynyt",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Postaus poistettu",
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
