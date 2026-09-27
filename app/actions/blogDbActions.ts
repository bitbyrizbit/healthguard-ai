'use server'; 

import { revalidatePath } from 'next/cache'; 
import { prisma } from '@/app/lib/prisma'; 

export async function createAuthorWithPostAction(formData: FormData) { 
  const name = formData.get('name') as string; 
  const email = formData.get('email') as string; 
  const title = formData.get('title') as string; 
  const content = formData.get('content') as string; 
 
  if (!name || !email || !title || !content) { 
    throw new Error('All fields are required.'); 
  } 
 
  // Interactive ACID Transaction 
  await prisma.$transaction(async (tx) => { 
    // Step A: Upsert Author 
    const user = await tx.user.upsert({ 
      where: { email }, 
      update: { name }, 
      create: { name, email }, 
    }); 
 
    // Step B: Create Post associated with the resolved author ID 
    await tx.post.create({ 
      data: { 
        title, 
        content, 
        authorId: user.id, 
      }, 
    }); 
  }); 
 
  revalidatePath('/blog-db'); 
} 
 
export async function deletePostAction(postId: string) { 
  await prisma.post.delete({ 
    where: { id: postId }, 
  }); 
 
  revalidatePath('/blog-db'); 
}
