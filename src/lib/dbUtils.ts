import mongoose from 'mongoose';
import dbConnect from './db';

/**
 * Generic error handler for database operations
 * @param error The error object thrown
 * @param operation The name of the operation that failed
 * @returns Standardized error object
 */
export const handleDbError = (error: any, operation: string) => {
  console.error(`Database error during ${operation}:`, error);
  
  // Handle validation errors
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    return {
      success: false,
      status: 400,
      message: 'Validation error',
      errors
    };
  }
  
  // Handle duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return {
      success: false,
      status: 409,
      message: `Duplicate value for ${field}`,
      field
    };
  }
  
  // Generic error response
  return {
    success: false,
    status: 500,
    message: `Database error during ${operation}`,
    error: error.message
  };
};

/**
 * Safely execute a database operation with connection and error handling
 * @param operation Function containing the database operation to perform
 * @param operationName Name of the operation for error messages
 * @returns Result of the operation or error object
 */
export const executeDbOperation = async (operation: Function, operationName: string) => {
  try {
    // Ensure database is connected
    await dbConnect();
    
    // Execute the operation
    const result = await operation();
    return { success: true, data: result };
  } catch (error) {
    return handleDbError(error, operationName);
  }
};

/**
 * Creates a new document in the specified collection
 * @param model Mongoose model
 * @param data Document data to create
 * @returns Created document or error
 */
export const createDocument = async (model: mongoose.Model<any>, data: any) => {
  return executeDbOperation(
    async () => {
      const newDocument = new model(data);
      return await newDocument.save();
    },
    `creating ${model.modelName}`
  );
};

/**
 * Finds documents matching the query in the specified collection
 * @param model Mongoose model
 * @param query Query object to filter documents
 * @param projection Fields to include/exclude
 * @param options Query options (sort, limit, etc.)
 * @returns Array of matching documents or error
 */
export const findDocuments = async (
  model: mongoose.Model<any>,
  query = {},
  projection = {},
  options = {}
) => {
  return executeDbOperation(
    async () => await model.find(query, projection, options),
    `finding ${model.modelName} documents`
  );
};

/**
 * Updates a document by ID with the provided data
 * @param model Mongoose model
 * @param id Document ID
 * @param data Update data
 * @param options Update options
 * @returns Updated document or error
 */
export const updateDocument = async (
  model: mongoose.Model<any>,
  id: string,
  data: any,
  options = { new: true, runValidators: true }
) => {
  return executeDbOperation(
    async () => {
      // Check if document exists
      const exists = await model.exists({ _id: id });
      if (!exists) {
        throw new Error(`${model.modelName} with ID ${id} not found`);
      }
      return await model.findByIdAndUpdate(id, data, options);
    },
    `updating ${model.modelName}`
  );
};

/**
 * Deletes a document by ID
 * @param model Mongoose model
 * @param id Document ID
 * @returns Deletion result or error
 */
export const deleteDocument = async (model: mongoose.Model<any>, id: string) => {
  return executeDbOperation(
    async () => {
      // Check if document exists
      const exists = await model.exists({ _id: id });
      if (!exists) {
        throw new Error(`${model.modelName} with ID ${id} not found`);
      }
      return await model.findByIdAndDelete(id);
    },
    `deleting ${model.modelName}`
  );
};

/**
 * Validates a MongoDB ObjectId string
 * @param id ID string to validate
 * @returns Boolean indicating if ID is valid
 */
export const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Converts string ID to MongoDB ObjectId
 * @param id ID string to convert
 * @returns MongoDB ObjectId
 */
export const toObjectId = (id: string): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId(id);
}; 