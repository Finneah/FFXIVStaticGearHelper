export interface BaseSliceError extends Error {
    // If necessary, put more stuff here
    code: string;
}

export interface BaseSliceState<DataType, ErrorType = BaseSliceError> {
    // Partial is necessary to allow multiple requests fetching different subproperties in DataType
    data: DataType;
    loading: boolean;
    error: ErrorType | null;
}

export interface BaseProjectEntity<DataType> {
    id: string;
    data?: DataType;
}
