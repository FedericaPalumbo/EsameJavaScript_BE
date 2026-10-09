import { HydratedDocument, model, Schema } from "mongoose";
import { Assignment, AssignmentStudent } from "./assignment.entity";

// Sotto-schema per gli elementi di students.
// _id: false perché non serve un id per ogni elemento (si identifica con studentId)
const assignmentStudentSchema = new Schema<AssignmentStudent>({
    studentId: { type: Schema.Types.ObjectId, ref: 'User' },
    completed: { type: Boolean, default: false }
}, { _id: false });

// Come cartItemSchema, con queste differenze:
// - classroom e createdBy sono ref (si salvano solo gli id)
// - students contiene { studentId, completed }
// - studentsCount e completedCount sono virtual, non campi salvati
const assignmentSchema = new Schema<Assignment>({
    title: String,
    classroom: { type: Schema.Types.ObjectId, ref: 'Classroom' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    students: [assignmentStudentSchema]
});

assignmentSchema.virtual('studentsCount').get(function () {
    return this.students.length;
});

assignmentSchema.virtual('completedCount').get(function () {
    return this.students.filter(s => s.completed).length;
});

// Nel JSON non vanno la lista degli studenti (la consegna dice che tornano solo i conteggi)
// e la classe (non è prevista nello schema Assignment del yaml).
// createdBy resta, ma va popolato nel service (come .populate('product') nel riferimento)
assignmentSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        delete ret.students;
        delete ret.classroom;
        return ret;
    }
});

// Nel toObject students resta: serve nel codice (es. per calcolare completed
// per lo studente che chiama l'API, aggiungendo la proprietà al plain object)
assignmentSchema.set('toObject', {
    virtuals: true,
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export type AssignmentDocument = HydratedDocument<Assignment>;

export const AssignmentModel = model<Assignment>('Assignment', assignmentSchema);