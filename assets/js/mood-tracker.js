function toggleDescriptionContainer() {
    if (document.querySelectorAll('input[type="radio"]:checked').length > 0) {
        document.getElementById("description-container").style.display = "block";
    }
}

var radios = document.querySelectorAll('input[type="radio"]');

radios.forEach((radio) => {
    radio.addEventListener('change', toggleDescriptionContainer);
});

document.getElementById("myForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    var description = document.getElementById("description").value;

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data.description = description;

    try {
        console.log(data);

        const response = await fetch("http://localhost:3000/submit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.text();
        alert(result);

        window.location.href = "/mood-visualization.html";
    } catch (error) {
        console.error("Error: ", error);
    }
})