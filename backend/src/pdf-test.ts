import * as fs from 'fs';
import * as PdfPrinter from 'pdfmake';

const fonts = {
  Roboto: {
    normal: 'src/assets/fonts/Roboto-Regular.ttf',
    bold: 'src/assets/fonts/Roboto-Medium.ttf',
    italics: 'src/assets/fonts/Roboto-Italic.ttf',
    bolditalics: 'src/assets/fonts/Roboto-MediumItalic.ttf',
  },
};

const printer = new (PdfPrinter as any)(fonts);
const docDefinition = { content: ['Hello PDF!'] };
const pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('test-output.pdf'));
pdfDoc.end();
