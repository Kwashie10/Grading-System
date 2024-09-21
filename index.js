// Elements
const form = document.getElementById('grade-form');
const studentTableBody = document.querySelector('#student-table tbody');
const submitBtn = document.getElementById('submit-btn');
const downloadBtn = document.getElementById('download-btn');

// Load students from localStorage on page load
document.addEventListener('DOMContentLoaded', loadStudents);

// Student data array
let students = JSON.parse(localStorage.getItem('students')) || [];

// Add or Update Student
submitBtn.addEventListener('click', () => {
  const studentID = document.getElementById('studentID').value.trim();
  const surname = document.getElementById('surname').value.trim();
  const fname = document.getElementById('fname').value.trim();
  const programme = document.getElementById('programme').value.trim();
  const ctest = parseFloat(document.getElementById('ctest').value);
  const cquiz = parseFloat(document.getElementById('cquiz').value);
  const exam = parseFloat(document.getElementById('exam').value);

  if (studentID && surname && fname && programme && !isNaN(ctest) && !isNaN(cquiz) && !isNaN(exam)) {
    const total = ctest + cquiz + exam;
    const grade = calculateGrade(total);

    const student = { studentID, surname, fname, programme, total, grade };

    // Check if student already exists (edit case)
    const existingIndex = students.findIndex(st => st.studentID === studentID);
    if (existingIndex >= 0) {
      students[existingIndex] = student;
    } else {
      students.push(student);
    }

    saveAndRender();
    form.reset(); // Clear the form after submission
  } else {
    alert('Please fill out all fields correctly.');
  }
});

// Calculate Grade based on total
function calculateGrade(total) {
  if (total >= 70) return 'A';
  if (total >= 60) return 'B';
  if (total >= 50) return 'C';
  if (total >= 40) return 'D';
  return 'F';
}

// Save to localStorage and render students
function saveAndRender() {
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents();
}

// Load students from localStorage and render them
function loadStudents() {
  renderStudents();
}

// Render students in the table
function renderStudents() {
  studentTableBody.innerHTML = ''; // Clear the table before rendering
  students.forEach(student => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${student.studentID}</td>
      <td>${student.surname}</td>
      <td>${student.fname}</td>
      <td>${student.programme}</td>
      <td>${student.total}</td>
      <td>${student.grade}</td>
      <td>
        <button class="btn-edit" onclick="editStudent('${student.studentID}')">Edit</button>
        <button class="btn-delete" onclick="deleteStudent('${student.studentID}')">Delete</button>
      </td>
    `;

    studentTableBody.appendChild(row);
  });
}

// Edit student data
function editStudent(studentID) {
  const student = students.find(st => st.studentID === studentID);
  if (student) {
    document.getElementById('studentID').value = student.studentID;
    document.getElementById('surname').value = student.surname;
    document.getElementById('fname').value = student.fname;
    document.getElementById('programme').value = student.programme;
    document.getElementById('ctest').value = student.total * 0.3; // Assuming marks for class test
    document.getElementById('cquiz').value = student.total * 0.2; // Assuming marks for class quiz
    document.getElementById('exam').value = student.total * 0.5;  // Assuming marks for exam
  }
}

// Delete student
function deleteStudent(studentID) {
  students = students.filter(student => student.studentID !== studentID);
  saveAndRender();
}

// Download CSV functionality
downloadBtn.addEventListener('click', () => {
  const csvContent = convertToCSV(students);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'students.csv';
  link.click();
});

// Convert array of student data to CSV format
function convertToCSV(data) {
  const headers = ['Student ID', 'Surname', 'First Name', 'Programme', 'Total', 'Grade'];
  const rows = data.map(student => [
    student.studentID,
    student.surname,
    student.fname,
    student.programme,
    student.total,
    student.grade
  ]);

  let csvContent = headers.join(',') + '\n'; // Add headers
  csvContent += rows.map(row => row.join(',')).join('\n'); // Add rows

  return csvContent;
}
