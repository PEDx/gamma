import { useCallback, useState } from "react";


const getNowString = () => new Date().getTime().toString()

export function useForceRender() {
  const [iv, setIv] = useState<string>(getNowString());
  const render = useCallback(() => {
    setIv(getNowString())
  }, [])
  return render
}
