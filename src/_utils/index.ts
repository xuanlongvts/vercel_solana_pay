export const getStatus = (stream: { start_time: number; end_time: number }) => {
    if (stream.start_time > new Date().getTime() / 1000) {
        return 'Starting soon';
    }
    if (stream.end_time < new Date().getTime() / 1000) {
        return 'Completed';
    }
    return 'Streaming';
};
