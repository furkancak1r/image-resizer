// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const selectFilesBtn = document.getElementById('selectFilesBtn');
const frameWidthInput = document.getElementById('frameWidth');
const frameHeightInput = document.getElementById('frameHeight');
const bgColorInput = document.getElementById('bgColor');
const colorPicker = document.getElementById('colorPicker');
const processBtn = document.getElementById('processBtn');
const pendingCount = document.getElementById('pendingCount');
const imagesSection = document.getElementById('imagesSection');
const imagesGrid = document.getElementById('imagesGrid');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const processingCanvas = document.getElementById('processingCanvas');

// Store pending and processed images
let pendingFiles = [];
let processedImages = [];

// Load last used color from localStorage
const STORAGE_KEY = 'imageResizer_lastColor';
const savedColor = localStorage.getItem(STORAGE_KEY) || '#000000';
bgColorInput.value = savedColor;
colorPicker.value = savedColor;

// Save color to localStorage
function saveColorToStorage(color) {
    localStorage.setItem(STORAGE_KEY, color);
}

// Sync color inputs
bgColorInput.addEventListener('input', (e) => {
    const hex = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        colorPicker.value = hex;
        saveColorToStorage(hex);
    }
});

colorPicker.addEventListener('input', (e) => {
    bgColorInput.value = e.target.value;
    saveColorToStorage(e.target.value);
});

// Drag and drop handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) addPendingFiles(files);
});

// File input handler
fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length) addPendingFiles(files);
    fileInput.value = ''; // Reset for re-upload
});

// Button to open file dialog (only this triggers file input)
selectFilesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

// Pending section elements
const pendingSection = document.getElementById('pendingSection');
const pendingGrid = document.getElementById('pendingGrid');
const clearPendingBtn = document.getElementById('clearPendingBtn');

// Add files to pending list (NOT processed yet)
function addPendingFiles(files) {
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            pendingFiles.push({
                file: file,
                preview: e.target.result,
                id: Date.now() + Math.random()
            });
            renderPendingPreview();
        };
        reader.readAsDataURL(file);
    }
}

// Render pending files preview
function renderPendingPreview() {
    pendingGrid.innerHTML = '';
    
    if (pendingFiles.length > 0) {
        pendingSection.style.display = 'block';
        pendingCount.style.display = 'block';
        pendingCount.textContent = `📷 ${pendingFiles.length} dosya seçildi`;
        processBtn.disabled = false;
        
        pendingFiles.forEach((item, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'pending-thumb';
            thumb.innerHTML = `
                <img src="${item.preview}" alt="${item.file.name}">
                <button class="remove-pending" onclick="removePendingFile(${index})">×</button>
                <div class="pending-name">${item.file.name}</div>
            `;
            pendingGrid.appendChild(thumb);
        });
    } else {
        pendingSection.style.display = 'none';
        pendingCount.style.display = 'none';
        processBtn.disabled = true;
    }
}

// Remove single pending file
function removePendingFile(index) {
    pendingFiles.splice(index, 1);
    renderPendingPreview();
}

// Clear all pending files
clearPendingBtn.addEventListener('click', () => {
    pendingFiles = [];
    renderPendingPreview();
});

// Process button click - NOW we create the resized images
processBtn.addEventListener('click', async () => {
    if (pendingFiles.length === 0) return;

    processBtn.disabled = true;
    processBtn.textContent = '⏳ İşleniyor...';

    const frameWidth = parseInt(frameWidthInput.value) || 1280;
    const frameHeight = parseInt(frameHeightInput.value) || 800;
    const bgColor = bgColorInput.value || '#000000';

    for (const item of pendingFiles) {
        try {
            const result = await processImage(item.file, frameWidth, frameHeight, bgColor);
            processedImages.push(result);
            renderImageCard(result);
        } catch (error) {
            console.error(`Error processing ${item.file.name}:`, error);
        }
    }

    // Clear pending files after processing
    pendingFiles = [];
    renderPendingPreview();
    updateUI();
    
    processBtn.textContent = '🖼️ Oluştur';
});

