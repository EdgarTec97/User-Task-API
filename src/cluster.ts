import cluster from 'cluster';
import os from 'os';

/**
 * **AppClusterService**
 *
 * Utility that launches your Node/Nest application in **cluster mode**—
 * one worker per CPU core—providing simple, built‑in resiliency (automatic
 * respawn of crashed workers).
 */
export class AppClusterService {
  /**
   * Entry point—decides whether the current process is the **primary**
   * (master) or a **worker**.
   *
   * * In the **primary** process it forks a worker for every logical CPU
   *   core and attaches a listener that **respawns** any worker that exits.
   * * In a **worker** process it executes the provided `callback`, which
   *   should start the HTTP server and resolve with the port number the
   *   app is listening on.
   *
   * @param callback A `() => Promise<number>` that boots the application and
   *                 resolves to the TCP port in use.
   * @returns `void` (never resolves in the primary; void in workers).
   */
  static clusterize(callback: () => Promise<number>): void {
    if (cluster.isPrimary) {
      this.primary();
    } else {
      callback()
        .then((port) => console.log(`Application is running on port: ${port}`))
        .catch((error) => console.error('Error starting the application:', error));
    }
  }

  /**
   * Forks one worker per CPU core and ensures **high availability** by
   * respawning any worker that dies unexpectedly.
   *
   * @private
   */
  private static primary(): void {
    const n: number = os.cpus().length;
    console.log(`Master ${process.pid} -> forking ${n} workers`);

    for (let i = 0; i < n; i++) {
      cluster.fork();
    }

    cluster.on('exit', (w) => {
      console.log(`Worker ${w.process.pid} died → respawn`);
      cluster.fork();
    });
  }
}
