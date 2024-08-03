"use client"
// nav搜索组件
import qs from "query-string"
import { Search } from 'lucide-react'
import { useDebounceValue } from 'usehooks-ts'
import {useRouter} from 'next/navigation'
import { Input } from "@/components/ui/input"
import {
    ChangeEvent,
    useEffect,
    useState
} from 'react'

export const SearchInput = () => {
    const router = useRouter()
    // const [value, setValue] = useState("");
    // 防抖
    // const debouncedValue = useDebounceValue(value, 500)
    const [debouncedValue, setValue] = useDebounceValue('', 500)
    
    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }
    // 监控
    useEffect(() => {
        const url = qs.stringifyUrl({
            url: '/',
            query: {
                search: debouncedValue
            }
        }, {
            skipEmptyString: true, skipNull: true
        });

        router.push(url)
    },[debouncedValue,router])
    return (
        <div className="w-full relative">
            <Search
                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
            />
            <Input
                className="w-full max-w-[516px] pl-9"
                placeholder="搜索画板"
                onChange={handleChange}
                // value={value}
            />
        </div>
    )
}