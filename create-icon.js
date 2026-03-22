const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create 256x256 icon for Windows
function createWindowsIcon() {
    const canvas = createCanvas(256, 256);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, 256, 256);
    
    // Border
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 216, 216);
    
    // Phi symbol
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 140px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Φ', 128, 128);
    
    // Save as PNG (will be used for icon)
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, 'assets', 'icon.png'), buffer);
    
    console.log('Created icon.png (256x256)');
}

createWindowsIcon();
