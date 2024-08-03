"use client"
// 侧边组织组件
import Link from 'next/link'
import Image from 'next/image'
import { Poppins } from 'next/font/google'
import { OrganizationSwitcher } from '@clerk/nextjs'
import { LayoutDashboard, Star } from 'lucide-react'
import {useSearchParams} from "next/navigation"

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// 导入谷歌字体
const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
})
export const OrgSidebar = () => {
    const searchParams = useSearchParams();
    const favorite = searchParams.get('favorite')
    return (
        <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
            <Link href="/">
                <div className='flex items-center gap-x-2' >
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        height={60}
                        width={60}
                    >
                    </Image>
                    <span className={cn("font-semibold text-2xl", font.className)}>
                        Board
                    </span>
                </div>
            </Link>
            {/* 给切换组件设置个性化 */}
            <OrganizationSwitcher
                hidePersonal
                appearance={{
                    elements: {
                        rootBox: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: '100%'
                        },
                        organizationSwitcherTrigger: {
                            padding: '6px',
                            width: '100%',
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            justifyContent: 'space-between',
                            backgroundColor:'white'
                        }
                    }
                }}
            />
            <div className='space-y-1 w-full'>
                <Button
                    variant={favorite? 'ghost' :'secondary' }
                    asChild
                    size="lg"
                    className='font-normal justify-start px-2 w-full'
                >
                    <Link href="/">
                        <LayoutDashboard className='h-4 w-4 mr-2' />
                        team boards
                    </Link>
                </Button>
                <Button
                    variant={favorite? 'secondary' :'ghost' }
                    asChild
                    size="lg"
                    className='font-normal justify-start px-2 w-full'
                >
                    <Link href={{
                        pathname: '/',
                        query:{favorite:true}
                    }}>
                        <Star className='h-4 w-4 mr-2' />
                        Favorite boards
                    </Link>
                </Button>
            </div>
        </div>
    )
}
