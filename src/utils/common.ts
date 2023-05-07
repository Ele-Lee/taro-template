export const isDev = process.env.NODE_ENV === 'development'


export function sleep(timestamp: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, timestamp);
  })
}
