import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
// 解决合并重复和冲突
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
