import { API_URL } from '../config';

export const buildUrl = (
    value: string,
    params?: {[s: string]: unknown} | ArrayLike<unknown> | undefined
) => {
    let url = `${API_URL}/${value}`;
    let paramString = '';
    if (params) {
        Object.values(params).forEach((param) => {
            paramString = paramString + '/' + param;
        });
    } else {
        url = url + '/';
    }

    return url + paramString;
};
