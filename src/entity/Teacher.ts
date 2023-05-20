import { Person } from "./Person";

export interface Teacher extends Person {
    knowledge_are: "Art" | "Marketing" | "Software"
}
 