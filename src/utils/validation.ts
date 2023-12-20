import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { FieldDefinition } from '../types'
import { ipssrFields, ipssmFields } from './fields'

// Joi Validation Schema
const buildSchema = (ipssrFields: FieldDefinition[]) => {
  const schema = ipssrFields.reduce((schemaAcc, field: FieldDefinition) => {
    let fieldSchema: Joi.Schema

    switch (field.type) {
      case 'number':
        fieldSchema = Joi.number()
          .min(field.min ?? 0)
          .max(field.max ?? 0)
        break
      case 'string':
          fieldSchema = Joi.alternatives().try(Joi.string(), Joi.number())
          if (field.values) {
            fieldSchema = fieldSchema
              .valid(...field.values)
          }
          break
      default:
          throw new Error(`Unsupported field type: ${field.type}`)
      }

      fieldSchema = fieldSchema.messages({
        'number.base': `'${field.label}' must be a number.`,
        'number.min': `'${field.label}' must be greater than or equal to ${field.min}${field.units}`,
        'number.max': `'${field.label}' must be less than or equal to ${field.max}${field.units}`,
        'any.required': `'${field.label}' is required`,
        'any.only': `'${field.label}' must be one of: ${field.values?.join(', ')}.`,
        'string.base': `'${field.label}' must be a string`,
      })
      
      if (field.required) {
        fieldSchema = fieldSchema.required()
      } else if ('default' in field) {
        fieldSchema = fieldSchema.default(field.default)
      }
    return schemaAcc.keys({ [field.varName]: fieldSchema })
  }, Joi.object({}))

  return schema
}

// Endpoint Schemas
const patientForIpssrSchema = buildSchema(ipssrFields)
const patientForIpssmSchema = buildSchema(ipssmFields)
const annotateFileSchema = Joi.object({
  file: Joi.custom((value, helpers) => {
    return value && value.mimetype && value.mimetype.startsWith('text/') ? value : helpers.error('file.invalid')
  }, 'File validation'),
  outputFormat: Joi.string().valid('csv', 'tsv', 'xlsx').default('csv')
})


// Middlewares to handle validation errors
const handleResponse = (
  error: Joi.ValidationError | undefined,
  res: Response, 
  next: NextFunction
) => {
  if (error) {
    const errors = error.details.reduce((errorsAcc: {[key: string]: string[]}, detail: Joi.ValidationErrorItem) => {
      const fieldName = detail.path[0]
      if (!errorsAcc[fieldName]) {
        errorsAcc[fieldName] = []
      }
      errorsAcc[fieldName].push(detail.message)
      return errorsAcc
    }, {})
    res.status(400).json({ errorsCount: error.details.length, errors: errors })
  } else {
    next()
  }
}

export const validatePatientForIpssr = (req: Request, res: Response, next: NextFunction) => {
  const { value, error } = patientForIpssrSchema.validate(req.body, { abortEarly: false })
  req.body = value
  handleResponse(error, res, next)
}

export const validatePatientForIpssm = (req: Request, res: Response, next: NextFunction) => {
  const { value, error } = patientForIpssmSchema.validate(req.body, { abortEarly: false })
  req.body = value
  handleResponse(error, res, next)
}

export const validateAnnotateFile = (req: Request, res: Response, next: NextFunction) => {
  const { value, error } = annotateFileSchema.validate(req.body, { abortEarly: false })
  handleResponse(error, res, next)
}
