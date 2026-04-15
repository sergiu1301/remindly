import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { reminderSchema } from '@/lib/validators';

export async function GET() {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const reminders = await prisma.reminder.findMany({
    where: { userId: session.userId },
    orderBy: { dueDate: 'asc' }
  });

  return NextResponse.json({ reminders });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const json = await request.json();
    const parsed = reminderSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'INVALID_PAYLOAD' }, { status: 400 });
    }

    const dueDate = new Date(parsed.data.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(dueDate.getTime()) || dueDate < today) {
      return NextResponse.json({ error: 'DUE_DATE_CANNOT_BE_IN_THE_PAST' }, { status: 400 });
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId: session.userId,
        title: parsed.data.title,
        category: parsed.data.category,
        description: parsed.data.description || null,
        dueDate,
        notifyBefore: parsed.data.notifyBefore
      }
    });

    return NextResponse.json({ ok: true, reminder }, { status: 201 });
  } catch (error) {
    console.error('CREATE_REMINDER_ERROR', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}