const lessons = [
    { id: 1, subject: "Math", location: "London", price: 100, spaces: 5, icon: "fas fa-calculator", rating: 4 },
    { id: 2, subject: "Science", location: "Birmingham", price: 120, spaces: 5, icon: "fas fa-flask", rating: 4 },
    { id: 3, subject: "English", location: "Oxford", price: 90, spaces: 5, icon: "fas fa-feather-alt", rating: 3 },
    { id: 4, subject: "History", location: "London", price: 80, spaces: 5, icon: "fas fa-landmark", rating: 3},
    { id: 5, subject: "Geography", location: "Liverpool", price: 95, spaces: 5, icon: "fas fa-globe", rating: 4 },
    { id: 6, subject: "Art", location: "York", price: 70, spaces: 5, icon: "fas fa-paint-brush", rating: 4 },
    { id: 7, subject: "Music", location: "Bristol", price: 110, spaces: 5, icon: "fas fa-music", rating: 5 },
    { id: 8, subject: "Computer Science", location: "Oxford", price: 150, spaces: 5, icon: "fas fa-laptop-code", rating: 4 },
    { id: 9, subject: "Drama", location: "Cambridge", price: 85, spaces: 5, icon: "fas fa-theater-masks", rating: 4},
    { id: 10, subject: "Physical Education", location: "Bristol", price: 60, spaces: 5, icon: "fas fa-basketball-ball", rating: 3}
];

async function searchLessons() {
  const query = document.getElementById('search-input').value.trim();  
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // clear previous results

    try {
        const res = await fetch(`/search?query=${encodeURIComponent(query)}`);
        const lessons = await res.json();

        if (!lessons || lessons.length === 0) {
            resultsDiv.innerHTML = '<p class="no-results">No results found.</p>';
            return;
        }

        lessons.forEach(lesson => {
            const lessonDiv = document.createElement('div');
            lessonDiv.classList.add('lesson-card');
            lessonDiv.innerHTML = `
            <h3>${lesson.subject}</h3>
            <p>Location: ${lesson.location}</p>
            <p>Price: ${lesson.price}</p>
            <p>Spaces: ${lesson.spaces}</p>
            `;
            resultsDiv.appendChild(lessonDiv);
        });
    } catch (error) {
        console.error('Error fetching lessons:', error);
        resultsDiv.innerHTML = '<p>Failed to fetch lessons.</p>';
    }
}

window.addEventListener('DOMContentLoaded', searchLessons);
