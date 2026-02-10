const applicationForm = document.getElementById('applicationForm');
const applicationsTable = document.getElementById('applicationsTable');
const applicationsTableBody = document.getElementById('applicationsTableBody');
const emptyState = document.getElementById('emptyState');
const appCount = document.getElementById('appCount');
const deleteModal = document.getElementById('deleteModal');
const closeModal = document.getElementById('closeModal');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');
const deleteAppDetails = document.getElementById('deleteAppDetails');
const successNotification = document.getElementById('successNotification');
const notificationText = document.getElementById('notificationText');

const totalApplicationsEl = document.getElementById('totalApplications');
const interviewCountEl = document.getElementById('interviewCount');
const offerCountEl = document.getElementById('offerCount');
const rejectionCountEl = document.getElementById('rejectionCount');

document.getElementById('appliedDate').valueAsDate = new Date();

let applications = JSON.parse(localStorage.getItem('placementApplications')) || [];
let applicationToDelete = null;

document.addEventListener('DOMContentLoaded', function() {
    renderApplications();
    updateSummary();
    
    if (applications.length === 0) {
        addDummyData();
    }
});

applicationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const companyName = document.getElementById('companyName').value.trim();
    const position = document.getElementById('position').value.trim();
    const stage = document.getElementById('stage').value;
    const result = document.getElementById('result').value;
    const appliedDate = document.getElementById('appliedDate').value;
    
    if (!companyName || !position || !stage) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    const application = {
        id: Date.now(),
        companyName,
        position,
        stage,
        result,
        appliedDate
    };
    
    applications.push(application);
    
    saveToLocalStorage();
    
    renderApplications();
    updateSummary();
    
    applicationForm.reset();
    document.getElementById('appliedDate').valueAsDate = new Date();
    
    showNotification('Application added successfully!', 'success');
});

document.getElementById('resetBtn').addEventListener('click', function() {
    document.getElementById('appliedDate').valueAsDate = new Date();
});

function renderApplications() {
    applicationsTableBody.innerHTML = '';
    
    if (applications.length === 0) {
        emptyState.style.display = 'block';
        applicationsTable.style.display = 'none';
        appCount.textContent = '0 applications';
    } else {
        emptyState.style.display = 'none';
        applicationsTable.style.display = 'table';
        appCount.textContent = `${applications.length} ${applications.length === 1 ? 'application' : 'applications'}`;
        
        const sortedApplications = [...applications].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
        
        sortedApplications.forEach(app => {
            const row = document.createElement('tr');
            
            const formattedDate = new Date(app.appliedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            let stageClass = '';
            if (app.stage.includes('Applied')) stageClass = 'stage-applied';
            else if (app.stage.includes('OA')) stageClass = 'stage-oa';
            else if (app.stage.includes('Interview')) stageClass = 'stage-interview';
            else if (app.stage.includes('Offer')) stageClass = 'stage-offer';
            else if (app.stage.includes('Rejected')) stageClass = 'stage-rejected';
            
            let resultClass = '';
            if (app.result === 'Pending') resultClass = 'result-pending';
            else if (app.result === 'Cleared') resultClass = 'result-cleared';
            else if (app.result === 'Rejected') resultClass = 'result-rejected';
            
            row.innerHTML = `
                <td>${app.companyName}</td>
                <td>${app.position}</td>
                <td><span class="stage-badge ${stageClass}">${app.stage}</span></td>
                <td><span class="result-badge ${resultClass}">${app.result}</span></td>
                <td>${formattedDate}</td>
                <td class="actions-cell">
                    <button class="btn-icon btn-delete" data-id="${app.id}" title="Delete Application">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            
            applicationsTableBody.appendChild(row);
        });
        
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                showDeleteModal(id);
            });
        });
    }
}

function showDeleteModal(id) {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    applicationToDelete = id;
    deleteAppDetails.textContent = `${app.companyName} - ${app.position}`;
    deleteModal.style.display = 'flex';
}

closeModal.addEventListener('click', function() {
    deleteModal.style.display = 'none';
    applicationToDelete = null;
});

cancelDelete.addEventListener('click', function() {
    deleteModal.style.display = 'none';
    applicationToDelete = null;
});

confirmDelete.addEventListener('click', function() {
    if (applicationToDelete) {
        applications = applications.filter(app => app.id !== applicationToDelete);
        
        saveToLocalStorage();
        
        renderApplications();
        updateSummary();
        
        deleteModal.style.display = 'none';
        applicationToDelete = null;
        
        showNotification('Application deleted successfully!', 'success');
    }
});

function updateSummary() {
    const total = applications.length;
    const interviews = applications.filter(app => app.stage === 'Interview').length;
    const offers = applications.filter(app => app.stage === 'Offer').length;
    const rejections = applications.filter(app => app.stage === 'Rejected' || app.result === 'Rejected').length;
    
    totalApplicationsEl.textContent = total;
    interviewCountEl.textContent = interviews;
    offerCountEl.textContent = offers;
    rejectionCountEl.textContent = rejections;
}

function saveToLocalStorage() {
    localStorage.setItem('placementApplications', JSON.stringify(applications));
}

function showNotification(message, type = 'success') {
    notificationText.textContent = message;
    
    if (type === 'error') {
        successNotification.style.background = 'var(--danger)';
    } else {
        successNotification.style.background = 'var(--secondary)';
    }
    
    successNotification.style.display = 'flex';
    
    setTimeout(() => {
        successNotification.style.display = 'none';
    }, 3000);
}

function addDummyData() {
    const dummyApplications = [
        {
            id: 1,
            companyName: "Google",
            position: "Software Engineer Intern",
            stage: "Online Assessment (OA)",
            result: "Pending",
            appliedDate: "2023-10-15"
        },
        {
            id: 2,
            companyName: "Microsoft",
            position: "Product Manager Intern",
            stage: "Interview",
            result: "Cleared",
            appliedDate: "2023-10-10"
        },
        {
            id: 3,
            companyName: "Amazon",
            position: "Data Analyst",
            stage: "Applied",
            result: "Pending",
            appliedDate: "2023-10-05"
        },
        {
            id: 4,
            companyName: "Meta",
            position: "Frontend Developer",
            stage: "Offer",
            result: "Cleared",
            appliedDate: "2023-09-28"
        },
        {
            id: 5,
            companyName: "Netflix",
            position: "UX Designer",
            stage: "Rejected",
            result: "Rejected",
            appliedDate: "2023-09-20"
        }
    ];
    
    applications = dummyApplications;
    saveToLocalStorage();
    renderApplications();
    updateSummary();
    
    setTimeout(() => {
        showNotification('Demo data loaded. You can delete these and add your own applications!', 'success');
    }, 500);
}

window.addEventListener('click', function(e) {
    if (e.target === deleteModal) {
        deleteModal.style.display = 'none';
        applicationToDelete = null;
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && deleteModal.style.display === 'flex') {
        deleteModal.style.display = 'none';
        applicationToDelete = null;
    }
    
    if (e.key === 'Enter' && deleteModal.style.display === 'flex') {
        confirmDelete.click();
    }
});
