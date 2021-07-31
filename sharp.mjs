import { resolve } from 'path';
import { mkdirSync, existsSync, readdirSync } from 'fs';
import sharp from 'sharp';

const target = resolve(process.cwd(), 'src', 'public', 'images', 'heros');
const destination = resolve(process.cwd(), 'src', 'public', 'images', 'heroes');

if (!existsSync(destination)) {
  mkdirSync(destination);
}

for (const image of readdirSync(target)) {
  sharp(`${target}/${image}`)
    .resize(800, 600)
    .toFile(resolve(`${destination}/${image.split('.').slice(0, -1).join('.')}-medium.jpg`));

  sharp(`${target}/${image}`)
    .resize(450, 400)
    .toFile(resolve(`${destination}/${image.split('.').slice(0, -1).join('.')}-small.jpg`));
}
