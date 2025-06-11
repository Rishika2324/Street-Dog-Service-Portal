// ✅ Global dog data array
const dogsData = [
    {
        name: 'Bruno',
        breed: 'Labrador',
        gender: 'Male',
        age: 'Adult',
        location: 'New York',
        imageUrl: 'https://placedog.net/400/300?id=10',
    },
    {
        name: 'Lucy',
        breed: 'Bulldog',
        gender: 'Female',
        age: 'Puppy',
        location: 'California',
        imageUrl: 'https://placedog.net/400/300?id=11',
    },
    {
        name: 'Max',
        breed: 'Beagle',
        gender: 'Male',
        age: 'Senior',
        location: 'New York',
        imageUrl: 'https://placedog.net/400/300?id=12',
    },
];



async function fetchDogs() {
  try {
    const res = await fetch('http://localhost:5000/api/dogs');
    const dogs = await res.json();

    const container = document.getElementById('dogs-list');
    container.innerHTML = ''; // Clear old entries

    dogs.forEach((dog) => {
      const card = document.createElement('div');
      card.className = 'dog-card';

      card.innerHTML = `
        <img src="${dog.imageUrl}" alt="${dog.name}" />
        <h3>${dog.name}</h3>
        <p><strong>Breed:</strong> ${dog.breed}</p>
        <p><strong>Age:</strong> ${dog.age}</p>
        <p><strong>Gender:</strong> ${dog.gender || 'N/A'}</p>
        <p><strong>Location:</strong> ${dog.location}</p>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error fetching dogs:', err);
  }
}

fetchDogs(); // Call it when the page loads

// ✅ Display dogs in the UI
function displayDogs(dogs) {
    const dogsList = document.getElementById('dogs-list');
    dogsList.innerHTML = '';

    dogs.forEach(dog => {
        const dogCard = document.createElement('div');
        dogCard.classList.add('dog-card');
        dogCard.innerHTML = `
            <img src="${dog.imageUrl}" alt="Dog">
            <p>${dog.name} - ${dog.breed} (${dog.age})</p>
            <p>Location: ${dog.location}, Gender: ${dog.gender}</p>
        `;
        dogsList.appendChild(dogCard);
    });
}

// ✅ Filter dogs based on selected filters
function applyFilters() {
    const gender = document.getElementById('gender-filter').value;
    const breed = document.getElementById('breed-filter').value;
    const location = document.getElementById('location-filter').value;
    const age = document.getElementById('age-filter').value;

    const filteredDogs = dogsData.filter(dog => {
        return (
            (!gender || dog.gender === gender) &&
            (!breed || dog.breed === breed) &&
            (!location || dog.location === location) &&
            (!age || dog.age === age)
        );
    });

    displayDogs(filteredDogs);
}

// ✅ Main script
document.addEventListener("DOMContentLoaded", () => {
    // Show all dogs on initial load
    displayDogs(dogsData);

    // Background slider (optional)
    const images = document.querySelectorAll(".slider img");
    let currentIndex = 0;

    function changeImage() {
        images[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add("active");
    }

    if (images.length > 0) {
        setInterval(changeImage, 3000);
    }

    // CTA button redirect
    const ctaButton = document.querySelector(".cta-button");
    if (ctaButton) {
        ctaButton.addEventListener("click", () => {
            window.location.href = "register.html";
        });
    }

    // Registration logic
    const registerFormEl = document.getElementById("registerForm");
    if (registerFormEl) {
        registerFormEl.addEventListener("submit", async (event) => {
            event.preventDefault();
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!name || !email || !password) {
                alert("❌ Please fill in all fields!");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert("✅ Registration Successful!");
                    registerFormEl.reset();
                    window.location.href = "login.html";
                } else {
                    alert(`❌ ${data.message}`);
                }
            } catch (error) {
                alert("❌ Registration failed. Please try again.");
            }
        });
    }

    // Login logic
    const loginFormEl = document.getElementById("loginForm");
    if (loginFormEl) {
        loginFormEl.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            if (!email || !password) {
                alert("❌ Please enter both email and password.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert("✅ Login Successful!");
                    localStorage.setItem("userName", data.name || "User");
                    window.location.href = "home.html";
                } else {
                    alert(`❌ ${data.message}`);
                }
            } catch (error) {
                alert("❌ Login failed. Please check your credentials.");
            }
        });
    }

    // Display logged-in user's name if available
    const userName = localStorage.getItem("userName");
    if (userName && document.getElementById("userName")) {
        document.getElementById("userName").textContent = userName;
    }
});



