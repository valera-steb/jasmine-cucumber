export function once(fn) {
    var r;
    return () => {
        if (fn) {
            r = fn();
            fn = null;
        }
        return r;
    }
}