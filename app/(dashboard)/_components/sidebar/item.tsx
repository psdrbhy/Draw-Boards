"use client"
// 每个组织组件
import Image from "next/image"
import {Hint} from "@/components/hint"
import {
    useOrganization,
    useOrganizationList
} from "@clerk/nextjs"

import {cn} from '@/lib/utils'

interface ItemProps {
    id: string,
    name: string,
    imageUrl:string
}
export const Item = ({
    id,
    name,
    imageUrl,
}: ItemProps) => {
    
    const { organization } = useOrganization();
    const { setActive } = useOrganizationList();
    // 看点击的组织是不是当前的组织
    const isActive = organization?.id == id
    const onClick = () => {
        if (!setActive) return;
    }
    return (
        <div className="aspect-square relative">
            <Hint
                label={name}
                side="right"
                align="start"
                sideOffset={18}

            >
                <Image
                fill
                alt={name}
                src={imageUrl}
                onClick={onClick}
                className={
                    cn("rounded-md cursor-pointer opacity-75 hover:opacity-100 transition",isActive && "opacity-100") //默认选择当前
                }
                />
            </Hint>

            
        </div>
    )
}