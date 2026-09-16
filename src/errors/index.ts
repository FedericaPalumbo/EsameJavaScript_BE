import { validationHandler } from './validadion-error';
import { genericErrorHandler } from "./generic";
import { notFoundHandler } from "./not-found.error";
import { unauthorizedHandler } from "./unauthorized.error";

export const errorHandlers = [validationHandler, notFoundHandler, unauthorizedHandler, genericErrorHandler];