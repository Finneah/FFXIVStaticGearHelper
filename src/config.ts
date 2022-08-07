import dotenv from 'dotenv';
dotenv.config();

export const TOKEN = process.env.TOKEN || '';
export const APP_ID = process.env.APP_ID || '';
export const GUILD_ID = process.env.GUILD_ID || '';
