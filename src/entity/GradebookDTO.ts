import { Activity } from "./Activity";
import { Assignment } from "./Assignment";
import { GradebookSetup } from "./GradebookSetup";
import { Student } from "./Student"

export interface GradebookDTO extends Student, GradebookSetup, Activity, Assignment  {
    course: string,
    studentName: string,
    lastName: string
}