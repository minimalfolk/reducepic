let uploadedFile = null;

document.addEventListener('change', function(event) {
    if (event.target.id === 'fileInput') {
        handleFileUpload(event);
    }
});

document.addEventListener('click', function(event) {
    if (event.target.id === 'resizeBtn') {
        handleResize();
    }
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.getElementById('uploadedImage');
            imgElement.src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
            uploadedFile = file;
            document.getElementById('errorMessage').textContent = '';
        };
        reader.readAsDataURL(file);
    }
}

function handleResize() {
    const resizeInput = document.getElementById('resizeInput').value;
    if (!uploadedFile) {
        document.getElementById('errorMessage').textContent = 'Please upload an image first.';
        return;
    }
    if (resizeInput <= 0 || isNaN(resizeInput)) {
        document.getElementById('errorMessage').textContent = 'Please enter a valid percentage.';
        return;
    }
    const resizePercentage = resizeInput / 100;
    processImage(resizePercentage);
}

function processImage(resizePercentage) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width * resizePercentage;
            canvas.height = img.height * resizePercentage;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(function(blob) {
                const newSize = (blob.size / 1024).toFixed(2);
                const newUrl = URL.createObjectURL(blob);
                document.getElementById('resizedImage').src = newUrl;
                document.getElementById('finalSize').textContent = `Final Image Size: ${newSize} KB`;
                const downloadLink = document.getElementById('downloadBtn');
                downloadLink.href = newUrl;
                document.getElementById('result').style.display = 'block';
            }, 'image/jpeg', 0.7);
        };
    };
    reader.readAsDataURL(uploadedFile);
}
