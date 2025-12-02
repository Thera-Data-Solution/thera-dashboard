import { createFileRoute } from '@tanstack/react-router'
// import { Search } from 'lucide-react'
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar"
import FirstApp from '@/components/layout/desk'

export const Route = createFileRoute('/dashboard')({
  // loader: () => {
  //   throw redirect({ to: '/app/dashboard' })
  // },
  component: FirstApp,
})

// function RouteComponent() {
//   // return (
//   //   <div className="min-h-screen bg-[#383b53] flex flex-col font-sans relative overflow-hidden">
//   //     <div className="w-full px-4 py-3 flex justify-between items-center z-20">
//   //       <div className="flex-1 max-w-2xl mx-auto flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl border border-white/5 backdrop-blur-md shadow-lg">
//   //         <Search className="text-slate-300" size={18} />
//   //         <input
//   //           type="text"
//   //           placeholder="Search or type a command (Ctrl + G)"
//   //           className="bg-transparent border-none focus:outline-none text-white placeholder-slate-400 text-sm w-full"
//   //         />
//   //         <span className="hidden md:block text-xs text-slate-400 border border-white/20 rounded px-1.5 py-0.5">Ctrl+K</span>
//   //       </div>
//   //       <div className="absolute right-6 top-4 flex items-center gap-4">
//   //         <div className="flex items-center gap-2">
//   //           <span className="text-white/80 text-sm font-medium hidden md:block">Demo User</span>
//   //         </div>
//   //         <Avatar>
//   //           <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
//   //           <AvatarFallback>CN</AvatarFallback>
//   //         </Avatar>
//   //       </div>
//   //     </div>

//   //   </div>
//   // )
// }