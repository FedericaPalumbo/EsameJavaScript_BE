import { Response, NextFunction } from 'express';
import classroomSrv from './classroom.service';
import { TypedRequest } from '../../lib/typed-request.interface';
import { CreateClassroomDto } from './classroom.dto';

// Come list di cart-item.controller, ma il comportamento cambia a seconda del ruolo.
// La consegna vuole questo controllo nel controller (non in un middleware):
// DOCENTE: le classi create da lui. STUDENTE: le classi di cui fa parte.
export const list = async (req: TypedRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const results = user.role === 'teacher'
            ? await classroomSrv.findByTeacher(user.id)
            : await classroomSrv.findByStudent(user.id);

        res.json(results);
    } catch (err) {
        next(err);
    }
}

// Come add di cart-item.controller, ma lo yaml prevede 201 per POST /classrooms.
// Il controllo "solo docenti" non è qui: lo fa isTeacher nel router.
export const add = async (req: TypedRequest<CreateClassroomDto>, res: Response, next: NextFunction) => {
    try {
        const { name, students } = req.body;

        const result = await classroomSrv.add({ name, students }, req.user!.id);

        res.status(201);
        res.json(result);
    } catch (err) {
        next(err);
    }
}