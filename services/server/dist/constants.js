"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomWordApi = exports.apiKey = exports.projectId = void 0;
exports.projectId = process.env.PROJECT_ID;
exports.apiKey = process.env.API_KEY;
exports.randomWordApi = process.env.RANDOM_WORD_API_URL ?? 'https://random-word-api.herokuapp.com/word?lang=en';
