let uploadedFile = null;

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const uploadedImage = document.getElementById('uploadedImage');
            uploadedImage.src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
            uploadedFile = file;
            document.getElementById('errorMessage').textContent = '';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('resizeBtn').addEventListener('click', () => {
    const resizeInput = document.getElementById('resizeInput').value;
    if (!uploadedFile) {
        document.getElementById('errorMessage').textContent = 'Please upload an image first.';
        return;
    }
    if (isNaN(resizeInput) || resizeInput <= 0 || resizeInput > 99) {
        document.getElementById('errorMessage').textContent = 'Please enter a valid percentage (1-99).';
        return;
    }
    resizeImage(resizeInput / 100);
});

function resizeImage(scale) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                const resizedUrl = URL.createObjectURL(blob);
                const resizedImage = document.getElementById('resizedImage');
                resizedImage.src = resizedUrl;

                document.getElementById('finalSize').textContent = `Resized Image Size: ${(blob.size / 1024).toFixed(2)} KB`;
                document.getElementById('downloadBtn').href = resizedUrl;
                document.getElementById('result').style.display = 'block';
            }, 'image/jpeg', 0.8);
        };
    };
    reader.readAsDataURL(uploadedFile);
}
