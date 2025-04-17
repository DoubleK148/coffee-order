import { Request, Response, NextFunction } from 'express'
import { z, AnyZodObject, ZodError } from 'zod'
import { ObjectSchema } from 'joi'

export const validateZod = (schema: AnyZodObject) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Validating request data:', {
      body: req.body,
      query: req.query,
      params: req.params
    });

    // Validate based on the presence of specific fields in the schema
    const toValidate: any = {};
    if (schema.shape.body) toValidate.body = req.body;
    if (schema.shape.query) toValidate.query = req.query;
    if (schema.shape.params) toValidate.params = req.params;

    // If no specific fields are defined, validate the body directly
    const validationTarget = Object.keys(toValidate).length > 0 ? toValidate : req.body;
    
    await schema.parseAsync(validationTarget);

    console.log('Validation passed');
    return next()
  } catch (error) {
    console.error('Validation error:', error);
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      })
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error during validation',
    })
  }
}

export const validate = (schema: ObjectSchema) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let validationTarget = req.body;
  if (req.params && Object.keys(req.params).length > 0) {
    validationTarget = req.params;
  }

  const { error } = schema.validate(validationTarget, { 
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false
  });
  
  if (error) {
    console.error('Validation error:', error.details);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.details.map(detail => ({
        path: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  next();
};

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
  })
})

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
        'Mật khẩu phải chứa chữ hoa, chữ thường và số'),
    fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự')
  })
})

export const resetPasswordRequestSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ')
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token không được để trống'),
    password: z.string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
        'Mật khẩu phải chứa chữ hoa, chữ thường và số')
  })
}); 