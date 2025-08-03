const express = require('express');
const multer = require('multer');
const path = require('path');
const route = express.Router();
const fs = require('fs').promises; // Use promises for async/await
const pdfParse = require('pdf-parse');

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            const uploadPath = 'uploads/';
            await fs.mkdir(uploadPath, { recursive: true }); // Ensure directory exists
            cb(null, uploadPath);
        } catch (err) {
            cb(err);
        }
    },

    filename: async function (req, file, cb) {
        try {
            const ext = path.extname(file.originalname);
            const fileName = file.originalname + '-' + Date.now() + ext; // Use fieldname for clarity`;
            cb(null, fileName);
        } catch (err) {
            cb(err);
        }
    }
});

const upload = multer({ storage });

route.post('/pdf', upload.single('file'), async (req, res) => {


    // console.log('File uploaded:', req.file);

    try {
        console.log('File path:', req.file.path);
        const pdfBuffer = await fs.readFile(req.file.path); // ✅ async read
        const parsed = await pdfParse(pdfBuffer);
        // console.log('PDF parsed successfully:', parsed);

        const pages = parsed.text; // split into pages
        console.log(`Extracted ${pages.substring(100, 1200).replaceAll("\t", " ")} pages from PDF.`);
        const startPage = 1; // X (1-based)
        const endPage = 1;   // Y (inclusive)

        // Convert to 0-based slice
        // console.log("pages length ", pages[0].replaceAll(/\t/g, ' ').replaceAll(/\n/g, '; '));
        const selectedPages = pages.slice(startPage - 1, endPage);

        
        selectedPages.forEach((page, i) => {

        });

        // pages.forEach((page, i) => {
        //     console.log(`--- Page ${i + 1} ---`);
        //     console.log(page);
        // });
        res.status(200).json({
            message: 'PDF extracted successfully',
            pages: selectedPages[0].replaceAll(/\t/g, ' ').replaceAll(/\n/g, '; ')
        });
    } catch (err) {
        console.error('PDF parsing error:', err);
    }

    res.status(200).json({ message: 'PDF extraction route is under construction.' });

});

module.exports = route;