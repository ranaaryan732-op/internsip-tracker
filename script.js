let applications = JSON.parse(localStorage.getItem("applications")) || [];

const form = document.getElementById("applicationForm");
const list = document.getElementById("applicationList");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const application = {
        company: company.value,
        role: role.value,
        stage: stage.value,
        result: result.value,
        date: date.value
    };

    applications.push(application);
    localStorage.setItem("applications", JSON.stringify(applications));

    form.reset();
    renderApplications();
});

function renderApplications() {
    list.innerHTML = "";

    applications.forEach((app, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${app.company}</td>
            <td>${app.role}</td>
            <td>${app.stage}</td>
            <td>${app.result}</td>
            <td>${app.date}</td>
            <td><button class="delete-btn" onclick="deleteApplication(${index})">Delete</button></td>
        `;

        list.appendChild(row);
    });

    updateSummary();
}

function deleteApplication(index) {
    applications.splice(index, 1);
    localStorage.setItem("applications", JSON.stringify(applications));
    renderApplications();
}

function updateSummary() {
    document.getElementById("total").textContent = applications.length;

    document.getElementById("interviews").textContent =
        applications.filter(app => app.stage === "Interview").length;

    document.getElementById("offers").textContent =
        applications.filter(app => app.stage === "Offer").length;

    document.getElementById("rejections").textContent =
        applications.filter(app => app.result === "Rejected").length;
}

renderApplications();
