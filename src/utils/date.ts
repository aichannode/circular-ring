export const getUTCTimestamp = (): string => {
    const date = Math.round((new Date().getTime() / 1000 ));
    return date.toString();
};