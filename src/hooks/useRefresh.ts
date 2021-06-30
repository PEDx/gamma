import { useCallback, useState } from "react";


const getNowString = () => new Date().getTime().toString()

export function useRefresh() {
  const [iv, setIv] = useState<string>(getNowString());
  const refresh = useCallback(() => {
    setIv(getNowString())
  }, [])
  return refresh
}
