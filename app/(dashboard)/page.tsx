"use client";
import { useOrganization } from "@clerk/nextjs";

import { EmptyOrg } from "./_components/empty-org";
import { BoardList } from "./_components/board-list";

// nextJs会对searchParams自动填充query信息
interface DashboardPageProps {
    searchParams: {
        search?: string,
        favorites?:string
    }
}
const DashboardPage = ({searchParams}:DashboardPageProps) => {
  const { organization } = useOrganization();
    return (
        <div className="flex-1 h-[calc(100%-80px)] p-6">
            {/* 先判断有无组织然后再判断有无画板 */}
            {!organization ? <EmptyOrg /> : <BoardList orgId={ organization.id} query={searchParams}/>}
    </div>
  );
};
export default DashboardPage;
