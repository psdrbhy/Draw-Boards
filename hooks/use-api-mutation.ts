import { useState } from "react";
import { useMutation } from "convex/react";
// 封装表方法hooks
export const useApiMutation = (mutationFunction:any) => {
    const [pending, setPending] = useState(false)
    const apiMutation = useMutation(mutationFunction)
    
    const mutate = (payload: any) => {
        setPending(true)
        return apiMutation(payload)
            .finally(()=>setPending(false)) //无论结果是对还是错都设置pending为false
            .then((result) => {
                return result;
            })
            .catch((error) => {
                throw error
            })
    }
    return {
        mutate,
        pending,
    }
}
