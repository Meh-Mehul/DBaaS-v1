import net from 'net';

export function findAvailablePort(startPort: number, endPort: number): Promise<number> {
    return new Promise((resolve, reject) => {
        let port = startPort;
        const server = net.createServer();

        server.listen(port, () => {
            server.close(() => resolve(port));
        });

        server.on('error', () => {
            if (port < endPort) {
                port++;
                server.listen(port);
            } else {
                reject(new Error("No available ports found"));
            }
        });
    });
}