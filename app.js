import fse from "fs-extra";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";
import imageminWebp from "imagemin-webp";
import imageminGifsicle from "imagemin-gifsicle";
import sharp from "sharp";

let inputFolder = "src";
let outputFolder = "opt";
//  ancho=FULL_HD
let targetWidth = 1920;

//  va a leer lo q hay en src, asi q lo hacemos asyn para q lea todo archivo sin bloquear el hilo
const processImg = async () => {
  try {
    //  leer cada archivo del dir
    const files = await fse.readdir(inputFolder);
    for (const file of files) {
      let inputPath = `${inputFolder}/${file}`;
      let outputPath = `${outputFolder}/${file}`;
      //  usamos sharp para optimizar el 'inputPath' el cual trabaja con promesas, primero redimensionamos y lo enviamos al pathSalida
      await sharp(inputPath).resize(targetWidth).toFile(outputPath);
      //  ahora usamos imageMin, le enviamos el destino y un objeto con elementos como destino, y los plugins que nos ayudaran a comprimirlo
      await imagemin([outputPath], {
        destination: outputFolder,
        plugins: [
          imageminJpegtran({ quality: 80 }), // Comprimir imagen JPG con calidad del 80%
          imageminPngquant(), // Comprimir imagen PNG
          imageminSvgo(), // Comprimir imagen SVG
          imageminWebp({ quality: 80 }), // Comprimir imagen WebP con calidad del 80%
          imageminGifsicle(), // Comprimir imagen GIF
        ],
      });
      console.log(`Se optimizó la imagen: ${file}`);
    }

    console.log("Se optimizaron todas las imágenes");
  } catch (err) {
    console.error(err);
  }
};

processImg();
