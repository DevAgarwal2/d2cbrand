import fs from 'fs';
import path from 'path';
// 🔴 CHANGED: specific path relative to where you are now
import { products } from './data/products.js'; 

// 🔴 CHANGED: specific path relative to where you are now
const outputDir = './content/products';

// Ensure directory exists
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

products.forEach(product => {
    // Create a filename based on the ID
    const fileName = `${product.id}.json`;
    const filePath = path.join(outputDir, fileName);
    
    // Write the file
    fs.writeFileSync(filePath, JSON.stringify(product, null, 2));
    console.log(`✅ Created: ${fileName}`);
});

console.log("Migration Complete!");