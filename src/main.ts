import { Activity } from "./entity/Activity";
import { Assignment } from "./entity/Assignment";
import { GradebookDTO } from "./entity/GradebookDTO";
import { GradebookSetup } from "./entity/GradebookSetup";
import { Student } from "./entity/Student";
import { Teacher } from "./entity/Teacher";

//Declaracion de arreglos vacios, para llenar data
let students: Student[] = [];
let teachers: Teacher[] = [];
let activities: Activity[] = [];
let gradebookSetups: GradebookSetup[] = [];
let assignments: Assignment[] = [];

enum Course {
    GraphicDesign = "Graphic Design",
    Database = "Database",
    CommunityManager = "Community Manager"
}

// FUNCIONES ADD
function addStudent(): void {
    let currentStudent: Student =
    {
        dni: readFromHtml("student_dni"),
        fullName: readFromHtml("student_fullname"),
        level: parseInt(readFromHtml("student_level"))
    }
    students.push(currentStudent);
    console.table(students);
}

function addTeacher(): void {
    let currentTeacher: Teacher =
    {
        dni: readFromHtml("teacher_dni"),
        fullName: readFromHtml("teacher_fullname"),
        knowledge_are: readFromHtml("teacher_area") as "Software" | "Marketing" | "Art"
    }
    teachers.push(currentTeacher);
    console.table(teachers);
}

function addActivity(): void {
    let currentActivity: Activity =
    {
        name: readFromHtml("activity_name"),
    }
    activities.push(currentActivity);
    console.table(activities);
    initSelect();
}

function addGradebookSetup(): void {
    let currentGradebookSetup: GradebookSetup =
    {
        value: readFromHtml("gradebook_value"),
        course: readFromHtml("gradebook_course"),
        activity: readFromHtml("gradebook_activity"),
        maximun_grade: parseInt(readFromHtml("gradebook_maximun_grade"))
    }
    gradebookSetups.push(currentGradebookSetup);
    console.table(gradebookSetups);
    initSelect();
}

function addAssignment(): void {
    let currentAssignment: Assignment =
    {
        student: readFromHtml("assignment_student"),
        gradebooksetup: readFromHtml("assignment_gradebooksetup"),
        grade: parseInt(readFromHtml("assignment_grade"))
    }
    assignments.push(currentAssignment);
    console.table(assignments);
    initSelect();
}

// FUNCION LEER HTML
function readFromHtml(id: string): string {
    return (<HTMLInputElement>document.getElementById(id)).value;
}
// FUNCION QUE ME TRAE LOS DATOS Y LUEGO RECORRERLOS
function initSelect(): void {
    //ASIGNAR UN CURSO
    let gradebookCourse = document.getElementById("gradebook_course") as HTMLSelectElement;
    document.querySelectorAll("#gradebook_course option").forEach(option => option.remove());
    let courses = Object.values(Course);
    courses.forEach(
        (value) => {
            let option = document.createElement("option");
            option.value = value;
            option.text = value;
            gradebookCourse.add(option);
        }
    );
    // ASIGNAR UNA ACTIVIDAD
    let gradebookActivity = document.getElementById("gradebook_activity") as HTMLSelectElement;
    document.querySelectorAll("#gradebook_activity option").forEach(option => option.remove());
    activities.forEach(
        (activity) => {
            let option = document.createElement("option");
            option.value = activity.name;
            option.text = activity.name;
            gradebookActivity.add(option);
        }
    );
    // ASIGNAR UN ESTUDIANTE
    let assignmentsStudent = document.getElementById("assignment_student") as HTMLSelectElement;
    document.querySelectorAll("#assignment_student option").forEach(option => option.remove());
    students.forEach(
        (student) => {
            let option = document.createElement("option");
            option.value = student.dni;
            option.text = student.fullName;
            assignmentsStudent.add(option);
        }
    );
    // ASIGNAR EL VALOR
    let assignmentSetup = document.getElementById("assignment_gradebooksetup") as HTMLSelectElement;
    document.querySelectorAll("#assignment_gradebooksetup option").forEach(option => option.remove());
    gradebookSetups.forEach(
        (data) => {
            let option = document.createElement("option");
            option.value = data.value;
            option.text = data.value;
            assignmentSetup.add(option);
        }
    );

}
initSelect()

// CLASE PARA ASIGNACION
class Gradebook {
// TAMBIEN SE PUEDE DECLARAR ATRIBUTOS ADENTO DEL CONSTRUCTOR 
    constructor(
        public students: Student[],
        public activities: Activity[],
        public gradebookSetups: GradebookSetup[],
        public assignments: Assignment[],
        public teachers?: Teacher[]
    ) {
        // this.students=students;
        // this.activities=activities;
        // this.gradebookSetups=gradebookSetups;
        // this.assignments=assignments;
    }
    public buildGradebookDTOFromAssignment(): GradebookDTO[] {
        let gradebookDTOs: GradebookDTO[] = [];
        this.assignments.forEach((assignment) => {
            let currentGradebooksetup = gradebookSetups.filter((item) => item.value === assignment.gradebooksetup)[0];
            let currentStudent = students.filter((student) => student.dni === assignment.student)[0];
            let currentActivity = activities.filter((activities) => activities.name === assignment.student)[0];
            let rowGradebook: GradebookDTO = {
                //Course
                course: currentGradebooksetup.course,
                //Student
                studentName: currentStudent.fullName,
                lastName: "",
                level: currentStudent.level,
                dni: assignment.student,
                fullName: currentStudent.fullName,
                //GradebookSetup
                value: "",
                activity: currentGradebooksetup.activity,
                maximun_grade: 0,
                //Activity
                name: "",
                //Assignment
                student: assignment.student,
                gradebooksetup: assignment.gradebooksetup,
                grade: assignment.grade,
            };
            gradebookDTOs.push(rowGradebook);
            if (assignment.grade>70) {
                console.log('ESTUDIANTE APROBADO :)');
            }
            else{
                console.log('ESTUDIANTE REPROBADO :(');
            }
        });
        return gradebookDTOs;
    }
}

// FUNCION QUE GENERA LA TABLA REPORTE
function generateReport(): void {
    let reportGrade: Gradebook = new Gradebook(
        students,
        activities,
        gradebookSetups,
        assignments,
        teachers
    );
    let rowReport: GradebookDTO[] = reportGrade.buildGradebookDTOFromAssignment()
    console.log(activities);
    let reportTable: HTMLTableElement = document.getElementById("report") as HTMLTableElement;
    rowReport.forEach((itemDTO) => {
        let tr: HTMLTableRowElement;
        let td: HTMLTableCellElement;
        //LAS FILAS SE GENERAN ABAJO
        tr = reportTable.insertRow(-1);
        td = tr.insertCell(0);
        td.innerHTML = itemDTO.course;
        td = tr.insertCell(1);
        td.innerHTML = itemDTO.studentName;
        td = tr.insertCell(2);
        td.innerHTML = itemDTO.level.toString();
        td = tr.insertCell(3);
        td.innerHTML = itemDTO.activity;
        td = tr.insertCell(4);
        td.innerHTML = itemDTO.maximun_grade.toString();
        td = tr.insertCell(5);
        td.innerHTML = itemDTO.grade.toString();
      });
  }