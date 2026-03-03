import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('author', 'name email'),
      Post.countDocuments(),
    ]);

    return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[GET /api/posts]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!title || title.length < 3) {
      return NextResponse.json({ error: 'Title must be at least 3 characters' }, { status: 400 });
    }
    if (!content || content.length < 10) {
      return NextResponse.json({ error: 'Content must be at least 10 characters' }, { status: 400 });
    }

    await connectDB();
    const post = await Post.create({ title, content, author: auth.userId });
    await post.populate('author', 'name email');

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/posts]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
