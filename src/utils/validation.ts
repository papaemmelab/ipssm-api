import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { fieldsDefinitions, FieldDefinition } from './fields';

// const cytoIppsrOptions = ['Very Good', 'Good', 'Intermediate', 'Poor', 'Very Poor']

// const patientForIpssrSchema = Joi.object({
//   bmblast: Joi.number()
//     .min(0)
//     .max(30)
//     .required(),
//   hb: Joi.number()
//     .min(4)
//     .max(20)
//     .required(),
//   plt: Joi.number()
//     .min(0)
//     .max(2000)
//     .required(),
//   anc: Joi.number()
//     .min(0)
//     .max(15)
//     .required(),
//   cytoIpssr: Joi.string()
//     .valid(...cytoIppsrOptions)
//     .required(),
//   age: Joi.number()
//     .min(18)
//     .max(120)
//     .optional(),
// })

const buildSchema = (fieldsDefinitions: FieldDefinition[]) => {
  const schema = fieldsDefinitions.reduce((schemaAcc, field: FieldDefinition) => {
    let fieldSchema: Joi.Schema

    switch (field.type) {
      case 'number':
        fieldSchema = Joi.number()
          .min(field.min ?? 0)
          .max(field.max ?? 0)
          .messages({
            
          });
        break;
      case 'string':
          fieldSchema = Joi.string()
          if (field.values) {
            fieldSchema = fieldSchema
              .valid(...field.values)
          }
          break;
      default:
          throw new Error(`Unsupported field type: ${field.type}`);
      }

      fieldSchema = fieldSchema.messages({
        'number.base': `'${field.label}' must be a number.`,
        'number.min': `'${field.label}' must be greater than or equal to ${field.min}${field.units}`,
        'number.max': `'${field.label}' must be less than or equal to ${field.max}${field.units}`,
        'any.required': `'${field.label}' is required`,
        'any.only': `'${field.label}' must be one of: ${field.values?.join(', ')}.`,
        'string.base': `'${field.label}' must be a string`,
      });
      
      if (field.required) {
        fieldSchema = fieldSchema.required();
      }
    return schemaAcc.keys({ [field.varName]: fieldSchema });
  }, Joi.object({}));

  return schema;
};

const patientForIpssrSchema = buildSchema(fieldsDefinitions);

export const validatePatientForIpssr = (req: Request, res: Response, next: NextFunction) => {
  const { error } = patientForIpssrSchema.validate(req.body, { abortEarly: false })
  
  // Format Error Response
  if (error) {
    const errors = error.details.reduce((errorsAcc: {[key: string]: string[]}, detail: Joi.ValidationErrorItem) => {
      const fieldName = detail.path[0]
      if (!errorsAcc[fieldName]) {
        errorsAcc[fieldName] = []
      }
      errorsAcc[fieldName].push(detail.message)
      return errorsAcc
    }, {});
    res.status(400).json({ errorsCount: error.details.length, errors: errors })
  } else {
    next();
  }
}


