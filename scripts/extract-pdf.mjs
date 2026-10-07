import fs from 'fs';
import { PDFParse } from 'pdf-parse';

const input = process.argv[2] ?? 'NEXO-API-Documentacion.pdf';
const output = process.argv[3] ?? 'NEXO-API-Documentacion.extracted.txt';

const buf = fs.readFileSync(input);
const parser = new PDFParse({ data: buf });
const data = await parser.getText();
await parser.destroy();
fs.writeFileSync(output, data.text, 'utf8');
console.log(`Wrote ${output} (${data.text.length} chars)`);
