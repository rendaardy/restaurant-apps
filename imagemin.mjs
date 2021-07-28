import imagemin from 'imagemin';
import imageminMozJpeg from 'imagemin-mozjpeg';

imagemin(['src/public/images/heroes/*.jpg'], {
  destination: 'src/public/images/heroes/optimized',
  plugins: [
    imageminMozJpeg({ quality: 60 }),
  ],
}).then((files) => {
  console.log(files);
});
