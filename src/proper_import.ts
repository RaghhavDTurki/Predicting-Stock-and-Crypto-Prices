import { join } from 'path';
import { createReadStream, createWriteStream, readdirSync } from 'fs';
import { createInterface } from 'readline';
import ioredis from 'ioredis';

const redisClient = new ioredis("redis://localhost:6379")
redisClient.on('error', err => {
    console.log('Error ' + err);
});

const CSV = {
    OPEN: 1,
    HIGH: 2,
    LOW: 3,
    CLOSE: 4,
    ADJ: 5,
    VOLUME: 6,
};

async function addSample(symbol: string, date: number, sample: string[]){

    await Promise.all(
        Object.keys(CSV).map(
            async (ts: string) => {
                const value = sample[CSV[ts]];

                if(!value || value == "null"){
                    return console.log(`Wrong value ${value} in sample ${sample}`);
                }

                let res: [] = await redisClient.send_command(
                  "TS.RANGE",
                  `{${symbol}:${ts}}`,
                  date,
                  date
                );
                if(res.length == 0){
                  // TS.ADD key timestamp value [RETENTION retentionTime] [ENCODING [COMPRESSED|UNCOMPRESSED]] [CHUNK_SIZE size] [ON_DUPLICATE policy] [LABELS label value..]
                  await redisClient.send_command(
                      "TS.ADD",
                      `{${symbol}:${ts}}`,
                      date,
                      value,
                      "LABELS",
                      "symbol",
                      symbol,
                      "type",
                      ts
                  )
                  .catch((err: Error) => console.log(err));
                }
            }
        )
    )
}


async function main(dir: string) {
    /**
     * Scan folder
     */
    const filenames = readdirSync(dir);
    for (const file of filenames) {
        const symbol = file.split(".");
      /**
       * Wrong filename
       */
      if (!symbol.length) {
        console.log(`Wrong filename: ${file}`);
        continue;
      }
  
      console.log(`Processing ${file}...`);
  
      /**
       * Add Symbol to Set
       */
    //   await redis
    //     .send_command("SADD", `symbols`, symbol[0])
    //     .catch((err) => console.log(err));
  
      /**
       * Stream reader
       */
      const rl = createInterface({
        input: createReadStream(join(dir, file)),
        crlfDelay: Infinity,
      });
      
      /**
       * Process line by line
       */
      for await (const line of rl) {
        const sample = line.split(",");
        const date = Date.parse(sample[0]);

        // console.log(sample);

        if (!date) {
          console.log(`Incorrect line or header: ${line}`);
          continue;
        }
  
        await addSample(symbol[0], date, sample);
      }
    }
  
    /**
     * Close Redis connection
     */
    await redisClient.quit();
  }
  
  /**
   * Start
   */
  main("./import");