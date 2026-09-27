import { prisma } from '@/app/lib/prisma'; 
import { createAuthorWithPostAction, deletePostAction } from '@/app/actions/blogDbActions'; 
 
export default async function BlogDbPage() { 
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({ 
      include: { 
        author: true, 
      }, 
      orderBy: { 
        createdAt: 'desc', 
      }, 
    }); 
  } catch (error) {
    console.error("Prisma error:", error);
  }
 
  return ( 
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Internal Announcements</h1>
        <p className="text-slate-500 mt-1">Publish and manage updates using transactional database operations.</p>
      </div>
 
      {/* Transactional Form */} 
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-xl font-semibold text-slate-900">Create New Announcement</h2>
          <p className="text-sm text-slate-500 mt-1">Atomic transaction: Upserts the author and creates the post.</p>
        </div>
        <div className="p-6">
          <form action={createAuthorWithPostAction} className="space-y-6"> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Author Name</label>
                <input type="text" name="name" placeholder="Dr. Sarah Jenkins" required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900" /> 
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Author Email</label>
                <input type="email" name="email" placeholder="sarah.j@healthguard.com" required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900" /> 
              </div>
            </div> 
  
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Announcement Title</label>
              <input type="text" name="title" placeholder="Updated Protocol for Patient Intake" required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900" /> 
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Content</label>
              <textarea name="content" placeholder="Please note the following changes..." required rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900" /> 
            </div>
            
            <div className="flex justify-end pt-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors"> 
                Publish Announcement
              </button> 
            </div>
          </form> 
        </div>
      </div> 
 
      {/* Relational Data Rendering */} 
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Recent Announcements</h2>
        </div>
        <div className="p-0">
          <ul className="divide-y divide-slate-200">
            {posts.length === 0 ? ( 
              <li className="p-6 text-center text-slate-500">
                No records found. Submit the form above to publish an announcement.
              </li>
            ) : ( 
              posts.map((post) => ( 
                <li key={post.id} className="p-6 hover:bg-slate-50 flex flex-col md:flex-row justify-between gap-4"> 
                  <div className="space-y-2"> 
                    <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3> 
                    <p className="text-slate-600 whitespace-pre-wrap">{post.content}</p> 
                    <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"> 
                      Author: {post.author.name} ({post.author.email}) 
                    </div> 
                  </div> 
    
                  <div className="flex-shrink-0 flex items-start">
                    <form action={deletePostAction.bind(null, post.id)}> 
                      <button type="submit" className="text-red-600 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded-md font-medium text-sm transition-colors border border-transparent hover:border-red-100"> 
                        Delete 
                      </button> 
                    </form> 
                  </div>
                </li> 
              )) 
            )} 
          </ul>
        </div> 
      </div> 
    </div> 
  ); 
}
