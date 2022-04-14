/**
 * @module async
 */

import { Make } from './make';
import { spawn, Worker } from 'threads';

const make = await spawn<Make>(new Worker('./parse.js'));

console.log(await make('const value = 1;'));
