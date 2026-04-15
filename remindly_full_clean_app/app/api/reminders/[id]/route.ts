import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';


export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const reminder = await prisma.reminder.findUnique({
    where: { id: params.id }
  });

  if (!reminder) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.reminder.delete({
    where: { id: params.id }
  });

  return NextResponse.json({ ok: true });
}