// Process single image
function processImage(file, frameWidth, frameHeight, bgColor) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.onload = () => {
                const ctx = processingCanvas.getContext('2d');
                
                // Set canvas to frame dimensions
                processingCanvas.width = frameWidth;
                processingCanvas.height = frameHeight;

                // Fill background with chosen color
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, frameWidth, frameHeight);

                // Calculate scale to fit image inside frame (contain mode)
                const scaleX = frameWidth / img.naturalWidth;
                const scaleY = frameHeight / img.naturalHeight;
                const scale = Math.min(scaleX, scaleY);
                
                // Calculate new dimensions (scaled to fit)
                const newWidth = img.naturalWidth * scale;
                const newHeight = img.naturalHeight * scale;
                
                // Calculate position to center the scaled image
                const x = (frameWidth - newWidth) / 2;
                const y = (frameHeight - newHeight) / 2;

                // Draw scaled image centered
                ctx.drawImage(img, x, y, newWidth, newHeight);

                // Get processed image data
                const dataUrl = processingCanvas.toDataURL('image/png');
                
                // Generate new filename
                const originalName = file.name.replace(/\.[^/.]+$/, '');
                const newName = `${originalName}_resized.png`;

                resolve({
                    id: Date.now() + Math.random(),
                    originalName: file.name,
                    newName: newName,
                    originalWidth: img.width,
                    originalHeight: img.height,
                    frameWidth: frameWidth,
                    frameHeight: frameHeight,
                    bgColor: bgColor,
                    dataUrl: dataUrl,
                    previewUrl: e.target.result
                });
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

// Render image card in grid
function renderImageCard(imageData) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.dataset.id = imageData.id;

    card.innerHTML = `
        <div class="image-preview" style="background-color: ${imageData.bgColor}">
            <img src="${imageData.dataUrl}" alt="${imageData.newName}">
        </div>
        <div class="image-info">
            <div class="image-name" title="${imageData.newName}">${imageData.newName}</div>
            <div class="image-dimensions">
                <span>📐 Orijinal: ${imageData.originalWidth}×${imageData.originalHeight}</span>
                <span>🖼️ Çerçeve: ${imageData.frameWidth}×${imageData.frameHeight}</span>
            </div>
            <div class="image-actions">
                <button class="btn-download" onclick="downloadSingle('${imageData.id}')">⬇️ İndir</button>
                <button class="btn-remove" onclick="removeImage('${imageData.id}')">🗑️ Kaldır</button>
            </div>
        </div>
    `;

    imagesGrid.appendChild(card);
}

// Update UI visibility
function updateUI() {
    imagesSection.style.display = processedImages.length > 0 ? 'block' : 'none';
}

// Download single image
function downloadSingle(id) {
    const imageData = processedImages.find(img => img.id == id);
    if (!imageData) return;

    const link = document.createElement('a');
    link.href = imageData.dataUrl;
    link.download = imageData.newName;
    link.click();
}

// Remove single image
function removeImage(id) {
    processedImages = processedImages.filter(img => img.id != id);
    const card = document.querySelector(`.image-card[data-id="${id}"]`);
    if (card) {
        card.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            card.remove();
            updateUI();
        }, 300);
    }
}

// Download all images
downloadAllBtn.addEventListener('click', async () => {
    if (processedImages.length === 0) return;

    // Download each image with a small delay
    for (let i = 0; i < processedImages.length; i++) {
        const imageData = processedImages[i];
        const link = document.createElement('a');
        link.href = imageData.dataUrl;
        link.download = imageData.newName;
        link.click();
        
        // Small delay between downloads to prevent browser blocking
        if (i < processedImages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }
});

// Clear all images
clearAllBtn.addEventListener('click', () => {
    processedImages = [];
    imagesGrid.innerHTML = '';
    updateUI();
});

// Add fadeOut animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
    }
`;
document.head.appendChild(style);
