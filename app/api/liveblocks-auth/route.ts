
import { auth, currentUser } from '@clerk/nextjs'
import { Liveblocks } from '@liveblocks/node'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const liveblocks = new Liveblocks({
  secret:
    'sk_dev__VOT3Mr3HE71Q3G6eQF_sdj8PbjogIuR2UlB_ymqbdsifvQPmbdRF4IZHscNZtCz',
})

export async function POST(request: Request) {
  const authorization = await auth()
  const user = await currentUser()

  if (!authorization || !user) {
    return new Response('Unauthorized', { status: 403 })
  }
  // 获取room（boardId）然后去查询该board的orgId
  const { room } = await request.json() 
  const board = await convex.query(api.board.get, { id: room })
  // 进行对比，组织不同直接返回403
  if (board?.orgId !== authorization.orgId) {
    return new Response('Unauthorized', { status: 403 })
  }
  // 创建访问会话
  const userInfo = {
    name: user.firstName || 'Teammate',
    picture: user.imageUrl,
  }

  const session = liveblocks.prepareSession(user.id, { userInfo })
  if (room) {
    session.allow(room, session.FULL_ACCESS)
  }
  const { status, body } = await session.authorize()
  return new Response(body, { status })
}
