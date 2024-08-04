import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
// 解决一些css的合并重复和冲突
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
