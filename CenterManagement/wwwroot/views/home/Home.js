document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Registration Successful!');
});

async function fetchAndRenderSlides() {
    const slidesContainer = document.getElementById('slides');

    try {
        const response = await fetch('URL_OF_YOUR_API');
        const data = await response.json();

        data.forEach(item => {
            const slideDiv = document.createElement('div');
            slideDiv.classList.add('slide');
            const img = document.createElement('img');
            img.alt = 'Slide Image';
            slideDiv.appendChild(img);
            slidesContainer.appendChild(slideDiv);
        });
    } catch (error) {
        console.error('Error fetching slides:', error);
    }
}


window.onload = fetchAndRenderSlides;