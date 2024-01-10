const fs = require('fs');
const path = require('path');

const directoryPaths = ['./lib', './src']; // Add directory paths here
const outputPath = './lumi.js'; // Replace with your output file path
const exclusions = ['lit-core.min.js', 'sidebar.js','test.js', 'tmp.js', 'dark.js', 'app.js', 'controllers/index.js', 'users.js']; // Add exclusions here

let combinedContent = '';
function processDirectory(directoryPath) {
    fs.readdirSync(directoryPath, { withFileTypes: true }).forEach(dirent => {
        const fullPath = path.join(directoryPath, dirent.name);

        if (dirent.isDirectory()) {
            processDirectory(fullPath); // Recursive call for subdirectories
        } else if (path.extname(dirent.name) === '.js') {
            const relativePath = path.relative(directoryPath, fullPath);
            const isExcluded = exclusions.some(exclusion => exclusion === dirent.name || relativePath.includes(exclusion));

            if (!isExcluded) {
                const fileContent = fs.readFileSync(fullPath, 'utf8');
                combinedContent += `// File: ${fullPath}\n${fileContent}\n`;
            } else {
                console.log(`Excluded: ${fullPath}`);
            }
        }
    });
}

directoryPaths.forEach(processDirectory); // Process each directory path
fs.writeFileSync(outputPath, combinedContent);
console.log(`Combined file created at ${outputPath}`);