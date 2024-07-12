import createHttpError, { MethodNotAllowed, isHttpError } from 'http-errors';
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "yup";
import { Method } from "axios";

// Shape of the response when an error is thrown
interface ErrorResponse {
    error: {
        message: string;
        err?: any; // Sent for unhandled errors resulting in 500
    };
    status?: number; // Sent for unhandled errors resulting in 500
}

type ApiMethodHandlers = {
    [key in Uppercase<Method>]?: NextApiHandler;
};

export function apiHandler(handler: ApiMethodHandlers) {
    return async (req: NextApiRequest, res: NextApiResponse<ErrorResponse>) => {
        try {
            const method = req.method ? (req.method.toUpperCase() as keyof ApiMethodHandlers) : undefined;
            // check if HTTP method was specified
            if (!method)
                return errorHandler(new MethodNotAllowed(`No method specified on path ${req.url}!`), res);

            const methodHandler = handler[method];
            // check if handler supports current HTTP method
            if (!methodHandler)
                return errorHandler(new MethodNotAllowed(`Method ${req.method} Not Allowed on path ${req.url}!`), res);

            // call method handler
            await methodHandler(req, res);
        } catch (e) {
            // global error handler
            errorHandler(e, res);
        }
    }
}

function errorHandler(err: unknown, res: NextApiResponse<ErrorResponse>) {
    // Errors with statusCode >= 500 should not be exposed
    if (isHttpError(err) && err.expose) {
        // Handle all errors thrown by http-errors module
        return res.status(err.statusCode).json({ error: { message: err.message } });
    }
    else if (err instanceof ValidationError) {
        // Handle yup validation errors
        console.error(err);
        return res.status(400).json({ error: { message: "Invalid credentials: " + err.errors.join(", ") } });
    }
    else {
        // default to 500 server error
        console.error(err);
        return res.status(500).json({
            error: { message: "Internal Server Error", err: err },
            status: createHttpError.isHttpError(err) ? err.statusCode : 500,
        });
    }
}