import { HydratedDocument, model, Schema } from "mongoose";
import { Classroom } from "./classroom.entity";

// Come cartItemSchema, con queste differenze:
// - students e createdBy sono ref: 'User' (si salvano solo gli id)
// - studentsCount è un virtual, non un campo salvato
const classroomSchema = new Schema<Classroom>({
    name: String,
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

classroomSchema.virtual('studentsCount').get(function () {
    return this.students.length;
});

// Nel JSON non va la lista degli studenti: la consegna dice che tornano solo i conteggi.
// createdBy resta, ma va popolato nel service (come .populate('product') nel riferimento)
classroomSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        delete ret.students;
        return ret;
    }
});

// Nel toObject students resta: serve nel codice (es. per creare l'array
// students di un'attività partendo dalla lista degli studenti della classe)
classroomSchema.set('toObject', {
    virtuals: true,
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export type ClassroomDocument = HydratedDocument<Classroom>;

export const ClassroomModel = model<Classroom>('Classroom', classroomSchema);