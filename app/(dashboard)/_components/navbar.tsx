"use client"
// nav栏组件
import { OrganizationSwitcher, UserButton,useOrganization } from "@clerk/nextjs"
import { SearchInput } from "./search"
import { InviteButton } from "./invite-button"
export const Navbar = () => {
    const {organization} = useOrganization()
    return (
        <div className="flex items-center gap-x-4 p-5">
            <div className="hidden lg:flex lg:flex-1">
                <SearchInput/>
            </div>
            <div className="block lg:hidden flex-1">
            <OrganizationSwitcher
                hidePersonal
                appearance={{
                    elements: {
                        rootBox: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: '100%',
                            maxWidth: "376px"
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
            </div>
            {/* 只有当至少有一个组织的时候才可以进行邀请 */}
            {organization && (
                <InviteButton/>
            )}
            
            <UserButton/>
        </div>
    )
}