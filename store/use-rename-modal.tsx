import { create } from 'zustand'
// 全局重命名组件状态管理
const defaultValues = { id: '', title: '' }

interface IRenameModal {
  isOpen: boolean
  initialValues: typeof defaultValues
  onOpen: (id: string, title: string) => void
  onClose: () => void
}

export const useRenameModal = create<IRenameModal>((set) => ({
  isOpen: false,
  initialValues: defaultValues,
  onOpen: (id, title) => {
    set({ isOpen: true, initialValues: { id, title } })
  },
  onClose: () => set({ isOpen: false, initialValues: defaultValues }),
}))
