import yahooFinance from 'yahoo-finance2';
import { HistoricalResult } from 'yahoo-finance2/dist/esm/src/modules/historical';
import axios from 'axios';
import { createWriteStream } from 'fs';

const query = ['TSLA', 'AAPL', ''];
const queryOptions = { period1: '2021-12-04', /* ... */ };
async function getData(query: string){
    console.log(query);
    let res: HistoricalResult | void = await yahooFinance.historical(query, queryOptions).catch(err => console.log(err));
    console.log(res);
}
// query.forEach(getData);

// AAPL
// https://query1.finance.yahoo.com/v7/finance/download/AAPL?period1=1632441600&period2=1638748800&interval=1d&events=history&includeAdjustedClose=true
async function getDataDaily(symbol:string, date1: Date, date2: Date) {
    const timestamp_Date1 = date1.getTime() / 1000;
    const timestamp_Date2 = date2.getTime() / 1000;

    let StockData = await axios.get(`https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${timestamp_Date1}&period2=${timestamp_Date2}&interval=1d&events=history&includeAdjustedClose=true`)
    let StockD = StockData.data;

}

const rw = createWriteStream('./import/AAPL.csv');
console.log(rw);

let d1 = new Date('2021-09-24');
let d2 = new Date('2021-12-7');
// getDataDaily('AAPL', d1, d2);