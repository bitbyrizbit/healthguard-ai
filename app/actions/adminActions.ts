'use server';

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleUserRoleAction(userId: string, currentRole: string) {
  const newRole = currentRole === 'admin' ? 'guest' : 'admin';
  
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath('/admin');
}
