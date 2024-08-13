// 删除图层
import { useSelf, useMutation } from '@/liveblocks.config'

export const useDeleteLayers = () => {
  const selection = useSelf((me) => me.presence.selection)
  const deleteLayers = useMutation(
    ({ storage, setMyPresence }) => {
      const liveLayers = storage.get('layers')
      const liveLayerIds = storage.get('layerIds')
    // 清除storage该图层信息以及layerIds
      for (const layerId of selection) {
        liveLayers.delete(layerId)

        const index = liveLayerIds.indexOf(layerId)

        if (index !== -1) {
          liveLayerIds.delete(index)
        }
      }

      setMyPresence(
        {
          selection: [],
        },
        {
          addToHistory: true,
        }
      )
    },
    [selection]
  )
  return deleteLayers
}
