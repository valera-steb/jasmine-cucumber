export type logFn = (key: string) => () => void;


export function buildLogger(log: string[]): logFn {
    return key => {
        return () => {
            log.push(key);
        }
    }
}