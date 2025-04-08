import { Request, Response, NextFunction } from 'express'
import { z, AnyZodObject, ZodError } from 'zod'

export const validate = (schema: AnyZodObject) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    return next()
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      })
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error during validation',
    })
  }
}

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